/* eslint-disable no-mixed-spaces-and-tabs */
import { gql, useMutation, useQuery } from "@apollo/client"
import AdminPage from "@components/admin/AdminPage.component"
import Dashboard from "@components/dashboard/Dashboard.component"
import FormRepeater from "@components/form/FormRepeater.component"
import useLoading from "@hooks/useLoading.hook"
import { Button, DatePicker, message } from "antd"

import { GET_ACCURATE } from "graphql/accurate/queries"
import { GET_CUSTOMER } from "graphql/customer/queries"
import { GET_DAFTAR_TTB } from "graphql/daftar_ttb/queries"
import { GET_PENGATURAN } from "graphql/pengaturan/queries"
import { UPDATE_REFERENCE_SALES_ORDER } from "graphql/reference_sales_order/mutations"
import { GET_REFERENCE_SALES_ORDER } from "graphql/reference_sales_order/queries"
import moment from "moment"
import Link from "next/link"
import { useRouter } from "next/router"
import { useEffect } from "react"
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
			rekening
			kota_tujuan
			tanggal_sales_order
			term_payment
		}
	}
`

export default function Home() {
	const { setLoading } = useLoading()
	const { data } = useQuery(GET_DATA)

	const { data: dataDaftarTTB } = useQuery(GET_DAFTAR_TTB)
	//GET DATA CUSTOMER
	const { data: dataCustomer } = useQuery(GET_CUSTOMER)
	//GET DATA PENGATURAN
	const { data: dataPengaturan } = useQuery(GET_PENGATURAN)
	//GET DATA ACCURATE
	const { data: dataAccurate } = useQuery(GET_ACCURATE)
	//GET DATA REFERENCE SALES ORDER
	const { data: dataReferenceSalesOrder } = useQuery(GET_REFERENCE_SALES_ORDER)

	const router = useRouter()
	const setForm = useForm()
	const { control, register, watch, handleSubmit, getValues, setValue } =
		setForm

	const [createDaftar_sales_order] = useMutation(CREATE_DAFTAR_SALES_ORDER, {
		refetchQueries: [{ query: GET_DATA }]
	})

	//create mutation function
	const createData = (data) => {
		createDaftar_sales_order({ variables: { input: data } })
	}

	//UPDATE
	const [updateReferenceSalesOrder] = useMutation(
		UPDATE_REFERENCE_SALES_ORDER,
		{
			refetchQueries: [{ query: GET_REFERENCE_SALES_ORDER }]
		}
	)

	const updateData = (data) => {
		updateReferenceSalesOrder({ variables: { input: data } })
	}

	//GET TAX OPTION DATAACCURATE TAXNAME
	const taxName = dataAccurate?.accurate?.map((tax) => {
		return {
			label: tax.nama_barang,
			value: tax.kode_barang
		}
	})

	console.log(`taxName`, taxName)

	function addLeadingZeros(num, totalLength) {
		return String(num).padStart(totalLength, `0`)
	}
	const panjangSalesOrder = data?.daftar_sales_order.length + 1

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

	//get only number from tipe ppn
	const tipePPNNumber = tipePPN?.replace(/[^0-9]/g, ``)

	//convert tipePPN to percentage
	const tipePPNPercentage = tipePPNNumber / 100

	const PPN =
		getValues(`total_volume_ttb`) !== 0
			? getValues(`total_volume_ttb`) *
			  Number(getValues(`harga`)) *
			  tipePPNPercentage
			: Number(getValues(`harga`)) * tipePPNPercentage

	console.log(`Percentages`, PPN)

	const total =
		getValues(`total_volume_ttb`) !== 0
			? getValues(`total_volume_ttb`) * Number(getValues(`harga`)) + PPN
			: Number(getValues(`harga`)) + PPN

	const harga_sesudah_ppn =
		getValues(`total_volume_ttb`) !== 0
			? getValues(`total_volume_ttb`) * Number(getValues(`harga`)) + PPN
			: Number(getValues(`harga`)) + PPN

	const newArray1 = watch(`newArray`)

	const harga = newArray1?.map((item) => {
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
				return (
					parseInt(item.Harga) +
					(parseInt(item.Harga) *
						Number(taxName?.taxName?.replace(/[^0-9]/g, ``))) /
						100
				)
			} else {
				return parseInt(item.Harga)
			}
		}
	})
	console.log(`harga`, harga)

	//sum harga
	const sumHarga = harga?.reduce((a, b) => a + b, 0)

	//if sumHarga not empty then total + sumHarga
	const total2 = sumHarga ? total + parseInt(sumHarga) : total

	setValue(`total_tagihan`, total2)

	const handleChangeTTB = (value) => {
		const data = mergeTTB?.find((item) => item.nomor_ttb === value)
		setValue(`pengirim`, data.pengirim)
		setValue(`kota_tujuan`, data.kota_tujuan)
		setValue(`total_volume_ttb`, data.total_volume)
		setValue(`jenis_pengiriman`, data.jenis_pengiriman)
		setValue(`total_tagihan`, total)
	}

	useEffect(() => {
		setValue(`total_tagihan`, total2)
	}, [setValue, total2])

	useEffect(() => {
		console.log(`watch`, watch(`harga`))
	}, [watch])

	const dataBank = dataPengaturan?.pengaturan?.map((item) => {
		return {
			nama_bank: item.bank
		}
	})

	console.log(`harga`, harga)

	async function onSubmit(formData) {
		setLoading(true)
		try {
			//get data from dataReferenceSalesOrder where kode_tujuan === kota_tujuan
			const dataReferenceSO =
				dataReferenceSalesOrder?.reference_sales_order?.filter(
					(item: any) => item.kode_tujuan === formData.kota_tujuan
				)

			console.log(`dataReferenceSO`, dataReferenceSO)
			const objArray = Object.keys(formData).map((i) => formData[i])

			const namaBarang = formData.newArray.map((item) => item.nama_barang)

			const hargaBarang = formData.newArray.map((item) => item.Harga)

			//get ppn from newArray formData
			const ppn = formData.newArray.map((item) => item.tipe_ppn)

			//join nama barang into 1 string with ,
			const namaBarangString = namaBarang.join(`,`)

			//join harga into 1 string with ,
			const hargaString = hargaBarang.join(`,`)

			//join ppn into 1 string with ,
			const ppnString = ppn.join(`,`)
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
							moment.unix(formData.tanggal_sales_order / 1000).format(`YY-MM`)
						) +
						`/` +
						addLeadingZeros(panjangSalesOrder, 4),
					total_volume: parseInt(formData.total_volume_ttb),
					harga: parseInt(formData.harga),
					harga_sesudah_ppn: harga_sesudah_ppn,
					pengirim: formData.pengirim,
					total_tagihan: parseInt(formData.total_tagihan),
					rekening: formData.rekening,
					kota_tujuan: formData.kota_tujuan,
					dp: parseInt(formData.dp),
					tanggal_sales_order: formData.tanggal_sales_order,
					term_payment: termPayment,
					nama_barang: namaBarangString,
					itemNo: ``,
					harga_satuan: hargaString,
					harga_total: parseInt(sumHarga),
					tipe_ppn: ppnString,
					total_harga_ttb:
						getValues(`total_volume_ttb`) * Number(getValues(`harga`))
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

			myChildrenArrayMerge.map((item) => {
				//if String(moment.unix(values.tanggal_sales_order / 1000).format(`YY-MM`)) !== dataReferenceSO[0].tanggal_tahun then addleadingg zeros(1,4) else addleadingzeros(dataReferenceSO + 1,4)
				if (
					String(moment.unix(item.tanggal_sales_order / 1000).format(`MM`)) !==
					dataReferenceSO[0].bulan_tahun
				) {
					item.nomor_sales_order =
						`SO/` +
						formData.kota_tujuan +
						`/` +
						String(
							moment.unix(formData.tanggal_sales_order / 1000).format(`YY-MM`)
						) +
						`/` +
						addLeadingZeros(1, 4)
				} else {
					item.nomor_sales_order =
						`SO/` +
						formData.kota_tujuan +
						`/` +
						String(
							moment.unix(formData.tanggal_sales_order / 1000).format(`YY-MM`)
						) +
						`/` +
						addLeadingZeros(dataReferenceSO[0].increment + 1, 4)
				}
			})

			//create new data
			for (let i = 0; i < myChildrenArrayMerge.length; i++) {
				createData(myChildrenArrayMerge[i])
				console.log(`create data`, myChildrenArrayMerge[i])
			}

			//if String(moment.unix(values.tanggal_sales_order/ 1000).format(`YY-MM`)) !== dataReferenceSO[0].tanggal_tahun then increment = 1 else increment = dataReferenceSO[0].increment + 1
			const increment =
				String(moment.unix(formData.tanggal_ttb / 1000).format(`MM`)) !==
				dataReferenceSO[0]?.bulan_tahun
					? 1
					: dataReferenceSO[0]?.increment + 1

			const tanggal_tahun = String(
				moment.unix(formData.tanggal_sales_order / 1000).format(`YY-MM`)
			)

			const dataReferenceSalesupdate = {
				id: dataReferenceSO[0]?.id,
				increment: increment,
				tanggal_tahun: tanggal_tahun,
				bulan_tahun: String(
					moment.unix(formData.tanggal_sales_order / 1000).format(`MM`)
				)
			}

			updateData(dataReferenceSalesupdate)

			message.success(`Data Berhasil Disimpan`)
			router.push(`/order/daftar-sales-order`)
		} catch (error) {
			console.log(error)
		}
		setLoading(false)
	}

	console.log(`dataBank`, dataPengaturan)
	return (
		<AdminPage
			parent={
				<Link href="/order/daftar-sales-order">
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
							style={{ width: `50%`, marginTop: `20px` }}
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
										options: taxName
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
								Total Tagihan inc. PPN (Rp)
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
								<p style={{ fontSize: `10px` }}>
									Tidak Termasuk Biaya Tambahan
								</p>
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
							</div>
							<p style={{ fontSize: `10px`, color: `white` }}>
								Dalam satuan rupiah
							</p>
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
									<option value="">Pilih Bank</option>
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
