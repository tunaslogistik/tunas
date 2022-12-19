/* eslint-disable no-mixed-spaces-and-tabs */
import { gql, useMutation, useQuery } from "@apollo/client"
import IconPrint from "@assets/icons/icon-print.svg"
import AdminPage from "@components/admin/AdminPage.component"
import Dashboard from "@components/dashboard/Dashboard.component"
import FormRepeater from "@components/form/FormRepeater.component"
import Access from "@components/util/Access.component"
import useLoading from "@hooks/useLoading.hook"
import { Button, Popconfirm, message } from "antd"

import { GET_ACCURATE } from "graphql/accurate/queries"
import { GET_CUSTOMER } from "graphql/customer/queries"
import { GET_DAFTAR_TTB } from "graphql/daftar_ttb/queries"
import { GET_PENGATURAN } from "graphql/pengaturan/queries"
import moment from "moment"
import Link from "next/link"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
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
			rekening
			dp
			tanggal_sales_order
			term_payment
			nama_barang
			harga_satuan
			tipe_ppn
			total_harga_ttb
		}
	}
`

export default function Home() {
	const { setLoading } = useLoading()

	const router = useRouter()
	const id = router.query.id

	//GET DAFTAR TTB
	const { data: dataDaftarTTB } = useQuery(GET_DAFTAR_TTB)
	//GET PENGATURAN
	const { data: dataPengaturan } = useQuery(GET_PENGATURAN)

	//GET DATA CUSTOMER
	const { data: dataCustomer } = useQuery(GET_CUSTOMER)

	//GET DATA ACCURATE
	const { data: dataAccurate } = useQuery(GET_ACCURATE)

	const setForm = useForm()

	const taxName = dataAccurate?.accurate?.map((tax) => {
		return {
			label: tax.nama_barang,
			value: tax.kode_barang
		}
	})

	const { control, register, watch, handleSubmit, getValues, setValue, reset } =
		setForm

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
				return el.nomor_ttb === ttb_number && el.pengirim === pengirim
			})

			reset({
				nomor_ttb: filteredData[0]?.nomor_ttb,
				harga: filteredData[0]?.harga,
				total_tagihan: filteredData[0]?.total_tagihan,
				tanggal_sales_order: moment
					.unix(filteredData?.[0]?.tanggal_sales_order / 1000)
					.format(`YYYY-MM-DD`)
			})

			//split filtereddata.harga satuan by ,
			const hargaSatuan = filteredData[0]?.harga_satuan.split(`,`)
			//split filtereddata.nama barang by ,
			const namaBarang = filteredData[0]?.nama_barang.split(`,`)
			//split filtereddata.tipe ppn by ,
			const tipePpn = filteredData[0]?.tipe_ppn.split(`,`)

			var newArray = []
			for (let i = 0; i < namaBarang.length; i++) {
				newArray.push({
					nama_barang: namaBarang[i],
					Harga: hargaSatuan[i],
					tipe_ppn: tipePpn[i]
				})
			}

			reset({ newArray })

			setLoading(false)
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

	const tipe_Ppns = filterSalesOrdered?.[0]?.tipe_ppn.split(`,`)

	//for tipe_Ppns length find taxName in accurate where tipe_ppns === kode_barang
	const taxNames = tipe_Ppns?.map((item) => {
		const taxName = dataAccurate?.accurate?.filter(
			(tax) => tax.kode_barang === item
		)
		return taxName?.[0]?.nama_barang
	})

	//reset data to  formRepeater
	const mapOption = filterSalesOrdered?.map((item) => {
		return {
			label: taxNames,
			value: taxNames
		}
	})

	//split filtereddata.harga satuan by ,
	const hargaSatuan = filterSalesOrdered?.[0]?.harga_satuan.split(`,`)

	const dataFilterId = filterSalesOrdered?.map((item) => item.id)

	const deleteAll = () => {
		// eslint-disable-next-line array-callback-return
		dataFilterId.map((item) => {
			deleteData(item)
		})
		//message
		message.success(`Data berhasil dihapus`)
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
	const filterCustomer = dataCustomer?.customer?.filter((item) => {
		return item.nama_customer === filterTTB?.[0]?.pengirim
	})

	//get tipe ppn
	const tipePPN = filterCustomer?.[0]?.tipe_ppn

	//get only number from tipe ppn
	const tipePPNNumber = tipePPN?.replace(/[^0-9]/g, ``)

	//if tipe_ppn is 1% then return 1.01 if 10% then return 1.1
	const tipePPNPercentage = tipePPNNumber / 100

	const PPN =
		watch(`total_volume_ttb`) !== 0
			? watch(`total_volume_ttb`) * Number(watch(`harga`)) * tipePPNPercentage
			: Number(watch(`harga`)) * tipePPNPercentage

	const volume = watch(`total_volume_ttb`)
	const harga = watch(`harga`)

	const newArray1 = watch(`newArray`)

	const harga_tambahan = newArray1?.map((item) => {
		if (item.Harga === 0) {
			return 0
		} else {
			if (
				String(item.tipe_ppn) !== `null` ||
				String(item.tipe_ppn) !== `` ||
				String(item.tipe_ppn) !== `undefined`
			) {
				//find and get taxName from dataAccurate where item.tipe_ppn === kode_barang
				const taxName = dataAccurate?.accurate?.find((tax) => {
					return tax.kode_barang === item.tipe_ppn
				})
				return Number(taxName?.taxName?.replace(/[^0-9]/g, ``)) !== 0
					? parseInt(item.Harga) +
							(parseInt(item.Harga) *
								Number(taxName?.taxName?.replace(/[^0-9]/g, ``))) /
								100
					: parseInt(item.Harga) + 0
			} else {
				return parseInt(item.Harga)
			}
		}
	})

	//sum harga
	const sumHarga = harga_tambahan?.reduce((a, b) => a + b, 0)

	const totalTagihan =
		volume !== 0
			? Number(volume) * Number(harga) + PPN + sumHarga
			: Number(harga) + PPN + sumHarga

	const harga_sesudah_ppn =
		volume !== 0 ? Number(volume) * Number(harga) + PPN : Number(harga) + PPN

	//number

	//set total tagihan
	const [tagihans, setTagihans] = useState(totalTagihan)

	useEffect(() => {
		setTagihans(totalTagihan)
	}, [totalTagihan])

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

	const dataBank = dataPengaturan?.pengaturan?.map((item) => {
		return {
			nama_bank: item.bank
		}
	})

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

			const namaBarang = formData.newArray.map((item) => item.nama_barang)

			const hargaBarang = formData.newArray.map((item) => item.Harga)

			//sum hargaBarang
			const sumHargaBarang = hargaBarang?.reduce(
				(a, b) => parseInt(a) + parseInt(b),
				0
			)

			//get ppn from newArray formData
			const ppn = formData.newArray.map((item) => item.tipe_ppn)

			//join nama barang into 1 string with ,
			const namaBarangString = namaBarang.join(`,`)

			//join harga into 1 string with ,
			const hargaString = hargaBarang.join(`,`)

			//join ppn into 1 string with ,
			const ppnString = ppn.join(`,`)

			const myChildrenArray = objArray.map((item) => {
				return {
					nomor_ttb: formData.nomor_ttb,
					nomor_sales_order: filterSalesOrdered?.[0]?.nomor_sales_order,
					total_volume: parseInt(formData.total_volume_ttb),
					harga: parseInt(formData.harga),
					pengirim: formData.pengirim,
					harga_sesudah_ppn: harga_sesudah_ppn,
					total_tagihan: totalTagihan,
					kota_tujuan: formData.kota_tujuan,
					rekening: formData.rekening,
					dp: parseInt(formData.dp),
					tanggal_sales_order: generateDateSalesOrder(),
					term_payment: filterSalesOrdered?.[0]?.term_payment,
					nama_barang: namaBarangString,
					itemNo: ``,
					harga_satuan: hargaString,
					harga_total: parseInt(sumHarga),
					tipe_ppn: ppnString,
					//if sumHargaBarang is not 0 total_harga_ttb = Number(volume) * Number(harga) + sumHargaBarang else Number(volume) * Number(harga)
					total_harga_ttb: Number(volume) * Number(harga)
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
							style={{ width: `75%`, marginTop: `20px` }}
							className="content"
						>
							<label
								style={{ fontWeight: `bold`, paddingLeft: `5px` }}
								className="label"
							>
								Biaya Tambahan
							</label>
							<FormRepeater
								setForm={setForm}
								control={control}
								register={register}
								name="newArray"
								inputNames={[`nama_barang`, `Harga`, `tipe_ppn`]}
								inputLabels={[`Nama Barang`, `Harga`, `PPN`]}
								inputTypes={[`text`, `text`, `select`]}
								inputProps={[
									{},
									{},
									{
										options: taxName,
										defaultValue: mapOption
									}
								]}
							/>
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
									value={tagihans}
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
								Pembayaran DP
							</label>
							<div className="control">
								<input
									style={{ width: `100%` }}
									className="input"
									type="text"
									placeholder="total tagihan"
									defaultValue={filterSalesOrdered?.[0]?.dp}
									{...register(`dp`)}
								/>
								<p style={{ fontSize: `10px`, color: `white` }}>
									Dalam satuan rupiah
								</p>
							</div>
						</div>
						<div className="field">
							<label style={{ fontWeight: `bolder` }} className="label">
								Rekening
							</label>
							<div className="control">
								<select
									style={{ width: `100%` }}
									className="input"
									{...register(`rekening`)}
								>
									<option defaultValue={filterSalesOrdered?.[0]?.rekening}>
										{filterSalesOrdered?.[0]?.rekening}
									</option>
									{dataBank?.map((item, index) => {
										return (
											<option key={index} value={item.nama_bank}>
												{item.nama_bank}
											</option>
										)
									})}
								</select>
							</div>
						</div>
						<div className="field" style={{ marginTop: `1%` }}>
							<label style={{ fontWeight: `bolder` }} className="label">
								Tanggal Sales Order
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
