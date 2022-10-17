import { gql, useMutation, useQuery } from "@apollo/client"
import IconPrint from "@assets/icons/icon-print.svg"
import AdminPage from "@components/admin/AdminPage.component"
import Dashboard from "@components/dashboard/Dashboard.component"
import Access from "@components/util/Access.component"
import useLoading from "@hooks/useLoading.hook"
import { Button, message, Popconfirm } from "antd"
import "antd/dist/antd.css"
import { GET_CUSTOMER } from "graphql/customer/queries"
import { GET_DAFTAR_TTB } from "graphql/daftar_ttb/queries"
import moment from "moment"
import Link from "next/link"
import { useRouter } from "next/router"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import {
	CREATE_DAFTAR_SALES_ORDER,
	DELETE_DAFTAR_SALES_ORDER
} from "../../../../graphql/daftar_sales_order/mutations"

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
			dp
			tanggal_sales_order
			term_payment
		}
	}
`

export default function Home() {
	const { setLoading } = useLoading()

	const router = useRouter()
	const id = router.query.id

	//GET DAFTAR TTB
	const { data: dataDaftarTTB } = useQuery(GET_DAFTAR_TTB)

	//GET DATA CUSTOMER
	const { data: dataCustomer } = useQuery(GET_CUSTOMER)
	const setForm = useForm()
	const { register, handleSubmit, watch, setValue, reset } = setForm
	const { data } = useQuery(GET_DATA, {
		onCompleted({ daftar_sales_order }) {
			const data = daftar_sales_order
			const filteredData = daftar_sales_order?.filter(
				(item) => item.id === parseInt(id as string)
			)
			const ttb_number = filteredData[0]?.nomor_ttb
			const pengirim = filteredData[0]?.pengirim
			//filter by kode_t
			var sales = data.filter(function (el) {
				return el.ttb_number === ttb_number && el.pengirim === pengirim
			})
			reset({ sales })
		}
	})

	const [createDaftar_sales_order] = useMutation(CREATE_DAFTAR_SALES_ORDER, {
		refetchQueries: [{ query: GET_DATA }]
	})

	//create mutation function
	const createData = (data) => {
		createDaftar_sales_order({ variables: { input: data } })
	}
	const [deleteDaftar_sales_order] = useMutation(DELETE_DAFTAR_SALES_ORDER, {
		refetchQueries: [{ query: GET_DATA }]
	})
	const deleteData = (id) => {
		deleteDaftar_sales_order({ variables: { deleteDaftar_sales_orderId: id } })
		router.push(`/order/daftar-sales-order`)
	}
	//get all ttb number in sales order
	const daftar_sales_order = data?.daftar_sales_order?.map(
		(item) => item.nomor_ttb
	)

	const filterSalesOrdered = data?.daftar_sales_order?.filter(
		(item) => item.id === parseInt(id as string)
	)

	const dataFilterId = filterSalesOrdered?.map((item) => item.id)

	const deleteAll = () => {
		// eslint-disable-next-line array-callback-return
		dataFilterId.map((item) => {
			deleteData(item)
		})
		//message
		message.success(`Data berhasil dihapus`)
	}

	async function onSubmit(formData) {
		setLoading(true)
		try {
			const objArray = Object.keys(formData).map((i) => formData[i])

			if (formData.total_volume === ``) {
				formData.total_volume = filterSalesOrdered?.[0]?.total_volume
			}
			if (formData.harga === ``) {
				formData.harga = filterSalesOrdered?.[0]?.harga
			}
			if (
				formData.total_tagihan === undefined ||
				formData.total_tagihan === ``
			) {
				formData.total_tagihan = filterSalesOrdered?.[0]?.total_tagihan
			}
			if (formData.nama_kapal === ``) {
				formData.nama_kapal = filterSalesOrdered?.[0]?.nama_kapal
			}
			if (formData.tanggal_sales_order === ``) {
				formData.tanggal_sales_order =
					filterSalesOrdered?.[0]?.tanggal_sales_order
			}

			const generateDateSalesOrder = () => {
				const date = new Date(formData.tanggal_sales_order)
				const newDate = new Date(date)
				newDate.setDate(newDate.getDate() + 1)
				return newDate
			}

			const myChildrenArray = objArray.map((item) => {
				return {
					nomor_ttb: formData.nomor_ttb,
					nomor_sales_order: filterSalesOrdered?.[0]?.nomor_sales_order,
					total_volume: parseInt(formData.total_volume_ttb),
					harga: parseInt(formData.harga),
					pengirim: formData.pengirim,
					total_tagihan: parseInt(formData.total_tagihan),
					kota_tujuan: formData.kota_tujuan,
					nama_kapal: formData.nama_kapal,
					dp: formData.dp,
					tanggal_sales_order: generateDateSalesOrder(),
					term_payment: filterSalesOrdered?.[0]?.term_payment
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

			for (let i = 0; i < myChildrenArrayMerge.length; i++) {
				createData(myChildrenArrayMerge[i])
			}
			deleteData(parseInt(id as string))
			router.push(`/order/daftar-sales-order`)
			message.success(`Data Berhasil Disimpan`)
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

	//exclude ttb number where in daftar_sales_order
	const excludeTTB = mergeTTB?.filter(
		(item) => !daftar_sales_order?.includes(item.nomor_ttb)
	)

	//filter ttb
	const filterTTB = mergeTTB?.filter((ttb) => {
		return ttb.nomor_ttb === filterSalesOrdered?.[0]?.nomor_ttb
	})

	//turn dataCustomer.tipe_ppn to percentage where nama_customer === filterTTB2.pengirim
	const filterCustomer = dataCustomer?.daftar_customer?.filter((item) => {
		return item.nama_customer === filterTTB[0]?.pengirim
	})

	//get tipe ppn
	const tipePPN = filterCustomer?.[0]?.tipe_ppn

	//if tipe_ppn is 1% then return 1.01 if 10% then return 1.1
	const tipePPNPercentage = tipePPN === 1 ? 1.01 : 1.1

	// const pengirim = getValues(`pengirim`)

	// if (pengirim === undefined || pengirim == ``) {
	// 	setValue(`nomor_ttb`, filterSalesOrdered?.[0]?.nomor_ttb)
	// 	setValue(`pengirim`, filterTTB?.[0]?.pengirim)
	// 	setValue(`kota_tujuan`, filterTTB?.[0]?.kota_tujuan)
	// 	setValue(`total_volume_ttb`, filterTTB?.[0]?.total_volume)
	// 	setValue(`jenis_pengiriman`, filterTTB?.[0]?.jenis_pengiriman)
	// }

	useEffect(() => {
		console.log(`watch`, watch(`harga`))
	}, [watch])

	useEffect(() => {
		console.log(`watch volume`, watch(`total_volume_ttb`))
	}, [watch])

	const volume = watch(`total_volume_ttb`)
	const harga = watch(`harga`)
	const total = volume * harga * tipePPNPercentage

	useEffect(() => {
		setValue(`total_tagihan`, total)
	}, [setValue, total])

	const handleChangeTTB = (value) => {
		const data = mergeTTB?.find((item) => item.nomor_ttb === value)
		setValue(`pengirim`, data.pengirim)
		setValue(`kota_tujuan`, data.kota_tujuan)
		setValue(`total_volume_ttb`, data.total_volume)
		setValue(`jenis_pengiriman`, data.jenis_pengiriman)
	}

	//change millideimal filterSalesOrdered?.[0]?.tanggal_sales_order to yyyy-mm-dd with mommnet
	const tanggal_sales_order_date = moment
		.unix(filterSalesOrdered?.[0]?.tanggal_sales_order / 1000)
		.format(`YYYY-MM-DD`)

	return (
		<AdminPage
			parent={
				<Link href="/order/daftar-sales-order">
					<a>Daftar Sales Order</a>
				</Link>
			}
			authId=""
			title="Edit Sales Order"
			legend=""
			setForm={setForm}
			action={
				<Access
					auth="write:settings-users"
					yes={
						<ul className="actions">
							<li className="action">
								<Popconfirm
									title="Are you sure delete this task?"
									className="button is-primary"
									onConfirm={() => deleteAll()}
								>
									<Button
										type="primary"
										style={{
											backgroundColor: `white`,
											borderColor: `black`,
											color: `black`,
											marginLeft: `1%`
										}}
									>
										Delete
									</Button>
								</Popconfirm>
							</li>
							<li className="action">
								<button
									className="button button-small button-white button-icon"
									style={{
										backgroundColor: `white`
									}}
									//dispatch
									onClick={() => {
										window.open(
											`/order/daftar-sales-order/print/${id}`,
											`_blank`
										)
									}}
								>
									<i
										className="icon"
										role="img"
										style={{
											marginTop: `-5px`,
											height: `33px`,
											width: `100px`
										}}
									>
										<IconPrint className="svg" />
									</i>
								</button>
							</li>
							<li className="action">
								<Button
									key="submit"
									htmlType="submit"
									className="submit"
									form="formSalesOrder"
									style={{
										backgroundColor: `black`,
										borderColor: `black`
									}}
									type="primary"
								>
									Simpan
								</Button>
							</li>
						</ul>
					}
				/>
			}
		>
			<section className="section">
				<div className="container">
					<form
						className="form"
						id="formSalesOrder"
						onSubmit={handleSubmit(onSubmit)}
					>
						<label
							style={{
								fontSize: `20px`,
								fontWeight: `bolder`
							}}
						>
							Daftar TTB
						</label>
						<div>
							<div
								style={{ display: `inline-block`, width: `20%` }}
								className="col"
								id="sales"
							>
								<label style={{ fontSize: `10px`, fontWeight: `bolder` }}>
									Nomor TTB
								</label>
								<select
									key=""
									{...register(`nomor_ttb`)}
									onChange={(e) => handleChangeTTB(e.target.value)}
									style={{ width: `100%` }}
								>
									<option
										key={filterSalesOrdered?.[0]?.nomor_ttb}
										value={filterSalesOrdered?.[0]?.nomor_ttb}
									>
										{filterSalesOrdered?.[0]?.nomor_ttb}
									</option>
									{excludeTTB
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
									defaultValue={filterTTB?.[0]?.pengirim}
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
										defaultValue={filterTTB?.[0]?.kota_tujuan}
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
									Total Volume
								</label>
								<div className="control">
									<input
										style={{ width: `100%` }}
										className="input"
										type="text"
										defaultValue={filterTTB?.[0]?.total_volume}
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
										defaultValue={filterTTB?.[0]?.jenis_pengiriman}
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
									defaultValue={filterSalesOrdered?.[0]?.harga}
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
									defaultValue={filterSalesOrdered?.[0]?.total_tagihan}
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
								marginLeft: `1%`
							}}
						>
							<label style={{ fontWeight: `bolder` }} className="label">
								DP
							</label>
							<div className="control">
								<input
									style={{ width: `100%` }}
									className="input"
									type="text"
									placeholder="total tagihan"
									defaultValue={filterSalesOrdered?.[0]?.dp}
									{...register(`dp`)}
									readOnly
								/>
								<p style={{ fontSize: `10px` }}>Include PPN 1%</p>
							</div>
						</div>
						<div className="field" style={{ marginTop: `1%` }}>
							<label style={{ fontWeight: `bolder` }} className="label">
								Tanggal sales Order
							</label>
							<div className="control">
								<input
									className="input"
									style={{
										width: `100%`,
										height: `38px`
									}}
									defaultValue={tanggal_sales_order_date}
									placeholder="Tanggal Sales Order"
									type="date"
									{...register(`tanggal_sales_order`)}
									required
								/>
							</div>
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
