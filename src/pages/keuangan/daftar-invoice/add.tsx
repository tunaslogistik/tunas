import { gql, useMutation, useQuery } from "@apollo/client"
import IconPlus from "@assets/icons/icon-plus-fill.svg"
import IconTrash from "@assets/icons/icon-trash.svg"
import AdminPage from "@components/admin/AdminPage.component"
import Dashboard from "@components/dashboard/Dashboard.component"
import FormRepeater from "@components/form/FormRepeater.component"
import useLoading from "@hooks/useLoading.hook"
import { Button, DatePicker, notification } from "antd"
import { GET_ACCURATE } from "graphql/accurate/queries"
import { GET_CUSTOMER } from "graphql/customer/queries"
import { CREATE_DAFTAR_INVOICE } from "graphql/daftar_invoice/mutations"
import { GET_DAFTAR_SALES_ORDER } from "graphql/daftar_sales_order/queries"
import { GET_DAFTAR_TTB } from "graphql/daftar_ttb/queries"
import moment from "moment"
import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import { Controller, useFieldArray, useForm } from "react-hook-form"

//get data

const GET_DATA = gql`
	query daftar_surat_jalan {
		daftar_surat_jalan {
			id
			nomor_surat_jalan
			nomor_ttb
			nama_kapal
			vendor_pelayanan
			tanggal_surat_jalan
			tanggal_keberangkatan
			nomor_container
			nomor_seal
			keterangan
		}
	}
`

//get data
const GET_INVOICE = gql`
	query daftar_invoice {
		daftar_invoice {
			id
			nomor_invoice
			nomor_surat_jalan
			nomor_ttb
			vendor_pelayanan
			koli
			volume
			total_koli
			nama_barang
			harga
			harga_biaya_tambahan
			nama_kapal
			total_volume
			tanggal_invoice
			tanggal_keberangkatan
			nomor_container
			nomor_seal
			keterangan
		}
	}
`

export default function Home() {
	const formRef = useRef(null)
	const { setLoading } = useLoading()
	const { data } = useQuery(GET_DATA)
	//GET DAFTAR TTB
	const { data: dataDaftarTTB } = useQuery(GET_DAFTAR_TTB)
	//GET DAFTAR SALES ORDER
	const { data: dataDaftarSalesOrder } = useQuery(GET_DAFTAR_SALES_ORDER)
	//GET CUSTOMER
	const { data: dataCustomer } = useQuery(GET_CUSTOMER)
	//GET DAFTAR INVOICE
	const { data: dataDaftarInvoice } = useQuery(GET_INVOICE)

	//GET ACCURATE
	const { data: dataAccurate } = useQuery(GET_ACCURATE)

	const setForm = useForm()
	const { control, register, watch, handleSubmit, setValue, getValues } =
		setForm

	useEffect(() => {
		formRef.current?.setFieldsValue({
			nomor_ttb: data?.nomor_ttb
		})
	}, [data])

	//CREATE DAFTAR INVOICE
	const [createDaftar_invoice] = useMutation(CREATE_DAFTAR_INVOICE, {
		refetchQueries: [{ query: GET_DATA }]
	})

	//create mutation function
	const createDataInvoice = (data) => {
		createDaftar_invoice({ variables: { input: data } })
	}

	const { fields, append, remove } = useFieldArray({
		control,
		name: `test`
	})

	const [selectednoSJatas, setselectednoSJatas] = useState()
	const [selectednoSJA] = useState([])
	const [selectedPengirm, setSelectedPengirim] = useState()

	//map get idPelanggan dataCustomer where nama_customer = selectedPengirim
	const idPelanggan = dataCustomer?.customer
		?.filter((item) => item.nama_customer === selectedPengirm)
		.map((item) => item.idPelanggan)

	console.log(`ipPelanggan`, idPelanggan)

	//merge selected
	const mergeSelected = () => {
		const merge = selectednoSJA.concat(selectednoSJatas)
		return merge
	}

	const nomor_sJ = mergeSelected()

	//get all ttb number from surat jalan where nomor surat jalan is selected
	const getTTB = () => {
		const ttb = data?.daftar_surat_jalan
			.filter((item) => nomor_sJ?.includes(item.nomor_surat_jalan))
			.map((item) => item.nomor_ttb)
		return ttb
	}

	const nomor_ttb = getTTB()

	//sum all harga_sebelum_ppn sales order where nomor_sales = nomor_ttb
	const sumHargaSebelumPpn = () => {
		const sum = dataDaftarSalesOrder?.daftar_sales_order
			.filter((item) => nomor_ttb?.includes(item.nomor_ttb))
			.reduce((a, b) => a + b.total_tagihan, 0)
		return sum
	}

	const sum_bersih = sumHargaSebelumPpn()

	console.log(`sum_bersih`, sum_bersih)

	const filteredSuratJalan = data?.daftar_surat_jalan.filter((item) => {
		if (watch(`nomor_surat_jalan`) && watch(`nomor_surat_jalanA`)) {
			return (
				!watch(`nomor_surat_jalan`)?.includes(item.nomor_surat_jalan) &&
				!watch(`nomor_surat_jalanA`)?.includes(item.nomor_surat_jalan)
			)
		} else if (watch(`nomor_surat_jalan`)) {
			return !watch(`nomor_surat_jalan`)?.includes(item.nomor_surat_jalan)
		} else if (watch(`nomor_surat_jalanA`)) {
			return !watch(`nomor_surat_jalanA`)?.includes(item.nomor_surat_jalan)
		} else {
			return item
		}
	})

	//handleChangeSJ
	const handleChangeSJ = (value) => {
		setselectednoSJatas(value)

		//get 1 nomor_ttb from surat jalan where nomor surat jalan = value
		const nomorTTB = data?.daftar_surat_jalan.filter((item) => {
			return item.nomor_surat_jalan === value
		})

		//allTTB = nomorTTB[0].nomor_ttb
		const allTTB = nomorTTB[0].nomor_ttb

		//get sales order where nomor ttb = allTTB
		const allSalesOrder = dataDaftarSalesOrder?.daftar_sales_order
			?.filter((item) => allTTB?.includes(item.nomor_ttb))
			.map((item) => item.nomor_sales_order)

		//get total tagihan from sales order where nomor sales order = allSalesOrder
		const totalTagihan = dataDaftarSalesOrder?.daftar_sales_order
			?.filter((item) => allSalesOrder?.includes(item.nomor_sales_order))
			.map((item) => item.harga_sebelum_ppn)

		//get pengirim, penerima, kota tujuan, total volume where ttb_number = allTTB
		const pengirim = dataDaftarTTB?.daftar_ttb
			?.filter((item) => allTTB?.includes(item.ttb_number))
			.map((item) => item.pengirim)

		const penerima = dataDaftarTTB?.daftar_ttb
			?.filter((item) => allTTB?.includes(item.ttb_number))
			.map((item) => item.nama_penerima)

		const kotaTujuan = dataDaftarTTB?.daftar_ttb
			?.filter((item) => allTTB?.includes(item.ttb_number))
			.map((item) => item.kota_tujuan)

		const totalVolume = dataDaftarTTB?.daftar_ttb
			?.filter((item) => allTTB?.includes(item.ttb_number))
			.map((item) => item.total_volume)

		setSelectedPengirim(pengirim[0])
		setValue(`pengirim`, pengirim[0])
		setValue(`penerima`, penerima[0])
		setValue(`kota_tujuan`, kotaTujuan[0])
		setValue(`total_volume_ttb`, totalVolume[0])
		setValue(`tagihan`, totalTagihan[0])
	}

	//handleChangeSJA
	const handleChangeSJA = (value, index) => {
		selectednoSJA[index] = value
		//get nomor ttb from surat jalan where nomor surat jalan = value
		const nomorTTB = data?.daftar_surat_jalan.filter((item) => {
			return item.nomor_surat_jalan === value
		})

		//allTTB = nomorTTB[0].nomor_ttb
		const allTTB = nomorTTB[0].nomor_ttb

		//get sales order where nomor ttb = allTTB
		const allSalesOrder = dataDaftarSalesOrder?.daftar_sales_order
			?.filter((item) => allTTB?.includes(item.nomor_ttb))
			.map((item) => item.nomor_sales_order)

		//get total tagihan from sales order where nomor sales order = allSalesOrder
		const totalTagihan = dataDaftarSalesOrder?.daftar_sales_order
			?.filter((item) => allSalesOrder?.includes(item.nomor_sales_order))
			.map((item) => item.harga_sebelum_ppn)

		//get pengirim, penerima, kota tujuan, total volume where ttb_number = allTTB
		const pengirim = dataDaftarTTB?.daftar_ttb
			?.filter((item) => allTTB?.includes(item.ttb_number))
			.map((item) => item.pengirim)

		const penerima = dataDaftarTTB?.daftar_ttb
			?.filter((item) => allTTB?.includes(item.ttb_number))
			.map((item) => item.nama_penerima)

		const kotaTujuan = dataDaftarTTB?.daftar_ttb
			?.filter((item) => allTTB?.includes(item.ttb_number))
			.map((item) => item.kota_tujuan)

		const totalVolume = dataDaftarTTB?.daftar_ttb
			?.filter((item) => allTTB?.includes(item.ttb_number))
			.map((item) => item.total_volume)

		setValue(`pengirimA[${index}]`, pengirim[0])
		setValue(`penerimaA[${index}]`, penerima[0])
		setValue(`kota_tujuanA[${index}]`, kotaTujuan[0])
		setValue(`total_volume_ttbA[${index}]`, totalVolume[0])
		setValue(`tagihanA[${index}]`, totalTagihan[0])
	}

	//get nomor_ttb from surat jalan where nomor surat jalan = selectednoSJatas
	const nomorTTB = data?.daftar_surat_jalan.filter((item) => {
		return item.nomor_surat_jalan === selectednoSJatas
	})

	//allTTB = nomorTTB[0].nomor_ttb
	const allTTB = nomorTTB?.[0]?.nomor_ttb

	//get term_payment from sales order where  =  allTTB
	const termPayment = dataDaftarSalesOrder?.daftar_sales_order
		?.filter((item) => allTTB?.includes(item.nomor_ttb))
		.map((item) => item.term_payment)

	//get pengirim
	const pengirim = dataDaftarTTB?.daftar_ttb
		?.filter((item) => allTTB?.includes(item.ttb_number))
		.map((item) => item.pengirim)

	//get ppn from customer where nama_customer = pengirim?.[0]
	const ppn = dataCustomer?.customer
		?.filter((item) => item.nama_customer === pengirim?.[0])
		.map((item) => item.tipe_ppn)

	const allHarga = watch(`tagihan`) ? watch(`tagihan`) : 0
	const allHargaA = watch(`tagihanA`) ? watch(`tagihanA`) : [0]

	//merge
	const allHargaMerge = [...allHargaA, allHarga]

	const subTotal1 = allHargaMerge?.reduce((a, b) => {
		return parseInt(a) + parseInt(b)
	}, 0)

	//harga from newArray if 0 set array 0
	const newArray1 = watch(`newArray`)

	const harga_awal = newArray1?.map((item) => {
		if (item.Harga === 0) {
			return 0
		} else {
			if (String(item.PPN) === `true`) {
				return parseInt(item.Harga)
			} else {
				return item.Harga
			}
		}
	})

	const subTotal_awal = harga_awal?.reduce((a, b) => {
		return parseInt(a) + parseInt(b)
	}, 0)

	//if subtotal 2 nan set 0
	const subTotal4 = isNaN(subTotal_awal) ? 0 : subTotal_awal

	//get harga from newArray1 Harga and if ppn true then  Harga *( ppn /100)
	const harga = newArray1?.map((item) => {
		if (item.Harga === 0) {
			return 0
		} else {
			if (String(item.PPN) === `true`) {
				return (
					parseInt(item.Harga) - parseInt(item.Harga) * (parseInt(ppn) / 100)
				)
			} else {
				return item.Harga
			}
		}
	})

	const subTotal2 = harga?.reduce((a, b) => {
		return parseInt(a) + parseInt(b)
	}, 0)

	//if subtotal 2 nan set 0
	const subTotal3 = isNaN(subTotal2) ? 0 : subTotal2

	const subTotal = subTotal1 + subTotal4

	const subAfterPPN = sum_bersih + subTotal3
	console.log(`subAfterPPN`, subAfterPPN)

	const subPPN = subAfterPPN - subTotal

	function addLeadingZeros(num, totalLength) {
		return String(num).padStart(totalLength, `0`)
	}

	//count dataDaftarInvoice length
	const count = dataDaftarInvoice?.daftar_invoice.length + 1

	const onSubmit = (formData) => {
		console.log(`formData`, formData)

		//merge formData.nomor_surat_jalanA?.filter((item) => item !== ``) and formData.nomor_surat_jalan with map
		const nomor_surat_jalan = [
			...(formData.nomor_surat_jalanA ? formData.nomor_surat_jalanA : []),
			formData.nomor_surat_jalan
		].map((item) => item)

		//get nama barang from newArray formData
		const namaBarang = formData.newArray.map((item) => item.nama_barang)

		//get ppn from newArray formData
		const ppn = formData.newArray.map((item) => item.PPN)

		//join nama barang into 1 string with ,
		const namaBarangString = namaBarang.join(`,`)

		//join harga into 1 string with ,
		const hargaString = harga.join(`,`)

		//join ppn into 1 string with ,
		const ppnString = ppn.join(`,`)

		const dataInvoice = nomor_surat_jalan?.map((item, index) => {
			return {
				nomor_surat_jalan: item,
				nomor_invoice:
					`INV/` +
					formData.kota_tujuan +
					`/` +
					String(moment(formData.tanggal_invoice).format(`YY-MM`)) +
					`/` +
					addLeadingZeros(count, 4),
				//find first nomor ttb from nomor surat jalan where nomor surat jalan = item
				nomor_ttb: data?.daftar_surat_jalan
					?.filter((item2) => item2.nomor_surat_jalan === item)
					.map((item2) => item2.nomor_ttb)[0],
				//find first vendor pelayanan from nomor surat jalan where nomor surat jalan = item
				vendor_pelayanan: data?.daftar_surat_jalan
					?.filter((item2) => item2.nomor_surat_jalan === item)
					.map((item2) => item2.vendor_pelayanan)[0],
				tanggal_invoice: moment(formData.tanggal_invoice).format(`YYYY-MM-DD`),
				//find koli and sum koli where ttb_number = nomor_ttb
				koli: dataDaftarTTB?.daftar_ttb
					?.filter((item2) => item2.ttb_number === item.nomor_ttb)
					.map((item2) => item2.koli)
					.reduce((a, b) => {
						return parseInt(a) + parseInt(b)
					}, 0),
				//get total volume where nomor ttb = nomor ttb
				volume: dataDaftarTTB?.daftar_ttb
					?.filter((item2) => item2.ttb_number === formData.nomor_ttb)
					.map((item2) => item2.total_volume)
					.reduce((a, b) => {
						return parseInt(a) + parseInt(b)
					}, 0),
				//get total koli from ttb and sum where nomor ttb = nomor ttb
				total_koli: dataDaftarTTB?.daftar_ttb
					?.filter((item2) => item2.ttb_number === formData.nomor_ttb)
					.map((item) => item.koli)
					.reduce((a, b) => {
						return parseInt(a) + parseInt(b)
					}, 0),
				total_volume: dataDaftarTTB?.daftar_ttb
					?.filter((item2) => item2.ttb_number === formData.nomor_ttb)
					.map((item2) => item2.total_volume)
					.reduce((a, b) => {
						return parseInt(a) + parseInt(b)
					}, 0),
				//get tanggal keberangkatan from ttb where nomor ttb = nomor ttb moment yyyy-mm-dd
				tanggal_keberangkatan: moment(
					dataDaftarTTB?.daftar_ttb
						?.filter((item2) => item2.ttb_number === formData.nomor_ttb)
						.map((item2) => item2.tanggal_keberangkatan)[0]
				).format(`YYYY-MM-DD`),
				//get first nama kapal from surat jalan where nomor surat jalan = item
				nama_kapal: data?.daftar_surat_jalan
					?.filter((item2) => item2.nomor_surat_jalan === item)
					.map((item2) => item2.nama_kapal)[0],
				//get first nomor container from surat jalan where nomor surat jalan = item
				nomor_container: data?.daftar_surat_jalan
					?.filter((item2) => item2.nomor_surat_jalan === item)
					.map((item2) => item2.nomor_container)[0],

				//get first nomor seal from surat jalan where nomor surat jalan = item
				nomor_seal: data?.daftar_surat_jalan
					?.filter((item2) => item2.nomor_surat_jalan === item)
					.map((item2) => item2.nomor_seal)[0],
				nama_barang: namaBarangString,
				harga: hargaString,
				ppn_biaya_tambahan: String(ppnString),
				harga_biaya_tambahan: String(subTotal2),
				keterangan: formData.keterangan,
				accurate: formData.accurate,
				pengirim: String(idPelanggan),
				total_tagihan: String(subAfterPPN)
			}
		})

		dataInvoice.map((item) => {
			item.volume = String(
				dataDaftarTTB?.daftar_ttb
					?.filter((item2) => item2.ttb_number === item.nomor_ttb)
					.map((item2) => item2.total_volume)[0]
			)
		})

		dataInvoice.map((item) => {
			item.total_volume = String(item.volume)
		})

		dataInvoice.map((item) => {
			item.koli = String(
				dataDaftarTTB?.daftar_ttb
					?.filter((item2) => item2.ttb_number === item.nomor_ttb)
					.map((item2) => item2.koli)[0]
			)
		})

		dataInvoice.map((item) => {
			//sum koli from ttb where nomor ttb = nomor ttb
			item.total_koli = String(
				dataDaftarTTB?.daftar_ttb
					?.filter((item2) => item2.ttb_number === item.nomor_ttb)
					.map((item) => item.koli)
					.reduce((a, b) => {
						return parseInt(a) + parseInt(b)
					}, 0)
			)
		})

		dataInvoice.map((item) => {
			item.accurate = formData.accurate
		})

		console.log(`dataInvoice`, dataInvoice)

		for (let i = 0; i < dataInvoice.length; i++) {
			createDataInvoice(dataInvoice[i])
		}

		const check = dataDaftarInvoice?.daftar_invoice.find(
			(item) => item.nomor_ttb === dataInvoice.map((item) => item.nomor_ttb)
		)
		if (check === undefined) {
			notification.success({
				message: `Data berhasil dibuat`
			})
		}
	}
	return (
		<AdminPage
			parent={
				<Link href="/keuangan/daftar-invoice">
					<a>Daftar Invoice</a>
				</Link>
			}
			authId=""
			title="Tambah Invoice"
			legend=""
			setForm={setForm}
		>
			<section className="section">
				<div className="container">
					<form className="form" onSubmit={handleSubmit(onSubmit)}>
						<br></br>
						<label style={{ fontSize: `20px`, fontWeight: `bolder` }}>
							Daftar Surat Jalan
						</label>
						<div style={{ width: `100%` }}>
							<div
								style={{ display: `inline-block`, width: `27%` }}
								className="col"
							>
								<label style={{ fontSize: `10px`, fontWeight: `bolder` }}>
									Nomor Surat Jalan
								</label>
								<select
									{...register(`nomor_surat_jalan`)}
									onChange={(e) => handleChangeSJ(e.target.value)}
									style={{ width: `100%` }}
									required
								>
									<option>
										{selectednoSJatas === undefined
											? `Pilih Nomor Surat Jalan`
											: selectednoSJatas}
									</option>
									{filteredSuratJalan
										?.map((ttb) => {
											return (
												<option
													key={ttb.nomor_surat_jalan}
													value={ttb.nomor_surat_jalan}
												>
													{ttb.nomor_surat_jalan}
												</option>
											)
										})
										?.reverse()}
								</select>
							</div>
							<div
								style={{
									display: `inline-block`,
									width: `30%`,
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
									width: `14%`
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
									width: `10%`
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
									width: `10%`
								}}
								className="field"
							>
								<label style={{ fontSize: `10px`, fontWeight: `bolder` }}>
									Harga
								</label>
								<div className="control">
									<input
										style={{ width: `100%` }}
										className="input"
										type="text"
										placeholder="harga"
										{...register(`tagihan`)}
										readOnly
									/>
								</div>
							</div>
							<div
								className="col"
								style={{
									display: `inline-block`,
									paddingLeft: `1%`
								}}
							>
								<i
									onClick={(e) => {
										e.preventDefault()
										append({})
									}}
									className="icon"
									role="img"
								>
									<IconPlus className="svg" />
								</i>
							</div>
						</div>
						{fields.map((item, index) => {
							return (
								<div
									className="row"
									key={item.id}
									style={{ display: `flex`, paddingTop: `1%`, width: `100%` }}
								>
									<div>
										<div
											style={{ display: `inline-block`, width: `28%` }}
											className="col"
										>
											<label style={{ fontSize: `10px`, fontWeight: `bolder` }}>
												Nomor Surat Jalan
											</label>
											<select
												{...register(`nomor_surat_jalanA.${index}`)}
												onChange={(e) => {
													handleChangeSJA(e.target.value, index)
													selectednoSJA[index] = e.target.value
												}}
												style={{ width: `100%` }}
												required
											>
												<option value={selectednoSJA[index]}>
													{selectednoSJA[index] === undefined
														? `Pilih Nomor Surat Jalan`
														: selectednoSJA[index]}
												</option>
												{filteredSuratJalan
													?.map((ttb) => {
														return (
															<option
																key={ttb.nomor_surat_jalan}
																value={ttb.nomor_surat_jalan}
															>
																{ttb.nomor_surat_jalan}
															</option>
														)
													})
													?.reverse()}
											</select>
										</div>
										<div
											style={{
												display: `inline-block`,
												width: `31%`,
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
												{...register(`pengirimA.${index}`)}
												readOnly
											/>
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
												Kota Tujuan
											</label>
											<div className="control">
												<input
													style={{ width: `100%` }}
													className="input"
													type="text"
													placeholder="Kota Tujuan"
													{...register(`kota_tujuanA.${index}`)}
													readOnly
												/>
											</div>
										</div>
										<div
											style={{
												display: `inline-block`,
												marginLeft: `1%`,
												width: `10%`
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
													placeholder="Total Volume"
													{...register(`total_volume_ttbA.${index}`)}
													readOnly
												/>
											</div>
										</div>
										<div
											style={{
												display: `inline-block`,
												marginLeft: `1%`,
												width: `10%`
											}}
											className="field"
										>
											<label style={{ fontSize: `10px`, fontWeight: `bolder` }}>
												Harga
											</label>
											<div className="control">
												<input
													style={{ width: `100%` }}
													className="input"
													type="text"
													placeholder="Harga"
													{...register(`tagihanA.${index}`)}
													readOnly
												/>
											</div>
										</div>
									</div>
									<div
										style={{
											display: `inline-block`,
											marginTop: `30px`,
											marginLeft: `1%`
										}}
									>
										<i
											className="icon"
											style={{ marginLeft: `-130%` }}
											onClick={(e) => {
												e.preventDefault()
												remove(index)
											}}
											role="img"
										>
											<IconTrash className="svg" />
										</i>
									</div>
								</div>
							)
						})}
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
								inputNames={[`nama_barang`, `Harga`, `PPN`]}
								inputLabels={[`Nama Barang`, `Harga`, `PPN`]}
								inputTypes={[`text`, `text`, `checkbox`]}
							/>
						</div>
						<div style={{ width: `100%` }}>
							<div
								style={{
									alignItems: `right`,
									display: `flex`,
									justifyContent: `flex-end`
								}}
							>
								<text style={{ fontSize: `12px`, fontWeight: `bold` }}>
									Sub Total {` : `} Rp.{subTotal.toLocaleString(`id-ID`)}
								</text>
							</div>
							<div
								style={{
									alignItems: `right`,
									display: `flex`,
									justifyContent: `flex-end`
								}}
							>
								<text style={{ fontSize: `12px`, fontWeight: `bold` }}>
									PPN {` : `} Rp.{subPPN.toLocaleString(`id-ID`)}
								</text>
							</div>
							<div
								style={{
									alignItems: `right`,
									display: `flex`,
									justifyContent: `flex-end`
								}}
							>
								<text style={{ fontSize: `12px`, fontWeight: `bold` }}>
									Total {` : `} Rp.{subAfterPPN.toLocaleString(`id-ID`)}
								</text>
							</div>
						</div>
						<div
							className="field"
							style={{
								display: `inline-block`,
								width: `calc(50% - 8px)`,
								marginTop: `5%`
							}}
						>
							<label style={{ fontWeight: `bolder` }} className="label">
								Tanggal invoice
							</label>
							<div className="control">
								<Controller
									control={control}
									name="tanggal_invoice"
									rules={{ required: true }}
									render={({ field }) => (
										<DatePicker
											{...field}
											style={{
												width: `100%`,
												height: `38px`
											}}
											format={`DD/MM/YYYY`}
											placeholder="Tanggal Invoice"
											onChange={(date) => field.onChange(date)}
											className="form-control"
										/>
									)}
								/>
							</div>
						</div>
						<div
							className="field"
							style={{ display: `inline-block`, width: `calc(50% - 8px)` }}
						>
							<label
								style={{ fontWeight: `bolder`, marginLeft: `10px` }}
								className="label"
							>
								Term of Payment
							</label>
							<div className="control">
								<input
									style={{
										display: `inline-block`,
										width: `calc(120% - 8px)`,
										margin: `0 8px`
									}}
									className="input"
									type="text"
									placeholder="Term of Payment"
									value={termPayment?.[0]}
									{...register(`term_of_payment`)}
									required
									readOnly
								/>
							</div>
						</div>
						<div className="field" style={{ marginTop: `1%` }}>
							<label style={{ fontWeight: `bolder` }} className="label">
								Accurate
							</label>
							<select
								{...register(`accurate`)}
								style={{ width: `100%` }}
								required
							>
								<option value="0">Pilih Integrasi Accurate</option>
								{dataAccurate?.accurate?.map((item, index) => (
									<option key={index} value={item.kode_barang}>
										{item.nama_barang}
									</option>
								))}
							</select>
						</div>
						<div className="field" style={{ marginTop: `1%` }}>
							<label style={{ fontWeight: `bolder` }} className="label">
								Keterangan
							</label>
							<div className="control">
								<textarea
									style={{ width: `100%` }}
									className="textarea"
									placeholder="Keterangan"
									{...register(`keterangan`)}
									required
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
