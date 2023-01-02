/* eslint-disable array-callback-return */
import { gql, useMutation, useQuery } from "@apollo/client"
import IconPrint from "@assets/icons/icon-print.svg"
import IconTrash from "@assets/icons/icon-trash.svg"
import AdminPage from "@components/admin/AdminPage.component"
import Dashboard from "@components/dashboard/Dashboard.component"
import FormRepeater from "@components/form/FormRepeater.component"
import Access from "@components/util/Access.component"
import { DashboardContext } from "@contexts/DashboardContext.context"
import useLoading from "@hooks/useLoading.hook"
import { Button, Popconfirm, notification } from "antd"
import { GET_ACCURATE } from "graphql/accurate/queries"
import { GET_CUSTOMER } from "graphql/customer/queries"
import {
	CREATE_DAFTAR_BIAYA_TAMBAHAN,
	UPDATE_DAFTAR_BIAYA_TAMBAHAN
} from "graphql/daftar_biaya_tambahan/mutations"
import { GET_DAFTAR_BIAYA_TAMBAHAN } from "graphql/daftar_biaya_tambahan/queries"
import {
	CREATE_DAFTAR_INVOICE,
	DELETE_DAFTAR_INVOICE,
	UPDATE_DAFTAR_INVOICE
} from "graphql/daftar_invoice/mutations"
import { GET_DAFTAR_INVOICE } from "graphql/daftar_invoice/queries"
import { GET_DAFTAR_SALES_ORDER } from "graphql/daftar_sales_order/queries"
import { GET_DAFTAR_TTB } from "graphql/daftar_ttb/queries"
import { GET_DAFTAR_TUJUAN } from "graphql/daftar_tujuan/queries"
import moment from "moment"
import Link from "next/link"
import router from "next/router"
import { useContext, useEffect, useState } from "react"
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
			kota_tujuan
			tanggal_keberangkatan
			nomor_container
			nomor_seal
			keterangan
		}
	}
`

export default function Home() {
	const { state: dashboardState } = useContext(DashboardContext)

	const username = dashboardState.auth.username

	const role = dashboardState.auth.userRole?.name

	//id from router
	const id = router.query.id

	const setForm = useForm()
	const { control, register, watch, handleSubmit, setValue, reset, getValues } =
		setForm

	const { setLoading } = useLoading()
	const { data } = useQuery(GET_DATA)
	//GET DAFTAR TTB
	const { data: dataDaftarTTB } = useQuery(GET_DAFTAR_TTB)
	//GET DAFTAR SALES ORDER
	const { data: dataDaftarSalesOrder } = useQuery(GET_DAFTAR_SALES_ORDER)
	//GET CUSTOMER
	const { data: dataCustomer } = useQuery(GET_CUSTOMER)
	//GET DAFTAR ACCURATE
	const { data: dataAccurate } = useQuery(GET_ACCURATE)
	//GET DAFTAR BIAYA TAMBAHAN
	const { data: dataDaftarBiayaTambahan } = useQuery(GET_DAFTAR_BIAYA_TAMBAHAN)
	//GET DAFTAR TUJUAN
	const { data: dataDaftarTujuan } = useQuery(GET_DAFTAR_TUJUAN)

	const [selectednoSJatas, setselectednoSJatas] = useState()
	const [selectednoSJA, setselectednoSJA] = useState([])

	//refetch data
	const { refetch } = useQuery(GET_DAFTAR_INVOICE)

	const { data: dataDaftarInvoice } = useQuery(GET_DAFTAR_INVOICE, {
		onCompleted({ daftar_invoice }) {
			//set loading true
			setLoading(true)
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
			const PPN = dataInvoice[0]?.jenis_biaya_tambahan.split(`,`)

			const nama_barang_harga = nama_barang?.map((item, index) => {
				return {
					nama_barang: item,
					harga: harga[index],
					tipe_ppn: PPN[index]
				}
			})

			const jenis_biaya_tambahan_split = PPN?.map((item) => {
				item.split(`,`)
			})

			//map jenis_biaya_tambahan_split to label and value to array of object
			const jenis_biaya_tambahan_label_value = jenis_biaya_tambahan_split?.map(
				(item) => {
					//find from dataAccurate where kode_barang = item
					const accurate = dataAccurate?.accurate?.find(
						(item2) => item2.kode_barang == item
					)
					return {
						label: accurate?.nama_barang,
						value: accurate?.kode_barang
					}
				}
			)

			//reset data to newArray
			var newArray = nama_barang_harga?.map((item) => {
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

			//if newArray.nama_barang is not "" || "undefined" then reset({ newArray }) else not
			newArray?.map((item) => {
				if (item.nama_barang !== `` || item.nama_barang !== `undefined`) {
					reset({ newArray })
				}
			})

			//convert nomor_surat_jalan to array of object and assign `nomor_surat_jalanA.${index}`
			const test = nomor_surat_jalan?.map((item, index) => {
				return { [`nomor_surat_jalanA.${index}`]: item }
			})

			setselectednoSJA(nomor_surat_jalan)

			reset({ test })

			setLoading(false)
		}
	})

	//get data from dataDaftarInvoice where id = id
	const filteredData = dataDaftarInvoice?.daftar_invoice?.filter(
		(item) => item.id === parseInt(id as string)
	)

	//get nomor_invoice but remove last number after slahs but not dont remove the slash itself
	const nomor_invoice = filteredData?.[0]?.nomor_invoice.split(`/`)
	//add slash to nomor_invoice2
	const nomor_invoice2 = nomor_invoice?.slice(0, -1).join(`/`)

	//get all data from datdaftarinvoice  where nomor_invoice = nomor_invoice
	const mapInvoice = dataDaftarInvoice?.daftar_invoice.filter(
		(item) => item.nomor_invoice == filteredData?.[0]?.nomor_invoice
	)

	//get jenis_biaya_tambahan from mapInvoice and split by ,
	const jenis_biaya_tambahan = mapInvoice?.map(
		(item) => item.jenis_biaya_tambahan
	)

	//split jenis_biaya_tambahan by ,
	const jenis_biaya_tambahan_split = jenis_biaya_tambahan?.map((item) => {
		return item.split(`,`)
	})

	const taxNamesaless = jenis_biaya_tambahan_split?.map((item, index) => {
		const taxName = dataAccurate?.accurate?.filter(
			(tax) => tax.kode_barang === item[index]
		)
		return taxName?.[index]?.nama_barang
	})

	//for jenis_biaya_length make  default option  from label and value
	const defaultOption = []
	for (let i = 0; i < jenis_biaya_tambahan_split?.length; i++) {
		defaultOption.push({
			//get label from jenis_biaya_tambahan_split.label
			label: taxNamesaless,
			value: taxNamesaless
		})
	}

	//get all data from databiayatambahan where nomor_invoice = nomor_invoice
	const mapBiayaTambahan =
		dataDaftarBiayaTambahan?.daftar_biaya_tambahan
			.filter((item) => item.nomor_invoice == filteredData?.[0]?.nomor_invoice)
			.map((item) => item.id_biaya_tambahan) || []

	//get accurate from dataDaftarInvoice where id = id
	const accurate = filteredData?.[0]?.accurate

	const check1 = filteredData?.[0]?.jenis_biaya_tambahan

	//get id dataaccurate where kode_barang = accurate
	const idAccurate = dataAccurate?.accurate
		.filter((item) => item.kode_barang == accurate)
		.map((item) => item.id)

	//get id all invoice where invoice = nomor_invoice
	const idInvoice = mapInvoice?.map((item) => item.id)

	const [deleteDaftar_invoice] = useMutation(DELETE_DAFTAR_INVOICE, {
		refetchQueries: [{ query: GET_DATA }]
	})

	const deleteData = (id) => {
		deleteDaftar_invoice({ variables: { deleteDaftar_invoiceId: id } })
		router.push(`/keuangan/daftar-invoice/`)
	}

	const deleteAllInvoice = () => {
		idInvoice?.map((item) => deleteData(item))
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

	//create mutation biaya tambahan
	const [createBiaya_tambahan] = useMutation(CREATE_DAFTAR_BIAYA_TAMBAHAN, {
		refetchQueries: [{ query: GET_DATA }]
	})

	//create mutation function
	const createDataBiaya_tambahan = (data) => {
		createBiaya_tambahan({ variables: { input: data } })
	}

	const [updateDaftar_invoice] = useMutation(UPDATE_DAFTAR_INVOICE, {
		refetchQueries: [{ query: GET_DAFTAR_INVOICE }]
	})

	//update mutation function
	const updateDataInvoice = (data) => {
		updateDaftar_invoice({ variables: { input: data } })
	}

	const [updateDaftar_biaya_tambahan] = useMutation(
		UPDATE_DAFTAR_BIAYA_TAMBAHAN,
		{
			refetchQueries: [{ query: GET_DATA }]
		}
	)

	//update mutation function
	const updateDataBiaya_tambahan = (data) => {
		updateDaftar_biaya_tambahan({ variables: { input: data } })
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

	//get nama barang and split by , from sales order where nomor ttb is selected
	const namaBarang = dataDaftarSalesOrder?.daftar_sales_order
		.filter((item) => nomor_ttb?.includes(item.nomor_ttb))
		.map((item) => item.nama_barang)

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
	const sumHargaSatuan = hargaSatuanSplit?.map((item) =>
		item.reduce((a, b) => parseInt(a) + parseInt(b), 0)
	)

	//sum total sumHargaSatuan
	const sumTotal = sumHargaSatuan?.reduce(
		(a, b) => parseInt(a) + parseInt(b),
		0
	)

	console.log(`sumTotals`, sumTotal)

	const taxName = dataAccurate?.accurate?.map((tax) => {
		return {
			label: tax.nama_barang,
			value: tax.kode_barang
		}
	})

	//for tipe_Ppns length find taxName in accurate where tipe_ppns === kode_barang
	const taxNames = []
	for (let i = 0; i < tipe_ppnSplit.length; i++) {
		taxNames.push(
			...tipe_ppnSplit[i].map((item) =>
				dataAccurate?.accurate.find((tax) => tax.kode_barang === item)
			)
		)
	}

	const tipe_Ppns = filteredData?.[0]?.ppn_biaya_tambahan.split(`,`)

	//for tipe_Ppns length find taxName in accurate where tipe_ppns === kode_barang
	const taxNamesales = tipe_Ppns?.map((item) => {
		const taxName = dataAccurate?.accurate?.filter(
			(tax) => tax.kode_barang === item
		)
		return {
			label: taxName?.[0]?.nama_barang,
			value: taxName?.[0]?.kode_barang
		}
	})

	//reset data to  formRepeater
	const mapOption = taxNamesales?.map((taxNamesales) => {
		return {
			label: taxNamesales.label,
			value: taxNamesales.value
		}
	})

	//sum all harga_sebelum_ppn sales order where nomor_sales = nomor_ttb
	const sumHargaSebelumPpn = () => {
		const sum = dataDaftarSalesOrder?.daftar_sales_order
			.filter((item) => nomor_ttb?.includes(item.nomor_ttb))
			.reduce((a, b) => a + b.harga_sesudah_ppn, 0)
		return sum
	}

	const sumHargaTotal = () => {
		const sum = dataDaftarSalesOrder?.daftar_sales_order
			.filter((item) => nomor_ttb?.includes(item.nomor_ttb))
			//if a + b harga_total is "" || null || undefined return total_harga_ttb
			.reduce((a, b) => a + b.harga_total, 0)
		return sum
	}

	const sum_total_ppn = sumHargaTotal()

	console.log(`sum_total_ppns`, sum_total_ppn)

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

	const filteredSuratJalan2 = filteredSuratJalan?.filter((item) => {
		if (dataDaftarInvoice?.daftar_invoice) {
			return !dataDaftarInvoice?.daftar_invoice
				.map((item) => item.nomor_surat_jalan)
				.includes(item.nomor_surat_jalan)
		} else {
			return item
		}
	})

	//watch kota_tujuanA[0]
	const kota_tujuan = watch(`kota_tujuanA[0]`)

	console.log(`kota_tujuan`, kota_tujuan)

	const nama_tujuan = dataDaftarTujuan?.daftar_tujuan
		?.filter((item) => {
			return item.kode_tujuan === String(kota_tujuan)
		})
		.map((item) => item.nama_tujuan)

	console.log(`nama_tujuan`, nama_tujuan)

	const filteredSuratJalan3 = filteredSuratJalan2?.filter((item) => {
		if (kota_tujuan) {
			return item.kota_tujuan === kota_tujuan
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

		//temp nomor ttb
		const ttb_temp = data?.daftar_surat_jalan
			.filter((item) => {
				return item.nomor_surat_jalan === value
			})
			.map((item) => item.nomor_ttb)

		//allTTB = nomorTTB[0].nomor_ttb
		const allTTB = nomorTTB?.[0]?.nomor_ttb

		//get sales order where nomor ttb = allTTB
		const allSalesOrder = dataDaftarSalesOrder?.daftar_sales_order
			?.filter((item) => allTTB?.includes(item.nomor_ttb))
			.map((item) => item.nomor_sales_order)

		//get total tagihan from sales order where nomor sales order = allSalesOrder
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

	//if newArray1[i].nama_barang is not empty  for newArray1 length if newArray1.tipe_ppn undefined assign mapoption.value
	for (let i = 0; i < newArray1?.length; i++) {
		if (
			newArray1[i].nama_barang !== `` ||
			newArray1[i].nama_barang !== `undefined`
		) {
			if (newArray1[i].tipe_ppn === undefined) {
				newArray1[i].tipe_ppn = mapOption?.value
			}
		}
	}

	const harga_awal = newArray1?.map((item) => {
		return item.Harga
	})

	const ppn_awal = newArray1?.map((item) => {
		return item.ppn
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
			if (
				String(item.tipe_ppn) !== `null` ||
				String(item.tipe_ppn) !== `` ||
				String(item.tipe_ppn) !== `undefined` ||
				String(item.tipe_ppn) !== undefined
			) {
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

	const subTotal2 = harga?.reduce((a, b) => {
		return parseInt(a) + parseInt(b)
	}, 0)
	//if subtotal 2 nan set 0
	const subTotal3 = isNaN(subTotal2) ? 0 : subTotal2

	//if sumTotal nan set 0
	const tempTotal = sumTotal ? sumTotal : 0
	const subTotal = subTotal1 + subTotal4 + tempTotal

	console.log(`subTotal`, subTotal4)

	const subAfterPPN = sum_bersih + subTotal3 + sum_total_ppn

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

	const nomor_update = String(nomor_invoice2 + `/` + watch(`nomor_invoice`))

	const onSubmit = async (formData) => {
		//merge formData.nomor_surat_jalanA and formData.nomor_surat_jalan
		const nomorSuratJalan = [
			...formData.nomor_surat_jalanA,
			formData.nomor_surat_jalan
		]

		//get nama barang from newArray formData
		const namaBarang = formData.newArray.map((item) => item.nama_barang)

		//get ppn from newArray formData
		const ppn = formData.newArray.map((item) => item.tipe_ppn)

		//join nama barang into 1 string with ,
		const namaBarangString = namaBarang.join(`,`)

		//join harga into 1 string with ,
		const hargaString = harga_awal.join(`,`)

		//join ppn into 1 string with ,
		const ppnString = ppn.join(`,`)

		const namaBarangJoins = namaBarangString + `,` + namaBarangJoin
		const hargaJoins = hargaString + `,` + hargaSatuanJoin
		const ppnJoins = ppnString + `,` + tipe_ppnJoinComma

		const dataInvoice = nomorSuratJalan?.map((item, index) => {
			return {
				//get id from dataDaftarInvoice where nomor_surat_jalan = selectednoSJA
				id: parseInt(idInvoice),
				nomor_surat_jalan: item,
				nomor_invoice: String(nomor_update),
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
				harga_surat_jalan: String(subTotal1),
				ppn_biaya_tambahan: String(ppnString),
				harga_biaya_tambahan: String(subTotal2),
				keterangan: formData.keterangan,
				jenis_biaya_tambahan: String(formData.jenis_biaya_tambahan),
				id_biaya_tambahan: String(mapBiayaTambahan?.[0]),
				id_biaya_utama: String(filteredData?.[0]?.id_biaya_utama),
				total_tagihan: String(subAfterPPN),
				accurate: dataDaftarInvoice?.daftar_invoice?.[0]?.accurate,
				pengirim: dataDaftarInvoice?.daftar_invoice?.[0]?.pengirim,
				subtotal: String(subTotal),
				subtotal_tambahan: String(subTotal4),
				biaya_tambahan_sales: String(hargaSatuanJoin),
				itemNo_sales_order: String(tipe_ppnJoinComma),
				biaya_tambahan_join: String(hargaJoins),
				itemNo_join: String(ppnJoins),
				nama_barang_join: String(namaBarangJoins),
				kota_tujuan: String(nama_tujuan)
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

		//for data invoicelength  assign id
		for (let i = 0; i < dataInvoice.length; i++) {
			dataInvoice[i].id = idInvoice[i]
		}

		//if dataInvoicenomorsurat jalan undefined delete all data with nomor surat jalan undefined
		const dataInvoice_final = dataInvoice.filter(
			(item) => item.nomor_surat_jalan !== undefined
		)

		// //get only pengirim, nomor_invoice, jenis_biaya_tambahan,id_biaya_tambahan and harga_biaya_tambahan
		// const dataBiaya_tambahan = dataInvoice_final.map((item) => {
		// 	return {
		// 		id: item.id,
		// 		pengirim: item.pengirim,
		// 		nomor_invoice: item.nomor_invoice,
		// 		jenis_biaya_tambahan: item.jenis_biaya_tambahan,
		// 		id_biaya_tambahan: mapBiayaTambahan?.[0],
		// 		harga_biaya_tambahan: item.subtotal_tambahan
		// 	}
		// })
		// updateDataInvoice(dataInvoice_final)

		//fetch delete invoice from pages/api delete dataInvoice_final.id
		const deleteInvoice = await fetch(`/api/delete_invoice`, {
			method: `DELETE`,
			headers: {
				"Content-Type": `application/json`
			},
			body: JSON.stringify({
				id: dataInvoice_final.map((item) => item.id)
			})
		})

		const deleteInvoiceJson = await deleteInvoice.json()

		console.log(`deleteInvoiceJson`, deleteInvoiceJson)

		updateDataInvoice(dataInvoice_final)

		const check = dataDaftarInvoice?.daftar_invoice.find(
			(item) =>
				item.nomor_ttb === dataInvoice_final.map((item) => item.nomor_ttb)
		)
		if (check === undefined) {
			notification.success({
				message: `Data berhasil dibuat`
			})
		}
		router.push(`/keuangan/daftar-invoice`)
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
							{role === `superadmin` ||
							role === `Superadmin` ||
							role === `Super Admin` ? (
								<li className="action">
									<Popconfirm
										title="Are you sure delete this task?"
										className="button is-primary"
										onConfirm={() => {
											deleteAllInvoice()
										}}
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
							) : null}
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
							{role === `superadmin` ||
							role === `Superadmin` ||
							role === `Super Admin` ? (
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
							) : null}
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
						<label style={{ fontSize: `22px`, fontWeight: `bolder` }}>
							Nomor Invoice
						</label>
						<div>
							<div
								className="form-group"
								style={{
									display: `inline-block`,
									width: `calc(50% - 8px)`,
									marginTop: `1%`
								}}
							>
								<input
									type="text"
									className="form-control"
									style={{ width: `100%` }}
									defaultValue={nomor_invoice2}
									readOnly
									disabled
								/>
							</div>
							<div
								className="form-group"
								style={{
									display: `inline-block`,
									width: `calc(50% - 8px)`,
									margin: `0 8px`
								}}
							>
								<input
									type="text"
									required
									style={{ width: `100%` }}
									{...register(`nomor_invoice`)}
									defaultValue={
										filteredData?.[0]?.nomor_invoice.split(`/`)[
											filteredData?.[0]?.nomor_invoice.split(`/`).length - 1
										]
									}
								/>
							</div>
						</div>
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
											<label style={{ fontSize: `12px`, fontWeight: `bolder` }}>
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
												{filteredSuratJalan3
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
											<label style={{ fontSize: `12px`, fontWeight: `bolder` }}>
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
											<label style={{ fontSize: `12px`, fontWeight: `bolder` }}>
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
											<label style={{ fontSize: `12px`, fontWeight: `bolder` }}>
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
											<label style={{ fontSize: `12px`, fontWeight: `bolder` }}>
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
						{
							//if harga is not empty show this if not hidden
							harga !== `` && (
								<div className="field" style={{ marginTop: `1%` }}>
									<label style={{ fontWeight: `bolder` }} className="label">
										Nama Barang (Accurate)
									</label>
									<select
										{...register(`jenis_biaya_tambahan`)}
										style={{ width: `100%` }}
										required
									>
										<option value="0">Pilih Biaya Tambahan</option>
										{
											//from nama_barang
											dataAccurate?.accurate?.map((item, index) => (
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
						}
						<div style={{ marginTop: `2%` }}>
							<label
								style={{ fontWeight: `bold`, paddingLeft: `5px` }}
								className="label"
							>
								Biaya Tambahan Sales Order
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
													style={{ width: `100%` }}
													className="input"
													type="text"
													placeholder="Tipe PPN"
													defaultValue={
														//find from dataAccurate where item.tipe_ppn === kodeBarang
														dataAccurate?.accurate.find(
															(data) => data.kode_barang === item.tipe_ppn
														)?.nama_barang
													}
													{...register(`tipePpn.${index}`)}
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
								inputTypes={[`text`, `text`, `select`]}
								inputProps={[
									{},
									{},
									{
										options: taxName,
										placeholder: `Pilih PPN`,
										defaultValue: mapOption
									}
								]}
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
