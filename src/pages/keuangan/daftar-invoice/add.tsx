/* eslint-disable array-callback-return */
import { useMutation, useQuery } from "@apollo/client"
import IconPlus from "@assets/icons/icon-plus-fill.svg"
import IconTrash from "@assets/icons/icon-trash.svg"
import AdminPage from "@components/admin/AdminPage.component"
import Dashboard from "@components/dashboard/Dashboard.component"
import FormRepeater from "@components/form/FormRepeater.component"
import { Button, DatePicker, notification } from "antd"
import { GET_ACCURATE } from "graphql/accurate/queries"
import { GET_CUSTOMER } from "graphql/customer/queries"
import { CREATE_DAFTAR_INVOICE } from "graphql/daftar_invoice/mutations"
import { GET_DAFTAR_SALES_ORDER } from "graphql/daftar_sales_order/queries"
import { GET_DAFTAR_TTB } from "graphql/daftar_ttb/queries"
import { GET_DAFTAR_TUJUAN } from "graphql/daftar_tujuan/queries"
import { UPDATE_REFERENCE_INVOICE } from "graphql/reference_invoice/mutations"
import { GET_REFERENCE_INVOICE } from "graphql/reference_invoice/queries"
import moment from "moment"
import Link from "next/link"
import router from "next/router"
import { useEffect, useRef, useState } from "react"
import { Controller, useFieldArray, useForm } from "react-hook-form"
import { GET_DAFTAR_INVOICE } from "../../../../graphql/daftar_invoice/queries"
import { GET_DAFTAR_SURAT_JALAN } from "../../../../graphql/daftar_surat_jalan/queries"

export default function Home() {
	//use loading
	const [loading, setLoading] = useState(false)
	//set load
	const formRef = useRef(null)
	const { data } = useQuery(GET_DAFTAR_SURAT_JALAN)
	//GET DAFTAR TTB
	const { data: dataDaftarTTB } = useQuery(GET_DAFTAR_TTB)
	//GET DAFTAR SALES ORDER
	const { data: dataDaftarSalesOrder } = useQuery(GET_DAFTAR_SALES_ORDER)
	//GET CUSTOMER
	const { data: dataCustomer } = useQuery(GET_CUSTOMER)
	//GET DAFTAR INVOICE
	const { data: dataDaftarInvoice } = useQuery(GET_DAFTAR_INVOICE)
	//GET DAFTAR TUJUAN
	const { data: dataDaftarTujuan } = useQuery(GET_DAFTAR_TUJUAN)
	//GET REFERENCE INVOICE
	const { data: dataReferenceInvoice } = useQuery(GET_REFERENCE_INVOICE)

	//GET ACCURATE
	const { data: dataAccurate } = useQuery(GET_ACCURATE)

	const setForm = useForm()
	const { control, register, watch, handleSubmit, setValue, reset } = setForm

	useEffect(() => {
		formRef.current?.setFieldsValue({
			nomor_ttb: data?.nomor_ttb
		})
	}, [data])

	//CREATE DAFTAR INVOICE and routh to daftar invoice
	const [createDaftar_invoice] = useMutation(CREATE_DAFTAR_INVOICE, {
		refetchQueries: [{ query: GET_DAFTAR_INVOICE }]
	})

	//create mutation function
	const createDataInvoice = (data) => {
		createDaftar_invoice({ variables: { input: data } })
	}

	//UPDATE REFERENCE INVOICE
	const [updateReference_invoice] = useMutation(UPDATE_REFERENCE_INVOICE, {
		refetchQueries: [{ query: GET_REFERENCE_INVOICE }]
	})

	//create mutation function
	const updateDataReferenceInvoice = (data) => {
		updateReference_invoice({ variables: { input: data } })
	}

	const { fields, append, remove } = useFieldArray({
		control,
		name: `test`
	})

	const [selectednoSJatas, setselectednoSJatas] = useState()
	const [selectednoSJA] = useState([])
	const [selectedPengirm, setSelectedPengirim] = useState()
	const [selectedAccurate, setAccurate] = useState()
	const [selectedBiayaTambahan, setBiayaTambahan] = useState()
	const [selectedBiayaTambahan2, setBiayaTambahan2] = useState()

	//map get idPelanggan dataCustomer where nama_customer = selectedPengirim
	const idPelanggan = dataCustomer?.customer
		?.filter((item) => item.nama_customer === selectedPengirm)
		.map((item) => item.idPelanggan)

	//merge selected
	const mergeSelected = () => {
		const merge = selectednoSJA.concat(selectednoSJatas)
		return merge
	}

	const nomor_sJ = mergeSelected()

	const getDataSj = () => {
		//refresh page without reload
		router.replace(router.asPath)
	}

	//get all ttb number from surat jalan where nomor surat jalan is selected
	const getTTB = () => {
		const ttb = data?.daftar_surat_jalan
			.filter((item) => nomor_sJ?.includes(item.nomor_surat_jalan))
			.map((item) => item.nomor_ttb)
		return ttb
	}

	const nomor_ttb = getTTB()

	//get nama barang and split by , from sales order where nomor ttb is selected
	const namaBarang = dataDaftarSalesOrder?.daftar_sales_order
		.filter((item) => nomor_ttb?.includes(item.nomor_ttb))
		.map((item) => item?.nama_barang)

	//map using foreach and split by ,
	const namaBarangSplit = []
	namaBarang?.forEach((item) => {
		namaBarangSplit.push(item.split(`,`))
	})

	//join nama barang split
	const namaBarangJoin = namaBarangSplit?.map((item) => item.join(`,`))

	const tipe_ppn = dataDaftarSalesOrder?.daftar_sales_order
		.filter((item) => nomor_ttb?.includes(item.nomor_ttb))
		.map((item) => item.tipe_ppn)

	//map using foreach and split by ,
	const tipe_ppnSplit = []
	tipe_ppn?.forEach((item) => {
		tipe_ppnSplit.push(item.split(`,`))
	})

	//get all harga_sebelum_ppn from sales order where nomor ttb is selected
	const hargaSatuan = dataDaftarSalesOrder?.daftar_sales_order
		.filter((item) => nomor_ttb?.includes(item.nomor_ttb))
		.map((item) => item.harga_satuan)

	//map using foreach and split by ,
	const hargaSatuanSplit = []
	hargaSatuan?.forEach((item) => {
		hargaSatuanSplit.push(item.split(`,`))
	})

	//for hargaSatuanSplit if Nan replace with 0
	const hargaSatuanSplitReplace = hargaSatuanSplit?.map((item) =>
		item.map((item) => (item === `` ? 0 : item))
	)

	//join
	const hargaSatuanJoin = hargaSatuanSplit?.map((item) => item.join(`,`))

	//for hargaSatuanSplit length merge with namaBarangSplit and tipe_ppnSplit
	const mergeNamaBarang = []
	for (let i = 0; i < hargaSatuanSplit.length; i++) {
		mergeNamaBarang.push(
			...namaBarangSplit[i].map((item, index) => ({
				namaBarang: item,
				tipe_ppn: tipe_ppnSplit[i][index],
				hargaSatuan: hargaSatuanSplit[i][index]
			}))
		)
	}
	//join tipe_ppn  from mergeNamaBarang
	const tipe_ppnJoin = mergeNamaBarang?.map((item) => item.tipe_ppn)

	//join with ,
	const tipe_ppnJoinComma = tipe_ppnJoin?.join(`,`)

	//sum hargaSatuanSplit
	const sumHargaSatuan = hargaSatuanSplitReplace?.map((item) =>
		item.reduce((a, b) => parseInt(a) + parseInt(b), 0)
	)

	//sum sumHargaSatuan
	const sumHargaSatuanSum = sumHargaSatuan?.reduce(
		(a, b) => parseInt(a) + parseInt(b),
		0
	)

	//for tipe_Ppns length find taxName in accurate where tipe_ppns === kode_barang
	const taxNames = []
	for (let i = 0; i < tipe_ppnSplit.length; i++) {
		taxNames.push(
			...tipe_ppnSplit[i].map((item) =>
				dataAccurate?.accurate.find((tax) => tax.kode_barang === item)
			)
		)
	}

	//label and value for taxNames map
	const mapOption = taxNames?.map((item) => {
		return {
			label: item?.nama_barang,
			value: item?.kode_barang
		}
	})

	var optionBiaya = []
	for (let i = 0; i < mapOption.length; i++) {
		optionBiaya.push({
			nama_barang: mergeNamaBarang[i].namaBarang,
			Harga: mergeNamaBarang[i].hargaSatuan,
			tipe_ppn: taxNames[i]?.nama_barang
		})
	}

	//sum all harga_sebelum_ppn sales order where nomor_sales = nomor_ttb
	const sumHargaSebelumPpn = () => {
		const sum = dataDaftarSalesOrder?.daftar_sales_order
			.filter((item) => nomor_ttb?.includes(item.nomor_ttb))
			.reduce((a, b) => a + b.harga_sesudah_ppn, 0)
		return sum
	}

	//sum all harga_total sales order where nomor_sales = nomor_ttb
	const sumHargaTotal = () => {
		const sum = dataDaftarSalesOrder?.daftar_sales_order
			.filter((item) => nomor_ttb?.includes(item.nomor_ttb))
			//if harga total is
			.reduce((a, b) => a + b.harga_total, 0)
		return sum
	}

	const sum_total_ppn = sumHargaTotal()

	const sum_bersih = sumHargaSebelumPpn()

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

	//filter filtered surat jalan where nomor surat jalan isnot in datadaftarinvoice
	const filteredSuratJalan2 = filteredSuratJalan?.filter((item) => {
		if (dataDaftarInvoice?.daftar_invoice) {
			return !dataDaftarInvoice?.daftar_invoice
				.map((item) => item.nomor_surat_jalan)
				.includes(item.nomor_surat_jalan)
		} else {
			return item
		}
	})

	//merge duplicate
	const filteredSuratJalanSelect = filteredSuratJalan2?.reduce(
		(acc, current) => {
			const x = acc.find(
				(item) => item.nomor_surat_jalan === current.nomor_surat_jalan
			)
			if (!x) {
				return acc.concat([current])
			} else {
				return acc
			}
		},
		[]
	)
	//watch kota_tujuan
	const kota_tujuan = watch(`kota_tujuan`)

	//get nama_tujuan from daftar_tujuan where kota_tujuan = kode_tujuan
	const nama_tujuan = dataDaftarTujuan?.daftar_tujuan
		.filter((item) => {
			return item.kode_tujuan === kota_tujuan
		})
		.map((item) => item.nama_tujuan)

	//find data from filtered surat jalan where kota_tujuan = kota_tujuan
	const filteredSuratJalan3 = filteredSuratJalanSelect?.filter((item) => {
		if (kota_tujuan) {
			return item.kota_tujuan === kota_tujuan
		} else {
			return item
		}
	})

	//merge duplicate
	const filteredSuratJalanSelect2 = filteredSuratJalan3?.reduce(
		(acc, current) => {
			const x = acc.find(
				(item) => item.nomor_surat_jalan === current.nomor_surat_jalan
			)
			if (!x) {
				return acc.concat([current])
			} else {
				return acc
			}
		},
		[]
	)

	//handleChangeSJ
	const handleChangeSJ = (value) => {
		setselectednoSJatas(value)

		//get 1 nomor_ttb from surat jalan where nomor surat jalan = value
		const nomorTTB = data?.daftar_surat_jalan.filter((item) => {
			return item.nomor_surat_jalan === value
		})

		//temp nomor ttb
		const ttb_temp = data?.daftar_surat_jalan
			.filter((item) => {
				return item.nomor_surat_jalan === value
			})
			.map((item) => item.nomor_ttb)
		//allTTB = nomorTTB[0].nomor_ttb
		const allTTB = nomorTTB[0].nomor_ttb

		//get total tagihan from sales order where nomor ttb include ttb_temp
		const totalTagihan = dataDaftarSalesOrder?.daftar_sales_order
			?.filter((item) => ttb_temp?.includes(item.nomor_ttb))
			.reduce((a, b) => parseInt(a) + parseInt(b.total_harga_ttb), 0)

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

		//get accurate
		const accurate = dataDaftarTTB?.daftar_ttb
			?.filter((item) => allTTB?.includes(item.ttb_number))
			.map((item) => item.accurate)
		const biaya_tambahan_ppn = dataDaftarTTB?.daftar_ttb
			?.filter((item) => allTTB?.includes(item.ttb_number))
			.map((item) => item.biaya_tambahan)
		const biaya_tambahan_non_ppn = dataDaftarTTB?.daftar_ttb
			?.filter((item) => allTTB?.includes(item.ttb_number))
			.map((item) => item.biaya_tambahan_non_ppn)

		setSelectedPengirim(pengirim[0])
		setValue(`pengirim`, pengirim[0])
		setValue(`penerima`, penerima[0])
		setValue(`kota_tujuan`, kotaTujuan[0])
		setValue(`total_volume_ttb`, totalVolume[0])
		setValue(`tagihan`, totalTagihan)
		setValue(`accurate`, accurate[0])
		setAccurate(accurate[0])
		setBiayaTambahan(biaya_tambahan_ppn[0])
		setBiayaTambahan2(biaya_tambahan_non_ppn[0])
	}

	//handleChangeSJA
	const handleChangeSJA = (value, index) => {
		//getdata
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
			.reduce((a, b) => parseInt(a) + parseInt(b.total_harga_ttb), 0)

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
		setValue(`tagihanA[${index}]`, totalTagihan)

		mergeSelected()
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
		return item.Harga
	})

	const subTotal_awal = harga_awal?.reduce((a, b) => {
		return parseInt(a) + parseInt(b)
	}, 0)

	//if subtotal 2 nan set 0
	const subTotal4 = isNaN(subTotal_awal) ? 0 : subTotal_awal

	const tipePPN = selectedAccurate

	const tipePPNNumber = String(tipePPN)?.replace(/[^0-9]/g, ``)

	//if tipe_ppn is 1% then return 1.01 if 10% then return 1.1
	const tipePPNPercentage = Number(tipePPNNumber) / 100

	const harga = newArray1?.map((item) => {
		if (item.Harga === 0) {
			return 0
		} else {
			if (String(item.tipe_ppn) === `true` || item.tipe_ppn === true) {
				//return harga + (harga * tipePPNPercentage)
				return (
					parseInt(item.Harga) +
					parseInt(item.Harga) * Number(tipePPNPercentage)
				)
			} else {
				return Number(item.Harga)
			}
		}
	})

	const subTotal2 = harga?.reduce((a, b) => {
		return parseInt(a) + parseInt(b)
	}, 0)

	//if subtotal 2 = "nan" or undefined set 0
	const subTotal3 = isNaN(subTotal2) ? harga_awal : subTotal2

	//if Number(sumHargaSatuan) = "nan" or undefined set 0
	const sales_order_tambahan = isNaN(Number(sumHargaSatuanSum))
		? 0
		: Number(sumHargaSatuanSum)

	const subTotal = subTotal1 + subTotal4 + sales_order_tambahan

	const subAfterPPN = sum_bersih + parseInt(subTotal3) + sum_total_ppn

	const subPPN = subAfterPPN - subTotal

	function addLeadingZeros(num, totalLength) {
		return String(num).padStart(totalLength, `0`)
	}

	//count dataDaftarInvoice length
	const count = dataDaftarInvoice?.daftar_invoice.length + 1

	const onSubmit = async (formData) => {
		//merge formData.nomor_surat_jalanA?.filter((item) => item !== ``) and formData.nomor_surat_jalan with map
		const nomor_surat_jalan = [
			...(formData.nomor_surat_jalanA ? formData.nomor_surat_jalanA : []),
			formData.nomor_surat_jalan
		].map((item) => item)

		console.log(`nomor_surat_jalan`, nomor_surat_jalan)

		//get nama barang from newArray formData
		const namaBarang = formData.newArray.map((item) => item.nama_barang)

		//get ppn from newArray formData
		const ppn = formData.newArray.map((item) => item.tipe_ppn)

		//join nama barang into 1 string with ,
		const namaBarangString = namaBarang.join(`,`)

		//join namaBarang with namaBarang join with
		const namaBarangJoins = namaBarangString + `,` + namaBarangJoin

		//join harga into 1 string with ,
		const hargaString = harga_awal.join(`,`)

		//join harga with harga join
		const hargaJoins = hargaString + `,` + hargaSatuanJoin

		//join ppn into 1 string with ,
		const ppnString = ppn.join(`,`)

		//join ppn with ppn join
		const ppnJoins = ppnString + `,` + tipe_ppnJoinComma

		//join nomor ttb into 1 string with ,
		const nomorTtb = data?.daftar_surat_jalan
			?.filter((item) => nomor_surat_jalan.includes(item.nomor_surat_jalan))
			.map((item) => item.nomor_ttb)

		const nomorTtbString = nomorTtb.join(`,`)

		//join nomor surat jalan into 1 string with ,
		const nomorSuratJalanString = nomor_surat_jalan.join(`,`)

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
				jenis_biaya_tambahan: String(ppnString),
				id_biaya_utama: `undefined`,
				harga_surat_jalan: String(subTotal1),
				ppn_biaya_tambahan: String(ppnString),
				harga_biaya_tambahan: String(subTotal2),
				keterangan: formData.keterangan,
				//find kode_barang from dataAccurate where nama_barang = formData.accurate
				accurate: dataAccurate?.accurate
					?.filter((item2) => item2.nama_barang === formData.accurate)
					.map((item2) => item2.kode_barang)[0],
				pengirim: String(idPelanggan),
				total_tagihan: String(subAfterPPN),
				tax: String(subPPN),
				subtotal: String(subTotal1),
				subtotal_tambahan: String(subTotal4),
				biaya_tambahan_sales: String(hargaSatuanJoin),
				itemNo_sales_order: String(tipe_ppnJoinComma),
				biaya_tambahan_join: String(hargaJoins),
				itemNo_join: String(ppnJoins),
				nama_barang_join: String(namaBarangJoins),
				kota_tujuan: String(nama_tujuan),
				biaya_tambahan_ppn: selectedBiayaTambahan,
				biaya_tambahan_non_ppn: selectedBiayaTambahan2
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
			item.accurate = dataAccurate?.accurate
				?.filter((item2) => item2.nama_barang === formData.accurate)
				.map((item2) => item2.kode_barang)[0]
		})

		const dataReference = dataReferenceInvoice?.reference_invoice?.filter(
			(item: any) => item.kota_tujuan === String(nama_tujuan)
		)

		dataInvoice.map((item) => {
			//if String(moment.unix(values.tanggal_invoice / 1000).format(`YY-MM`)) !== dataReference[0].tanggal_tahun then addleadingg zeros(1,4) else addleadingzeros(dataReference + 1,4)
			if (
				String(moment.unix(formData.tanggal_invoice / 1000).format(`MM`)) !==
				dataReference[0].bulan_tahun
			) {
				item.nomor_invoice =
					`INV/` +
					formData.kota_tujuan +
					`/` +
					String(moment(formData.tanggal_invoice).format(`YY-MM`)) +
					`/` +
					addLeadingZeros(1, 4)
			} else {
				item.nomor_invoice =
					`INV/` +
					formData.kota_tujuan +
					`/` +
					String(moment(formData.tanggal_invoice).format(`YY-MM`)) +
					`/` +
					addLeadingZeros(dataReference[0].increment + 1, 4)
			}
		})

		dataInvoice.map((item) => {
			item.nomor_ttb = nomorTtbString
		})

		dataInvoice.map((item) => {
			item.nomor_surat_jalan = nomorSuratJalanString
		})

		console.log(`dataInvoice`, dataInvoice)

		const increment =
			String(moment.unix(formData.tanggal_invoice / 1000).format(`MM`)) !==
			dataReference[0]?.bulan_tahun
				? 1
				: dataReference[0]?.increment + 1

		const tanggal_tahun = String(
			moment.unix(formData.tanggal_invoice / 1000).format(`YY-MM`)
		)

		const dataReferencInvoiceupdate = {
			id: dataReference[0]?.id,
			increment: increment,
			tanggal_tahun: tanggal_tahun,
			bulan_tahun: String(
				moment.unix(formData.tanggal_invoice / 1000).format(`MM`)
			)
		}

		updateDataReferenceInvoice(dataReferencInvoiceupdate)

		//find if nomor surat jalan already exist in daftar invoice if not createdata
		const dataInvoiceExist = dataDaftarInvoice?.daftar_invoice?.filter(
			(item) => item.nomor_surat_jalan === formData.nomor_surat_jalan
		)

		if (dataInvoiceExist.length === 0) {
			setLoading(true)
			createDataInvoice(dataInvoice)
			notification.success({
				message: `Berhasil Menambahkan Invoice`,
				description: `Lakukan Refresh Jika Tidak Muncul`
			})
			//redirect to daftar invoice and reload page

			setLoading(false)
			router.push(`/keuangan/daftar-invoice`)
		} else {
			notification.error({
				message: `Gagal`,
				description: `Nomor surat jalan sudah ada Invoice`
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
								<label style={{ fontSize: `12px`, fontWeight: `bolder` }}>
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
									{filteredSuratJalanSelect
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
								<label style={{ fontSize: `12px`, fontWeight: `bolder` }}>
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
								<label style={{ fontSize: `12px`, fontWeight: `bolder` }}>
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
								<label style={{ fontSize: `12px`, fontWeight: `bolder` }}>
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
								<label style={{ fontSize: `12px`, fontWeight: `bolder` }}>
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
													getDataSj()
												}}
												style={{ width: `100%` }}
												required
											>
												<option value={selectednoSJA[index]}>
													{selectednoSJA[index] === undefined
														? `Pilih Nomor Surat Jalan`
														: selectednoSJA[index]}
												</option>
												{filteredSuratJalanSelect2
													?.map((ttb) => {
														return (
															<option
																key={ttb.nomor_surat_jalan}
																value={ttb.nomor_surat_jalan}
																onChange={(e) => {
																	mergeSelected()
																}}
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
												selectednoSJA.splice(index, 1)
												selectednoSJA.filter((item) => item !== ``)
												mergeSelected()
											}}
											role="img"
										>
											<IconTrash className="svg" />
										</i>
									</div>
								</div>
							)
						})}

						<div className="field" style={{ marginTop: `1%` }}>
							<label style={{ fontWeight: `bolder` }} className="label">
								Nama Barang (Accurate)
							</label>
							<input
								style={{ width: `100%`, height: `38px` }}
								{...register(`accurate`)}
								disabled
							/>
						</div>
						<div
							style={{ width: `50%`, marginTop: `20px` }}
							className="content"
						>
							<label
								style={{ fontWeight: `bold`, paddingLeft: `5px` }}
								className="label"
							>
								Biaya Tambahan Sales Order:
							</label>
						</div>
						{
							//usefieldArray mergeNamaBarang
							mergeNamaBarang.map((item, index) => {
								return (
									<div key={index}>
										<div
											style={{
												display: `inline-block`,
												width: `25%`
											}}
											className="field"
										>
											<label
												style={{
													marginLeft: `5px`,
													fontSize: `12px`,
													fontWeight: `bolder`
												}}
											>
												Nama Barang
											</label>
											<div className="control">
												<input
													style={{ width: `100%`, marginLeft: `5px` }}
													className="input"
													type="text"
													placeholder="Nama Barang"
													defaultValue={item.namaBarang}
													{...register(`namaBarang.${index}`)}
													readOnly
												/>
											</div>
										</div>
										<div
											style={{
												display: `inline-block`,
												marginLeft: `15px`,
												width: `20%`
											}}
											className="field"
										>
											<label
												style={{
													fontSize: `12px`,
													fontWeight: `bolder`
												}}
											>
												Harga
											</label>
											<div className="control">
												<input
													style={{ width: `100%` }}
													className="input"
													type="text"
													placeholder="Harga"
													defaultValue={item.hargaSatuan}
													{...register(`harga.${index}`)}
													readOnly
												/>
											</div>
										</div>
										<div
											style={{
												display: `inline-block`,
												marginLeft: `15px`,
												width: `25%`
											}}
											className="field"
										>
											<label style={{ fontSize: `12px`, fontWeight: `bolder` }}>
												PPN
											</label>
											<div className="control">
												<input
													//checkbox
													type={`checkbox`}
													style={{ width: `20px`, height: `20px` }}
													className="input"
													checked={item.tipe_ppn}
													{...register(`tipePpn.${index}`)}
													disabled
													readOnly
												/>
											</div>
										</div>
									</div>
								)
							})
						}
						<div
							style={{ width: `76%`, marginTop: `20px` }}
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
								inputTypes={[`text`, `text`, `checkbox`]}
								inputProps={[{}, {}, {}]}
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
						{/* <div
							className="field"
							style={{
								display: `inline-block`,
								width: `calc(50% - 8px)`,
								marginTop: `5%`
							}}
						>
							<label style={{ fontWeight: `bolder` }} className="label">
								Biaya Tambahan PPN
							</label>
							<div className="control">
								<input
									style={{
										display: `inline-block`,
										width: `100%`
									}}
									className="input"
									type="text"
									placeholder="Biaya TambahanPPN"
									{...register(`biaya_tambahan_ppn`, { required: true })}
									required
									readOnly
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
								Biaya Tambahan Non PPN
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
									placeholder="Biaya Tambahan Non PPN"
									{...register(`biaya_tambahan_non_ppn`, { required: true })}
									required
									readOnly
								/>
							</div>
						</div> */}
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
						{/* {
							//if harga is not empty show this if not hidden
							harga?.length > 0 && (
								<div className="field" style={{ marginTop: `1%` }}>
									<label style={{ fontWeight: `bolder` }} className="label">
										Jenis Biaya Tambahan
									</label>
									<select
										{...register(`jenis_biaya_tambahan`)}
										style={{ width: `100%` }}
										required
									>
										<option value="0">Pilih Biaya Tambahan</option>
										{
											//from nama_barang
											nama_barang?.map((item, index) => (
												<option key={index} value={item.kode_barang}>
													{` `}
													{item.nama_barang}
													{` `}
												</option>
											))
										}
									</select>
								</div>
							)
						} */}
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
