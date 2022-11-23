/* eslint-disable array-callback-return */
import { gql, useMutation, useQuery } from "@apollo/client"
import IconPrint from "@assets/icons/icon-print.svg"
import IconTrash from "@assets/icons/icon-trash.svg"
import AdminPage from "@components/admin/AdminPage.component"
import Dashboard from "@components/dashboard/Dashboard.component"
import FormRepeater from "@components/form/FormRepeater.component"
import Access from "@components/util/Access.component"
import useLoading from "@hooks/useLoading.hook"
import { Button, notification } from "antd"
import { GET_CUSTOMER } from "graphql/customer/queries"
import {
	CREATE_DAFTAR_INVOICE,
	DELETE_DAFTAR_INVOICE
} from "graphql/daftar_invoice/mutations"
import { GET_DAFTAR_INVOICE } from "graphql/daftar_invoice/queries"
import { GET_DAFTAR_SALES_ORDER } from "graphql/daftar_sales_order/queries"
import { GET_DAFTAR_TTB } from "graphql/daftar_ttb/queries"
import moment from "moment"
import Link from "next/link"
import router from "next/router"
import { useEffect, useRef, useState } from "react"
import { useFieldArray, useForm } from "react-hook-form"

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

export default function Home() {
	const formRef = useRef(null)

	//id from router
	const id = router.query.id

	const setForm = useForm()
	const { control, register, watch, handleSubmit, setValue, reset } = setForm

	const { setLoading } = useLoading()
	const { data } = useQuery(GET_DATA)
	//GET DAFTAR TTB
	const { data: dataDaftarTTB } = useQuery(GET_DAFTAR_TTB)
	//GET DAFTAR SALES ORDER
	const { data: dataDaftarSalesOrder } = useQuery(GET_DAFTAR_SALES_ORDER)
	//GET CUSTOMER
	const { data: dataCustomer } = useQuery(GET_CUSTOMER)
	//GET DAFTAR INVOICE

	const [selectednoSJatas, setselectednoSJatas] = useState()
	const [selectednoSJA, setselectednoSJA] = useState([])

	const { data: dataDaftarInvoice } = useQuery(GET_DAFTAR_INVOICE, {
		onCompleted({ daftar_invoice }) {
			const data = daftar_invoice
			const filteredData = daftar_invoice?.filter(
				(item) => item.id === parseInt(id as string)
			)
			//get nomor_invoice from dataDaftarInvoice where id = id
			const nomor_invoice = filteredData[0]?.nomor_invoice

			//get all invoice where invoice = nomor_invoice
			const dataInvoice = dataDaftarInvoice?.daftar_invoice.filter(
				(item) => item.nomor_invoice == nomor_invoice
			)

			//split nama_barang by comma
			const nama_barang = dataInvoice[0]?.nama_barang.split(`,`)

			//split harga by comma
			const harga = dataInvoice[0]?.harga.split(`,`)

			//split PPN by comma
			const PPN = dataInvoice[0]?.ppn_biaya_tambahan.split(`,`)

			const nama_barang_harga = nama_barang?.map((item, index) => {
				return {
					nama_barang: item,
					harga: harga[index],
					PPN: PPN[index]
				}
			})

			//reset data to newArray
			const newArray = nama_barang_harga?.map((item) => {
				return {
					nama_barang: item.nama_barang,
					Harga: item.harga
				}
			})

			//for data invoice length set nomor_surat_jalanA[index] with nomor_surat_jalan from dataInvoice
			const nomor_surat_jalan = []
			for (let i = 0; i < dataInvoice.length; i++) {
				nomor_surat_jalan.push(dataInvoice[i]?.nomor_surat_jalan)
			}
			reset({ newArray })

			//convert nomor_surat_jalan to array of object and assign `nomor_surat_jalanA.${index}`
			const test = nomor_surat_jalan?.map((item, index) => {
				return { [`nomor_surat_jalanA.${index}`]: item }
			})

			setselectednoSJA(nomor_surat_jalan)

			reset({ test })
		}
	})

	//get data from dataDaftarInvoice where id = id
	const filteredData = dataDaftarInvoice?.daftar_invoice?.filter(
		(item) => item.id === parseInt(id as string)
	)

	//get all data from datdaftarinvoice  where nomor_invoice = nomor_invoice
	const mapInvoice = dataDaftarInvoice?.daftar_invoice.filter(
		(item) => item.nomor_invoice == filteredData[0]?.nomor_invoice
	)

	//get id all invoice where invoice = nomor_invoice
	const idInvoice = mapInvoice?.map((item) => item.id)

	console.log(`id_inovice`, idInvoice)

	const [deleteDaftar_invoice] = useMutation(DELETE_DAFTAR_INVOICE, {
		refetchQueries: [{ query: GET_DATA }]
	})

	const deleteData = (id) => {
		deleteDaftar_invoice({ variables: { deleteDaftar_invoiceId: id } })
		router.push(`/keuangan/daftar-invoice/`)
	}

	//get dataDaftarInvoice where nomor_invoice = selectednoSJA
	const dataInvoice = dataDaftarInvoice?.daftar_invoice.filter((item) =>
		selectednoSJA?.includes(item.nomor_surat_jalan)
	)

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

	//merge selected
	const mergeSelected = () => {
		const merge = selectednoSJA.concat(selectednoSJatas)
		return merge
	}

	const nomor_sJ = mergeSelected()

	//get all ttb number from surat jalan where nomor surat jalan is selected
	const getTTB = () => {
		const ttb = data?.daftar_surat_jalan
			.filter((item) => nomor_sJ.includes(item.nomor_surat_jalan))
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

	const filteredSuratJalan = data?.daftar_surat_jalan.filter((item) => {
		if (watch(`nomor_surat_jalan`) && watch(`nomor_surat_jalanA`)) {
			return (
				!watch(`nomor_surat_jalan`).includes(item.nomor_surat_jalan) &&
				!watch(`nomor_surat_jalanA`).includes(item.nomor_surat_jalan)
			)
		} else if (watch(`nomor_surat_jalan`)) {
			return !watch(`nomor_surat_jalan`).includes(item.nomor_surat_jalan)
		} else if (watch(`nomor_surat_jalanA`)) {
			return !watch(`nomor_surat_jalanA`).includes(item.nomor_surat_jalan)
		} else {
			return item
		}
	})

	//handleChangeSJA
	const handleChangeSJA = (value, index) => {
		selectednoSJA[index] = value
		//get nomor ttb from surat jalan where nomor surat jalan = value
		const nomorTTB = data?.daftar_surat_jalan.filter((item) => {
			return item.nomor_surat_jalan === value
		})

		//allTTB = nomorTTB[0].nomor_ttb
		const allTTB = nomorTTB?.[0]?.nomor_ttb

		//get sales order where nomor ttb = allTTB
		const allSalesOrder = dataDaftarSalesOrder?.daftar_sales_order
			?.filter((item) => allTTB?.includes(item.nomor_ttb))
			.map((item) => item.nomor_sales_order)

		//get total tagihan from sales order where nomor sales order = allSalesOrder
		const totalTagihan = dataDaftarSalesOrder?.daftar_sales_order
			?.filter((item) => allSalesOrder.includes(item.nomor_sales_order))
			.map((item) => item.harga_sebelum_ppn)

		//get pengirim, penerima, kota tujuan, total volume where ttb_number = allTTB
		const pengirim = dataDaftarTTB?.daftar_ttb
			?.filter((item) => allTTB?.includes(item.ttb_number))
			.map((item) => item.pengirim)

		const penerima = dataDaftarTTB?.daftar_ttb
			?.filter((item) => allTTB?.includes(item.ttb_number))
			.map((item) => item.nama_penerima)

		const kotaTujuan = dataDaftarTTB?.daftar_ttb
			?.filter((item) => allTTB.includes(item.ttb_number))
			.map((item) => item.kota_tujuan)

		const totalVolume = dataDaftarTTB?.daftar_ttb
			?.filter((item) => allTTB.includes(item.ttb_number))
			.map((item) => item.total_volume)

		//if pengirim > 1, then pengirim = pengirim[0] else pengirim
		setValue(
			`pengirimA[${index}]`,
			pengirim?.length > 1 ? pengirim[0] : pengirim
		)
		setValue(
			`penerimaA[${index}]`,
			penerima?.length > 1 ? penerima[0] : penerima
		)
		setValue(
			`kota_tujuanA[${index}]`,
			kotaTujuan?.length > 1 ? kotaTujuan[0] : kotaTujuan
		)
		setValue(
			`total_volume_ttbA[${index}]`,
			totalVolume?.length > 1 ? totalVolume[0] : totalVolume
		)
		setValue(
			`tagihanA[${index}]`,
			totalTagihan?.length > 1 ? totalTagihan[0] : totalTagihan
		)
	}

	//for selected no sja length call handleChangeSJA
	useEffect(() => {
		for (let i = 0; i < selectednoSJA.length; i++) {
			handleChangeSJA(selectednoSJA[i], i)
		}
	}, [selectednoSJA])

	//get nomor_ttb from surat jalan where nomor surat jalan = selectednoSJA
	const nomorTTB = data?.daftar_surat_jalan.filter((item) => {
		return selectednoSJA.includes(item.nomor_surat_jalan)
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

	const subPPN = subAfterPPN - subTotal

	function addLeadingZeros(num, totalLength) {
		return String(num).padStart(totalLength, `0`)
	}

	//count dataDaftarInvoice length
	const count = dataDaftarInvoice?.daftar_invoice.length + 1

	const deleteAll = () => {
		idInvoice.map((item) => {
			deleteData(item)
		})
	}
	const onSubmit = (formData) => {
		//merge formData.nomor_surat_jalanA and formData.nomor_surat_jalan
		const nomorSuratJalan = [
			...formData.nomor_surat_jalanA,
			formData.nomor_surat_jalan
		]

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
		console.log(`tanggal`, formData.tanggal_invoice)
		const dataInvoice = nomorSuratJalan?.map((item, index) => {
			return {
				nomor_surat_jalan: item,
				nomor_invoice: filteredData?.[0]?.nomor_invoice,
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
					?.filter((item2) => item2.ttb_number === item?.nomor_ttb)
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
				total_tagihan: String(subAfterPPN),
				accurate: dataDaftarInvoice?.daftar_invoice?.[0]?.accurate,
				pengirim: dataDaftarInvoice?.daftar_invoice?.[0]?.pengirim
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

		//if dataInvoicenomorsurat jalan undefined delete all data with nomor surat jalan undefined
		const dataInvoice_final = dataInvoice.filter(
			(item) => item.nomor_surat_jalan !== undefined
		)
		console.log(`dataInvoice`, dataInvoice_final)

		for (let i = 0; i < dataInvoice_final.length; i++) {
			createDataInvoice(dataInvoice_final[i])
		}

		idInvoice.map((item) => {
			deleteData(item)
		})

		const check = dataDaftarInvoice?.daftar_invoice.find(
			(item) =>
				item.nomor_ttb === dataInvoice_final.map((item) => item.nomor_ttb)
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
			action={
				<Access
					auth="write:settings-users"
					yes={
						<ul className="actions">
							<li className="action">
								<button
									className="button button-small button-white button-icon"
									style={{
										backgroundColor: `white`
									}}
									//dispatch
									onClick={() => {
										window.open(
											`/keuangan/daftar-invoice/print/${id}`,
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
									form="formInvoice"
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
						onSubmit={handleSubmit(onSubmit)}
						id="formInvoice"
					>
						<br></br>
						<label style={{ fontSize: `20px`, fontWeight: `bolder` }}>
							Daftar Surat Jalan
						</label>
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
												setValue(`nomor_surat_jalanA.${index}`, ``)
												selectednoSJA.splice(index, 1)
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
								<input
									style={{ width: `100%` }}
									className="input"
									type="date"
									placeholder="Text input"
									name="tanggal_invoice"
									{...register(`tanggal_invoice`)}
									defaultValue={dataInvoice?.[0]?.tanggal_invoice}
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
								Keterangan
							</label>
							<div className="control">
								<textarea
									style={{ width: `100%` }}
									className="textarea"
									placeholder="Keterangan"
									{...register(`keterangan`)}
									defaultValue={dataInvoice?.[0]?.keterangan}
									required
								/>
							</div>
						</div>
						{/* <div className="form-group">
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
						</div> */}
					</form>
				</div>
			</section>
		</AdminPage>
	)
}
Home.getLayout = function getLayout(page) {
	return <Dashboard>{page}</Dashboard>
}
