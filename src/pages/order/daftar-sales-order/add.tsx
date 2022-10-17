import { gql, useMutation, useQuery } from "@apollo/client"
import AdminPage from "@components/admin/AdminPage.component"
import Dashboard from "@components/dashboard/Dashboard.component"
import useLoading from "@hooks/useLoading.hook"
import { Button, DatePicker, message } from "antd"
import "antd/dist/antd.css"
import { GET_CUSTOMER } from "graphql/customer/queries"
import { GET_DAFTAR_TTB } from "graphql/daftar_ttb/queries"
import moment from "moment"
import Link from "next/link"
import { useRouter } from "next/router"
import { useEffect, useRef } from "react"
import { Controller, useForm } from "react-hook-form"
import { CREATE_DAFTAR_SALES_ORDER } from "../../../../graphql/daftar_sales_order/mutations"
//get data

const GET_DATA = gql`
	query daftar_sales_order {
		daftar_sales_order {
			id
			nomor_ttb
			nomor_sales_order
			total_volume
			harga
			total_tagihan
			kota_tujuan
			nama_kapal
			tanggal_keberangkatan
			tanggal_sales_order
			term_payment
		}
	}
`

export default function Home() {
	const formRef = useRef(null)
	const { setLoading } = useLoading()
	const { data } = useQuery(GET_DATA)
	//GET DAFTAR TTB
	const { data: dataDaftarTTB } = useQuery(GET_DAFTAR_TTB)
	//GET DATA CUSTOMER
	const { data: dataCustomer } = useQuery(GET_CUSTOMER)
	const router = useRouter()
	const setForm = useForm()
	const { control, register, watch, handleSubmit, getValues, setValue } =
		setForm

	useEffect(() => {
		formRef.current?.setFieldsValue({
			nomor_ttb: data?.nomor_ttb
		})
	}, [data])

	const [createDaftar_sales_order] = useMutation(CREATE_DAFTAR_SALES_ORDER, {
		refetchQueries: [{ query: GET_DATA }]
	})

	//create mutation function
	const createData = (data) => {
		createDaftar_sales_order({ variables: { input: data } })
	}

	function addLeadingZeros(num, totalLength) {
		return String(num).padStart(totalLength, `0`)
	}
	const panjangSalesOrder = data?.daftar_sales_order.length + 1
	async function onSubmit(formData) {
		setLoading(true)
		try {
			const objArray = Object.keys(formData).map((i) => formData[i])

			//get term payment from customer where nama customer = formdata.pengirim
			const termPayment = dataCustomer?.customer.find(
				(item) => item.nama_customer === formData.pengirim
			).term_payment
			const myChildrenArray = objArray.map((item) => {
				return {
					nomor_ttb: formData.nomor_ttb,
					nomor_sales_order:
						`SO/` +
						formData.kota_tujuan +
						`/` +
						String(
							moment.unix(formData.tanggal_sales_order / 1000).format(`DD-MM`)
						) +
						`/` +
						addLeadingZeros(panjangSalesOrder, 4),
					total_volume: parseInt(formData.total_volume_ttb),
					harga: parseInt(formData.harga),
					pengirim: formData.pengirim,
					total_tagihan: parseInt(formData.total_tagihan),
					kota_tujuan: formData.kota_tujuan,
					dp: parseInt(formData.dp),
					tanggal_sales_order: formData.tanggal_sales_order,
					term_payment: termPayment
				}
			})

			//merge duplicate
			const myChildrenArrayMerge = myChildrenArray.reduce((acc, cur) => {
				const x = acc.find(
					(item) => item.nomor_sales_order === cur.nomor_sales_order
				)
				if (!x) {
					return acc.concat([cur])
				} else {
					return acc
				}
			}, [])

			//create new data
			for (let i = 0; i < myChildrenArrayMerge.length; i++) {
				createData(myChildrenArrayMerge[i])
				console.log(`My`, myChildrenArrayMerge)
			}
			message.success(`Data Berhasil Disimpan`)
			router.push(`/order/daftar-sales-order`)
		} catch (error) {
			console.log(error)
		}
		setLoading(false)
	}

	//MAP DATA DAFTAR TTB
	const mapDaftarTTB = dataDaftarTTB?.daftar_ttb?.map((ttb) => {
		return {
			nomor_ttb: ttb.ttb_number,
			pengirim: ttb.pengirim,
			kota_tujuan: ttb.kota_tujuan,
			total_volume: ttb.total_volume,
			jenis_pengiriman: ttb.jenis_pengiriman
		}
	})
	//make a loop to merge duplicate ttb number
	const mergeTTB = mapDaftarTTB?.reduce((acc, curr) => {
		if (!acc.some((item) => item.nomor_ttb === curr.nomor_ttb)) {
			acc.push(curr)
		}
		return acc
	}, [])
	console.log(`data nya ialah`, mergeTTB)

	//filter ttb where ttb number not in sales order
	const filterTTB = mergeTTB?.filter((item) => {
		return !data?.daftar_sales_order.some((item2) => {
			return item2.nomor_ttb === item.nomor_ttb
		})
	})

	//get ttb where same with getvalues(nomor_ttb)
	const filterTTB2 = mergeTTB?.filter((item) => {
		return item.nomor_ttb === getValues(`nomor_ttb`)
	})

	//turn dataCustomer.tipe_ppn to percentage where nama_customer === filterTTB2.pengirim
	const filterCustomer = dataCustomer?.customer.filter((item) => {
		return item.nama_customer === filterTTB2?.[0]?.pengirim
	})

	//get tipe ppn
	const tipePPN = filterCustomer?.[0]?.tipe_ppn

	//convert number to percentage
	const tipePPNPercentage = (tipePPN / 100) * 100

	//setValue based on nomor ttb

	const total =
		parseFloat(getValues(`total_volume_ttb`)) *
		parseFloat(getValues(`harga`)) *
		tipePPNPercentage

	setValue(`total_tagihan`, total)
	const handleChangeTTB = (value) => {
		const data = mergeTTB?.find((item) => item.nomor_ttb === value)
		setValue(`pengirim`, data.pengirim)
		setValue(`kota_tujuan`, data.kota_tujuan)
		setValue(`total_volume_ttb`, data.total_volume)
		setValue(`jenis_pengiriman`, data.jenis_pengiriman)
		setValue(`total_tagihan`, total)
	}

	useEffect(() => {
		setValue(`total_tagihan`, total)
	}, [setValue, total])

	useEffect(() => {
		console.log(`watch`, watch(`harga`))
	}, [watch])

	console.log(`watch total`, tipePPNPercentage)

	//total volume * harga + 1%
	return (
		<AdminPage
			parent={
				<Link href="/order/daftar-ttb">
					<a>Daftar Sales Order</a>
				</Link>
			}
			authId=""
			title="Tambah Sales Order"
			legend=""
			setForm={setForm}
		>
			<section className="section">
				<div className="container">
					<form className="form" onSubmit={handleSubmit(onSubmit)}>
						<br></br>
						<label style={{ fontSize: `20px`, fontWeight: `bolder` }}>
							Daftar TTB
						</label>
						<div>
							<div
								style={{ display: `inline-block`, width: `20%` }}
								className="col"
							>
								<label style={{ fontSize: `10px`, fontWeight: `bolder` }}>
									Nomor TTB
								</label>
								<select
									{...register(`nomor_ttb`)}
									onChange={(e) => handleChangeTTB(e.target.value)}
									style={{ width: `100%` }}
									required
								>
									<option value="">Pilih Nomor TTB</option>
									{filterTTB
										?.map((ttb) => {
											return (
												<option key={ttb.nomor_ttb} value={ttb.nomor_ttb}>
													{ttb.nomor_ttb}
												</option>
											)
										})
										?.reverse()}
								</select>
							</div>
							<div
								style={{
									display: `inline-block`,
									width: `20%`,
									marginLeft: `1%`
								}}
								className="col"
							>
								<label style={{ fontSize: `10px`, fontWeight: `bolder` }}>
									Pengirim
								</label>
								<input
									style={{ width: `100%` }}
									className="input"
									type="text"
									placeholder="Pengirim"
									{...register(`pengirim`)}
									readOnly
								/>
							</div>
							<div
								style={{
									display: `inline-block`,
									marginLeft: `1%`,
									width: `20%`
								}}
								className="field"
							>
								<label style={{ fontSize: `10px`, fontWeight: `bolder` }}>
									Kota Tujuan
								</label>
								<div className="control">
									<input
										style={{ width: `100%` }}
										className="input"
										type="text"
										placeholder="Kota Tujuan"
										{...register(`kota_tujuan`)}
										readOnly
									/>
								</div>
							</div>
							<div
								style={{
									display: `inline-block`,
									marginLeft: `1%`,
									width: `15%`
								}}
								className="field"
							>
								<label style={{ fontSize: `10px`, fontWeight: `bolder` }}>
									Volume M³
								</label>
								<div className="control">
									<input
										style={{ width: `100%` }}
										className="input"
										type="text"
										placeholder="Total Volume"
										{...register(`total_volume_ttb`)}
										readOnly
									/>
								</div>
							</div>
							<div
								style={{
									display: `inline-block`,
									marginLeft: `1%`,
									width: `21%`
								}}
								className="field"
							>
								<label style={{ fontSize: `10px`, fontWeight: `bolder` }}>
									Jenis Pengiriman
								</label>
								<div className="control">
									<input
										style={{ width: `100%` }}
										className="input"
										type="text"
										placeholder="Jenis Pengiriman"
										{...register(`jenis_pengiriman`)}
										readOnly
									/>
								</div>
							</div>
						</div>
						<div className="field" style={{ marginTop: `1%` }}>
							<label style={{ fontWeight: `bolder` }} className="label">
								Harga
							</label>
							<div className="control">
								<input
									style={{ width: `100%` }}
									className="input"
									type="text"
									placeholder="harga"
									onChange={(e) => handleChangeTTB(e.target.value)}
									{...register(`harga`)}
									required
								/>
								<p style={{ fontSize: `10px` }}>Min. 0.5m³ </p>
							</div>
						</div>
						<div
							className="field"
							style={{
								display: `inline-block`,
								width: `calc(50% - 8px)`,
								marginTop: `1%`
							}}
						>
							<label style={{ fontWeight: `bolder` }} className="label">
								Total Tagihan inc. PPN 1% (Rp)
							</label>
							<div className="control">
								<input
									style={{ width: `100%` }}
									className="input"
									type="text"
									placeholder="total tagihan"
									{...register(`total_tagihan`)}
									readOnly
								/>
								<p style={{ fontSize: `10px` }}>Include PPN 1%</p>
							</div>
						</div>
						<div
							className="field"
							style={{
								display: `inline-block`,
								width: `calc(50% - 8px)`,
								marginTop: `1%`,
								marginLeft: `1%`
							}}
						>
							<label style={{ fontWeight: `bolder` }} className="label">
								Pembayaran DP (Rp)
							</label>
							<div className="control">
								<input
									style={{ width: `100%` }}
									className="input"
									type="text"
									placeholder="Pembayaran DP"
									{...register(`dp`)}
								/>
								<p style={{ fontSize: `10px` }}>Include PPN 1%</p>
							</div>
						</div>
						<div className="field" style={{ marginTop: `1%` }}>
							<label style={{ fontWeight: `bolder` }} className="label">
								Tanggal sales Order
							</label>
							<div className="control">
								<Controller
									control={control}
									name="tanggal_sales_order"
									rules={{ required: true }}
									render={({ field }) => (
										<DatePicker
											{...field}
											style={{
												width: `100%`,
												height: `38px`
											}}
											format={`DD/MM/YYYY`}
											placeholder="Tanggal Sales Order"
											onChange={(date) => field.onChange(date)}
											className="form-control"
										/>
									)}
								/>
							</div>
						</div>
						<div className="form-group">
							<Button
								key="submit"
								htmlType="submit"
								className="submit"
								style={{
									marginTop: `3%`,
									marginLeft: `91%`,
									marginBottom: `30px`,
									backgroundColor: `black`,
									borderColor: `black`
								}}
								type="primary"
							>
								Simpan
							</Button>
						</div>
					</form>
				</div>
			</section>
		</AdminPage>
	)
}
Home.getLayout = function getLayout(page) {
	return <Dashboard>{page}</Dashboard>
}
