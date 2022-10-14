import { gql, useMutation, useQuery } from "@apollo/client"
import AdminPage from "@components/admin/AdminPage.component"
import Dashboard from "@components/dashboard/Dashboard.component"
import { DashboardContext } from "@contexts/DashboardContext.context"
import useLoading from "@hooks/useLoading.hook"
import { Button, DatePicker, message, Select } from "antd"
import "antd/dist/antd.css"
import { GET_CUSTOMER } from "graphql/customer/queries"
import { GET_DAFTAR_TTB } from "graphql/daftar_ttb/queries"
import { GET_DAFTAR_TUJUAN } from "graphql/daftar_tujuan/queries"
import { GET_JENIS_PENGIRIMAN } from "graphql/jenis_pengiriman/queries"
import moment from "moment"
import Link from "next/link"
import { useRouter } from "next/router"
import { useContext, useEffect, useRef } from "react"
import { Controller, useFieldArray, useForm } from "react-hook-form"
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

//button on the right style
const buttonStyle = {
	color: `black`,
	backgroundColor: `transparent`,
	border: `1px solid black`,
	marginLeft: `900px`,
	marginBottom: `30px`
}

//text input style
const inputStyle = {
	width: `100%`,
	marginBottom: `10px`
}

//const form style
const buttonStylee = {
	color: `white`,
	backgroundColor: `#1890ff`,
	//no outline
	border: `none`,
	//size
	width: `100px`,
	height: `30px`
}

export default function Home() {
	const formRef = useRef(null)
	const { setLoading } = useLoading()
	const { state: dashboardState } = useContext(DashboardContext)
	const { data, loading, error } = useQuery(GET_DATA)
	//GET DAFTAR TTB
	const { data: dataDaftarTTB } = useQuery(GET_DAFTAR_TTB)
	//GET DATA JENIS PENGIRIMAN
	const { data: dataJenisPengiriman } = useQuery(GET_JENIS_PENGIRIMAN)
	//GET DATA DAFTAR TUJUAN
	const { data: dataDaftarTujuan } = useQuery(GET_DAFTAR_TUJUAN)
	//GET DATA CUSTOMER
	const { data: dataCustomer } = useQuery(GET_CUSTOMER)
	const router = useRouter()
	const setForm = useForm()
	const {
		control,
		reset,
		register,
		watch,
		handleSubmit,
		getValues,
		setValue,
		formState: { isDirty, errors }
	} = setForm

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

	const { Option } = Select
	const handleChange = (value: string[]) => {
		console.log(`selected ${value}`)
	}

	const { fields, append, remove } = useFieldArray({
		control,
		name: `test`
	})
	function addLeadingZeros(num, totalLength) {
		return String(num).padStart(totalLength, `0`)
	}
	const panjangSalesOrder = data?.daftar_sales_order.length + 1
	async function onSubmit(formData) {
		setLoading(true)
		try {
			const objArray = Object.keys(formData).map((i) => formData[i])

			const myChildren = objArray
			const datas = myChildren.shift()
			//get panjang sales order

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
	}, [total])

	useEffect(() => {
		console.log(`watch`, watch(`harga`))
	}, [watch(`harga`)])

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
