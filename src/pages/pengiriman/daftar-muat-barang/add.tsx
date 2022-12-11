/* eslint-disable array-callback-return */
import { gql, useMutation, useQuery } from "@apollo/client"
import IconPlus from "@assets/icons/icon-plus-fill.svg"
import IconTrash from "@assets/icons/icon-trash.svg"
import AdminPage from "@components/admin/AdminPage.component"
import Dashboard from "@components/dashboard/Dashboard.component"
import useLoading from "@hooks/useLoading.hook"
import { Button, DatePicker, message, notification } from "antd"

import { CREATE_DAFTAR_PACKING_LIST } from "graphql/daftar_packing_list/mutations"
import { GET_DAFTAR_SALES_ORDER } from "graphql/daftar_sales_order/queries"
import { CREATE_DAFTAR_SURAT_PENGANTAR } from "graphql/daftar_surat_pengantar/mutations"
import { GET_DAFTAR_SURAT_PENGANTAR } from "graphql/daftar_surat_pengantar/queries"
import { GET_DAFTAR_TTB } from "graphql/daftar_ttb/queries"
import { GET_VECHNICLE } from "graphql/mobil/queries"
import { GET_VENDOR } from "graphql/vendor/queries"
import moment from "moment"
import Link from "next/link"
import { useRouter } from "next/router"
import { useEffect, useRef, useState } from "react"
import { Controller, useFieldArray, useForm } from "react-hook-form"
import { CREATE_DAFTAR_MUAT_BARANG } from "../../../../graphql/daftar_muat_barang/mutations"
//get data

const GET_DATA = gql`
	query daftar_muat_barang {
		daftar_muat_barang {
			id
			nomor_muat_barang
			nomor_ttb
			total_ttb
			total_koli
			kota_tujuan
			total_volume
			nomor_kendaraan
			vendor_pelayanan
			posisi
			nomor_container
			nomor_seal
		}
	}
`
export default function Home() {
	const formRef = useRef(null)
	const { setLoading } = useLoading()
	const { data } = useQuery(GET_DATA)

	//GET DAFTAR TTB
	const { data: dataDaftarTTB } = useQuery(GET_DAFTAR_TTB)
	//GET DATA KENDARAAN
	const { data: dataMobil } = useQuery(GET_VECHNICLE)
	//GET DATA VENDOR
	const { data: dataVendor } = useQuery(GET_VENDOR)
	//get data surat jalan
	const { data: dataDaftarSuratJalan } = useQuery(GET_DAFTAR_SURAT_PENGANTAR)
	//get data sales order
	const { data: dataDaftarSalesOrder } = useQuery(GET_DAFTAR_SALES_ORDER)

	const router = useRouter()
	const setForm = useForm()
	const { control, register, handleSubmit, setValue } = setForm

	useEffect(() => {
		formRef.current?.setFieldsValue({
			nomor_ttb: data?.nomor_ttb
		})
	}, [data])

	//usestat set selected value array
	const [selectednoTTBatas, setSelectednoTTBatas] = useState()
	const [selectednoTTBtengah, setSelectednoTTBtengah] = useState()
	const [selectednoTTBbawah, setSelectednoTTBbawah] = useState()
	const [selectednoTTBA] = useState([])
	const [selectednoTTBT] = useState([])
	const [selectednoTTBB] = useState([])

	const [createDaftar_muat_barang] = useMutation(CREATE_DAFTAR_MUAT_BARANG, {
		refetchQueries: [{ query: GET_DATA }]
	})

	//create mutation function
	const createData = (data) => {
		createDaftar_muat_barang({ variables: { input: data } })
	}

	const [createDaftar_surat_jalan] = useMutation(
		CREATE_DAFTAR_SURAT_PENGANTAR,
		{
			refetchQueries: [{ query: GET_DATA }]
		}
	)

	//create mutation function
	const createDataSuratJalan = (data) => {
		createDaftar_surat_jalan({ variables: { input: data } })
	}

	const [createDaftar_packing_list] = useMutation(CREATE_DAFTAR_PACKING_LIST, {
		refetchQueries: [{ query: GET_DATA }]
	})

	//create mutation function
	const createDataPackingList = (data) => {
		createDaftar_packing_list({ variables: { input: data } })
	}

	const {
		fields: atasfields,
		append: appendatas,
		remove: removeatas
	} = useFieldArray({
		control,
		name: `testatas`
	})

	const {
		fields: tengahfields,
		append: appendtengah,
		remove: removetengah
	} = useFieldArray({
		control,
		name: `testtengah`
	})

	const {
		fields: bawahfields,
		append: appendbawah,
		remove: removebawah
	} = useFieldArray({
		control,
		name: `testbawah`
	})

	//MAP DATA DAFTAR TTB
	const mapDaftarTTB = dataDaftarTTB?.daftar_ttb?.map((ttb) => {
		return {
			nomor_ttb: ttb.ttb_number,
			pengirim: ttb.pengirim,
			kota_tujuan: ttb.kota_tujuan,
			total_volume: ttb.total_volume,
			jenis_pengiriman: ttb.jenis_pengiriman,
			penerima: ttb.nama_penerima,
			tanggal_diterima: ttb.tanggal_diterima,
			koli: ttb.koli,
			volume: ttb.volume,
			nama_barang: ttb.nama_barang
		}
	})

	//join nama barang when same nomor ttb to string and remove array
	const joinNamaBarang = mapDaftarTTB?.reduce((acc, current) => {
		const x = acc.find((item) => item.nomor_ttb === current.nomor_ttb)
		if (!x) {
			return acc.concat([current])
		}
		x.nama_barang = `${x.nama_barang}, ${current.nama_barang}`
		return acc
	}, [])

	//merge mapDaftarTTB and joinNamaBarang when same nomor ttb
	const mergeTTBjoin = mapDaftarTTB?.map((item) => {
		const x = joinNamaBarang.find((i) => i.nomor_ttb === item.nomor_ttb)
		return {
			...item,
			nama_barang: x.nama_barang
		}
	})

	//merge duplicate no ttb filter by selected no ttb
	const mergeTTB = mergeTTBjoin?.reduce((acc, current) => {
		const x = acc.find((item) => item.nomor_ttb === current.nomor_ttb)
		if (!x) {
			return acc.concat([current])
		}
		//sum total koli
		x.koli = x.koli + current.koli
		return acc
	}, [])

	/* filter no ttb exclude from nomor_ttbatas
	nomor_ttbA[${index}]
	nomor_ttbtengah
	nomor_ttbT[${index}]
	nomor_ttbbawah
	nomor_ttbB[${index}]*/

	console.log(`length`, dataDaftarSuratJalan?.daftar_surat_pengantar.length)
	//filter sales order where nomor ttb not in daftar muat barang
	const filterSalesOrder = dataDaftarSalesOrder?.daftar_sales_order?.filter(
		(item) => {
			const x = data?.daftar_muat_barang?.find(
				(i) => i.nomor_ttb === item.nomor_ttb
			)
			if (!x) {
				return item
			}
		}
	)
	const kepala = selectednoTTBatas
	const tengah = selectednoTTBtengah
	const bawah = selectednoTTBbawah
	const arrayKepala = selectednoTTBA
	const arrayTengah = selectednoTTBT
	const arrayBawah = selectednoTTBB

	//merge in 1 var
	const mergeSelected = [...arrayKepala, ...arrayTengah, ...arrayBawah]

	//merge kepala , tengah, bawah & mergeSelected
	const mergeALLselected = [...mergeSelected, kepala, tengah, bawah]

	//filter sales order where nomor ttb not in mergeALLselected
	const filterSalesOrderA = filterSalesOrder?.filter((item) => {
		const x = mergeALLselected
		if (!x.includes(item.nomor_ttb)) {
			return item
		}
	})

	function addLeadingZeros(num, totalLength) {
		return String(num).padStart(totalLength, `0`)
	}

	const increment = data?.daftar_muat_barang.length + 1

	const increment2 = dataDaftarSuratJalan?.daftar_surat_pengantar.length + 1

	async function onSubmit(formData) {
		setLoading(true)
		try {
			//make form data into array of object
			const temp1 = []
			const dataFilterTTB = mergeTTB?.filter((item) => {
				return (
					item.nomor_ttb === formData.nomor_ttbatas ||
					item.nomor_ttb === formData.nomor_ttbtengah ||
					item.nomor_ttb === formData.nomor_ttbbawah ||
					item.nomor_ttb === formData.nomor_ttbA ||
					item.nomor_ttb === formData.nomor_ttbT ||
					item.nomor_ttb === formData.nomor_ttbB
				)
			})
			//date = today date but only year and month
			const newDate = String(
				moment.unix(formData.tanggal_mb / 1000).format(`YY-MM`)
			)

			for (let i = 0; i < 1; i++) {
				temp1.push({
					nomor_muat_barang:
						`MB/` +
						dataFilterTTB?.[0]?.kota_tujuan +
						`/` +
						newDate +
						`/` +
						(increment + 1),
					nomor_ttb: formData.nomor_ttbatas,
					pengirim: formData.pengirimatas,
					penerima:
						formData.penerimaatas +
						`/` +
						dataDaftarTTB?.daftar_ttb.find(
							(item2) => item2.ttb_number === formData.nomor_ttbatas
						)?.alamat_tujuan +
						` / ` +
						dataFilterTTB?.[0]?.kota_tujuan,
					tanggal_masuk: formData.tanggal_masukatas,
					posisi: `Kepala`,
					satuan: `koli`,
					volume: String(formData.volumeatas),
					koli: String(formData.koliatas),
					nomor_kendaraan: formData.nomor_kendaraan,
					nama_barang: formData.nama_barangatas
				})
			}

			const temp2 = []
			for (let i = 0; i < formData.nomor_ttbtengah.length; i++) {
				temp2.push({
					nomor_muat_barang:
						`MB/` +
						dataFilterTTB?.[0]?.kota_tujuan +
						`/` +
						newDate +
						`/` +
						(increment + 1),
					nomor_ttb: formData.nomor_ttbtengah,
					pengirim: formData.pengirimtengah,
					penerima:
						formData.penerimatengah +
						`/` +
						dataDaftarTTB?.daftar_ttb.find(
							(item2) => item2.ttb_number === formData.nomor_ttbtengah
						)?.alamat_tujuan +
						` / ` +
						dataFilterTTB?.[0]?.kota_tujuan,
					tanggal_masuk: formData.tanggal_masuktengah,
					posisi: `Tengah`,
					satuan: `koli`,
					volume: String(formData.volumetengah),
					koli: String(formData.kolitengah),
					nomor_kendaraan: formData.nomor_kendaraan,
					nama_barang: formData.nama_barangtengah
				})
			}

			const temp3 = []
			for (let i = 0; i < 1; i++) {
				temp3.push({
					nomor_muat_barang:
						`MB/` +
						dataFilterTTB?.[0]?.kota_tujuan +
						`/` +
						newDate +
						`/` +
						(increment + 1),
					nomor_ttb: formData.nomor_ttbbawah,
					pengirim: formData.pengirimbawah,
					penerima:
						formData.penerimabawah +
						`/` +
						dataDaftarTTB?.daftar_ttb.find(
							(item2) => item2.ttb_number === formData.nomor_ttbbawah
						)?.alamat_tujuan +
						` / ` +
						dataFilterTTB?.[0]?.kota_tujuan,
					tanggal_masuk: formData.tanggal_masukbawah,
					posisi: `Bawah`,
					satuan: `koli`,
					volume: String(formData.volumebawah),
					koli: String(formData.kolibawah),
					nomor_kendaraan: formData.nomor_kendaraan,
					nama_barang: formData.nama_barangbawah
				})
			}

			//merge duplicate data 1  by nomor ttb
			const data1 = temp1.reduce((acc, current) => {
				const x = acc.find((item) => item.nomor_ttb === current.nomor_ttb)
				if (!x) {
					return acc.concat([current])
				} else {
					return acc
				}
			}, [])

			const data2 = temp2.reduce((acc, current) => {
				const x = acc.find((item) => item.nomor_ttb === current.nomor_ttb)
				if (!x) {
					return acc.concat([current])
				} else {
					return acc
				}
			}, [])

			const data3 = temp3.reduce((acc, current) => {
				const x = acc.find((item) => item.nomor_ttb === current.nomor_ttb)
				if (!x) {
					return acc.concat([current])
				} else {
					return acc
				}
			}, [])

			const dataA = []
			if (formData?.nomor_ttbA !== undefined) {
				for (let i = 0; i < formData.nomor_ttbA.length; i++) {
					dataA.push({
						nomor_muat_barang:
							`MB/` +
							dataFilterTTB?.[0]?.kota_tujuan +
							`/` +
							newDate +
							`/` +
							(increment + 1),
						nomor_ttb: formData.nomor_ttbA[i],
						pengirim: formData.pengirimA[i],
						penerima:
							formData.penerimaA[i] +
							`/` +
							dataDaftarTTB?.daftar_ttb.find(
								(item2) => item2.ttb_number === formData.nomor_ttbA[i]
							)?.alamat_tujuan +
							` / ` +
							dataFilterTTB?.[0]?.kota_tujuan,

						tanggal_masuk: formData.tanggal_masukA[i],
						posisi: `Kepala`,
						satuan: `koli`,
						volume: String(formData.volumeA[i]),
						koli: String(formData.koliA[i]),
						nomor_kendaraan: formData.nomor_kendaraan,
						nama_barang: formData.nama_barangA[i]
					})
				}
			} else {
				dataA.push({
					nomor_ttb: ``,
					pengirim: ``,
					penerima: ``,
					tanggal_masuk: ``,
					posisi: `Kepala`,
					satuan: ``,
					volume: ``,
					koli: ``,
					nomor_kendaraan: ``,
					nama_barang: ``
				})
			}
			//make loop to create array of object

			const dataT = []

			if (formData?.nomor_ttbT !== undefined) {
				for (let i = 0; i < formData.nomor_ttbT.length; i++) {
					dataT.push({
						nomor_muat_barang:
							`MB/` +
							dataFilterTTB?.[0]?.kota_tujuan +
							`/` +
							newDate +
							`/` +
							(increment + 1),
						nomor_ttb: formData.nomor_ttbT[i],
						pengirim: formData.pengirimT[i],
						penerima:
							formData.penerimaT[i] +
							`/` +
							dataDaftarTTB?.daftar_ttb.find(
								(item2) => item2.ttb_number === formData.nomor_ttbT[i]
							)?.alamat_tujuan +
							` / ` +
							dataFilterTTB?.[0]?.kota_tujuan,

						tanggal_masuk: formData.tanggal_masukT[i],
						posisi: `Tengah`,
						satuan: `koli`,
						volume: String(formData.volumeT[i]),
						koli: String(formData.koliT[i]),
						nomor_kendaraan: formData.nomor_kendaraan,
						nama_barang: formData.nama_barangT[i]
					})
				}
			} else {
				dataT.push({
					nomor_ttb: ``,
					pengirim: ``,
					penerima: ``,
					tanggal_masuk: ``,
					posisi: `Tengah`,
					satuan: ``,
					volume: ``,
					koli: ``,
					nomor_kendaraan: ``,
					nama_barang: ``
				})
			}
			//make loop to create array of object
			const dataB = []

			if (formData?.nomor_ttbB !== undefined) {
				for (let i = 0; i < formData.nomor_ttbB.length; i++) {
					dataB.push({
						nomor_muat_barang:
							`MB/` +
							dataFilterTTB?.[0]?.kota_tujuan +
							`/` +
							newDate +
							`/` +
							(increment + 1),
						nomor_ttb: formData.nomor_ttbB[i],
						pengirim: formData.pengirimB[i],
						penerima:
							formData.penerimaB[i] +
							`/` +
							dataDaftarTTB?.daftar_ttb.find(
								(item2) => item2.ttb_number === formData.nomor_ttbB[i]
							)?.alamat_tujuan +
							` / ` +
							dataFilterTTB?.[0]?.kota_tujuan,
						tanggal_masuk: formData.tanggal_masukB[i],
						satuan: `koli`,
						posisi: `Bawah`,
						koli: String(formData.koliB[i]),
						nomor_kendaraan: formData.nomor_kendaraan,
						volume: String(formData.volumeB[i]),
						nama_barang: formData.nama_barangB[i]
					})
				}
			} else {
				dataB.push({
					nomor_ttb: ``,
					pengirim: ``,
					penerima: ``,
					tanggal_masuk: ``,
					posisi: `Bawah`,
					satuan: ``,
					volume: ``,
					koli: ``,
					nomor_kendaraan: ``,
					nama_barang: ``
				})
			}

			//merge dataA, dataT, dataB , data1, data2, data3
			const datas = dataA.concat(dataT, dataB, data1, data2, data3)

			//remove if nomor_ttb is undefined
			const dataFilter = datas.filter((item) => item.nomor_ttb !== ``)

			//assign total koli to data filter
			dataFilter.map((item) => {
				item.kota_tujuan = dataFilterTTB?.[0]?.kota_tujuan
			})
			console.log(`test`, dataFilterTTB?.[0]?.kota_tujuan)
			dataFilter.map((item) => {
				item.nomor_container = String(formData.nomor_container)
			})
			dataFilter.map((item) => {
				item.nomor_seal = String(formData.nomor_seal)
			})
			dataFilter.map((item) => {
				item.nama_kapal = formData.nama_kapal
			})

			//sum all volume
			const sumVolume = dataFilter.reduce((a, b) => a + Number(b.volume), 0)

			dataFilter.map((item) => {
				item.total_volume = String(sumVolume)
			})

			dataFilter.map((item) => {
				item.vendor_pelayanan = formData.vendor_pelayanan
			})

			dataFilter.map((item) => {
				item.estimated_date = formData.estimasi_date
			})

			//sum data filter koli
			const sumKoliFilter = parseInt(
				dataFilter.reduce((a, b) => a + Number(b.koli), 0)
			)

			dataFilter.map((item) => {
				item.total_koli = String(sumKoliFilter)
			})
			dataFilter.map((item) => {
				item.estimated_date = formData.estimasi_date
			})
			dataFilter.map((item) => {
				item.tanggal_muat_barang = formData.tanggal_mb
			})

			dataFilter.map((item) => {
				item.nomor_muat_barang =
					`MB/` +
					dataFilterTTB?.[0]?.kota_tujuan +
					`/` +
					String(moment.unix(formData.tanggal_mb / 1000).format(`YY-MM`)) +
					`/` +
					addLeadingZeros(increment, 4)
			})

			const dataFilter2 = dataFilter.filter(
				(item) => item.nomor_ttb !== `Silahkan Pilih No. TTB`
			)

			dataFilter2.map((item) => {
				item.total_ttb = String(dataFilter2.length)
			})
			// create new data
			for (let i = 0; i < dataFilter2.length; i++) {
				const check = data?.daftar_muat_barang.find(
					(item) => item.nomor_ttb === dataFilter2[i].nomor_ttb
				)
				if (check !== undefined) {
					notification.error({
						message: `Nomor Muat Barang sudah ada`
					})
				}
				if (check === undefined) {
					createData(dataFilter2[i])
				}
			}
			dataFilter2.map((item) => {
				delete item.tanggal_muat_barang
				delete item.nama_kapal
			})
			//create packing list
			for (let i = 0; i < dataFilter2.length; i++) {
				const check = data?.daftar_muat_barang.find(
					(item) => item.nomor_ttb === dataFilter2[i].nomor_ttb
				)
				if (check === undefined) {
					createDataPackingList(dataFilter2[i])
				}
			}
			const data_packing_list = dataFilter2

			data_packing_list.map((item) => {
				item.keterangan = ``
			})

			//remove taggal muar barang
			data_packing_list.map((item) => {
				delete item.tanggal_muat_barang
				delete item.keterangan
			})

			for (let i = 0; i < data_packing_list.length; i++) {
				data_packing_list.map((item) => {
					item.nomor_surat_jalan =
						`SP/` +
						dataFilterTTB?.[0]?.kota_tujuan +
						`/` +
						String(moment.unix(formData.tanggal_mb / 1000).format(`YY-MM`)) +
						`/` +
						addLeadingZeros(increment2, 4)
				})
				const check = data?.daftar_muat_barang.find(
					(item) => item.nomor_ttb === dataFilter2[i].nomor_ttb
				)
				if (check === undefined) {
					createDataSuratJalan(data_packing_list[i])
				}
			}
			const check = data?.daftar_muat_barang.find(
				(item) => item.nomor_ttb === dataFilter2[0].nomor_ttb
			)
			if (check === undefined) {
				message.success(`Data Berhasil Disimpan`)
			}
			router.push(`/pengiriman/daftar-muat-barang`)
		} catch (error) {
			console.log(error)
		}
		setLoading(false)
	}

	const handleChangeMB = (value) => {
		const data = mergeTTB?.find((item) => item.nomor_ttb === value)
		//selectednomorttbatas
		setSelectednoTTBatas(data?.nomor_ttb)
		setValue(`nomor_ttbatas`, selectednoTTBatas)
		setValue(`pengirimatas`, data.pengirim)
		setValue(
			`tanggal_masukatas`,
			moment(data.tanggal_diterima).format(`DD-MM-YYYY`)
		)
		setValue(`penerimaatas`, data.penerima)
		setValue(`koliatas`, data.koli)
		setValue(`satuanatas`, data.satuan)
		setValue(`volumeatas`, data.total_volume)
		setValue(`nama_barangatas`, data.nama_barang)
	}
	const handleChangeMBbawah = (value) => {
		const data = mergeTTB?.find((item) => item.nomor_ttb === value)
		setSelectednoTTBbawah(data?.nomor_ttb)
		setValue(`pengirimbawah`, data.pengirim)
		setValue(
			`tanggal_masukbawah`,
			moment(data.tanggal_diterima).format(`DD-MM-YYYY`)
		)
		setValue(`penerimabawah`, data.penerima)
		setValue(`kolibawah`, data.koli)
		setValue(`satuanbawah`, data.satuan)
		setValue(`volumebawah`, data.total_volume)
		setValue(`nama_barangbawah`, data.nama_barang)
	}
	const handleChangeMBtengah = (value) => {
		const data = mergeTTB?.find((item) => item.nomor_ttb === value)
		setSelectednoTTBtengah(data?.nomor_ttb)
		setValue(`pengirimtengah`, data.pengirim)
		setValue(
			`tanggal_masuktengah`,
			moment(data.tanggal_diterima).format(`DD-MM-YYYY`)
		)
		setValue(`penerimatengah`, data.penerima)
		setValue(`kolitengah`, data.koli)
		setValue(`satuantengah`, data.satuan)
		setValue(`volumetengah`, data.total_volume)
		setValue(`nama_barangtengah`, data.nama_barang)
	}

	const handleChangeMBA = (value, index) => {
		const data = mergeTTB?.find((item) => item.nomor_ttb === value)
		setValue(`pengirimA[${index}]`, data.pengirim)
		setValue(
			`tanggal_masukA[${index}]`,
			moment(data.tanggal_diterima).format(`DD-MM-YYYY`)
		)
		setValue(`penerimaA[${index}]`, data.penerima)
		setValue(`koliA[${index}]`, data.koli)
		setValue(`satuanA[${index}]`, data.satuan)
		setValue(`volumeA[${index}]`, data.total_volume)
		setValue(`nama_barangA[${index}]`, data.nama_barang)
	}

	const handleChangeMBT = (value, index) => {
		const data = mergeTTB?.find((item) => item.nomor_ttb === value)
		setValue(`pengirimT[${index}]`, data.pengirim)
		setValue(
			`tanggal_masukT[${index}]`,
			moment(data.tanggal_diterima).format(`DD-MM-YYYY`)
		)
		setValue(`penerimaT[${index}]`, data.penerima)
		setValue(`koliT[${index}]`, data.koli)
		setValue(`satuanT[${index}]`, data.satuan)
		setValue(`volumeT[${index}]`, data.total_volume)
		setValue(`nama_barangT[${index}]`, data.nama_barang)
	}

	const handleChangeMBB = (value, index) => {
		const data = mergeTTB?.find((item) => item.nomor_ttb === value)
		setValue(`pengirimB[${index}]`, data.pengirim)
		setValue(
			`tanggal_masukB[${index}]`,
			moment(data.tanggal_diterima).format(`DD-MM-YYYY`)
		)
		setValue(`penerimaB[${index}]`, data.penerima)
		setValue(`koliB[${index}]`, data.koli)
		setValue(`satuanB[${index}]`, data.satuan)
		setValue(`volumeB[${index}]`, data.total_volume)
		setValue(`nama_barangB[${index}]`, data.nama_barang)
	}

	return (
		<AdminPage
			parent={
				<Link href="/pengiriman/daftar-muat-barang">
					<a>Daftar Muat Barang</a>
				</Link>
			}
			authId=""
			title="Tambah Daftar Muat Barang"
			legend=""
			setForm={setForm}
		>
			<section className="section" style={{ paddingRight: `10%` }}>
				<div className="container">
					<form className="form" onSubmit={handleSubmit(onSubmit)}>
						<div className="row">
							<div className="col" style={{ marginLeft: `90%` }}>
								<i
									onClick={(e) => {
										e.preventDefault()
										appendatas({})
									}}
									className="icon"
									role="img"
								></i>
							</div>
						</div>
						<br></br>
						<div className="stepn stepn-active" data-step="1">
							<div>
								<div className="field" style={{}}>
									<label
										style={{ marginLeft: `50%`, fontWeight: `bolder` }}
										className="label"
									>
										Depan (Kepala)
									</label>
								</div>
								<div
									className="row"
									style={{ display: `flex`, paddingTop: `1%` }}
								>
									<div className="col" style={{ width: `100%` }}>
										<label style={{ fontWeight: `bold` }} htmlFor="no_ttb">
											No. TTB
										</label>
										<select
											{...register(`nomor_ttbatas`)}
											onChange={(e) => handleChangeMB(e.target.value)}
											className="input"
										>
											<option>
												{selectednoTTBatas === undefined
													? `Silahkan Pilih No. TTB`
													: selectednoTTBatas}
											</option>
											{filterSalesOrderA
												?.map((ttb) => {
													return (
														<option
															style={{}}
															key={ttb.nomor_ttb}
															value={ttb.nomor_ttb}
														>
															{ttb.nomor_ttb}
														</option>
													)
												})
												?.reverse()}
										</select>
									</div>
									<div className="col" style={{ width: `16%` }}>
										<label
											style={{ fontWeight: `bolder`, marginLeft: `10%` }}
											htmlFor="tanggal_masuk"
										>
											Tanggal Masuk
										</label>
										<input
											style={{ marginLeft: `10%` }}
											className="input"
											type="text"
											placeholder="Tanggal Masuk"
											{...register(`tanggal_masukatas`)}
											readOnly
										/>
									</div>
									<div
										className="field"
										style={{ marginLeft: `2%`, width: `12%` }}
									>
										<div className="control">
											<label
												style={{ fontWeight: `bolder`, marginLeft: `10%` }}
												htmlFor="Pengirim"
											>
												Pengirim
											</label>
											<input
												style={{ marginLeft: `10%` }}
												className="input"
												type="text"
												placeholder="Pengirim"
												{...register(`pengirimatas`)}
												readOnly
											/>
										</div>
									</div>
									<div
										className="field"
										style={{ marginLeft: `1%`, width: `13%` }}
									>
										<div className="control">
											<label
												style={{ fontWeight: `bolder`, marginLeft: `10%` }}
												htmlFor="Penerimaatas"
											>
												Penerima
											</label>
											<input
												style={{ marginLeft: `10%` }}
												className="input"
												type="text"
												placeholder="Penerima"
												{...register(`penerimaatas`)}
												readOnly
											/>
										</div>
									</div>
									<div
										className="field"
										style={{ marginLeft: `2%`, width: `5%` }}
									>
										<label
											style={{ fontWeight: `bolder`, marginLeft: `10%` }}
											className="label"
										>
											Koli
										</label>
										<div className="control">
											<input
												style={{ marginLeft: `10%` }}
												className="input"
												type="text"
												placeholder="Koli"
												{...register(`koliatas`)}
												readOnly
											/>
										</div>
									</div>

									<div
										className="field"
										style={{ marginLeft: `2%`, width: `12%` }}
									>
										<label
											style={{ fontWeight: `bolder`, fontSize: `14px` }}
											className="label"
										>
											Volume M³
										</label>
										<div className="control">
											<input
												className="input"
												type="text"
												placeholder="Volume M³"
												{...register(`volumeatas`)}
												readOnly
											/>
										</div>
									</div>
									<div
										className="field"
										style={{ marginLeft: `2%`, width: `13%` }}
									>
										<label
											style={{ fontWeight: `bolder`, fontSize: `14px` }}
											className="label"
										>
											Nama Barang
										</label>
										<div className="control">
											<input
												className="input"
												type="text"
												placeholder="Nama Barang"
												{...register(`nama_barangatas`)}
												readOnly
											/>
										</div>
									</div>
									<div
										className="col"
										style={{ marginLeft: `15px`, marginTop: `0px` }}
									>
										<i
											onClick={(e) => {
												e.preventDefault()
												appendatas({})
												appendtengah({})
												appendbawah({})
											}}
											className="icon"
											role="img"
										>
											<IconPlus className="svg" />
										</i>
									</div>
								</div>
							</div>
							{atasfields.map((item, index) => {
								return (
									<div
										className="row"
										key={item.id}
										style={{ display: `flex`, paddingTop: `1%` }}
									>
										<div className="col" style={{ width: `100%` }}>
											<label style={{ fontWeight: `bold` }} htmlFor="no_ttb">
												No. TTB
											</label>
											<select
												{...register(`nomor_ttbA[${index}]`)}
												onChange={(e) => {
													handleChangeMBA(e.target.value, index)
													selectednoTTBA[index] = e.target.value
												}}
											>
												<option value={selectednoTTBA[index]}>
													{selectednoTTBA[index] === undefined
														? `Silahkan Pilih No. TTB`
														: selectednoTTBA[index]}
												</option>
												{filterSalesOrderA
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
										<div className="col" style={{ width: `16%` }}>
											<label
												style={{ fontWeight: `bolder`, marginLeft: `10%` }}
												htmlFor="tanggal_masuk"
											>
												Tanggal Masuk
											</label>
											<input
												style={{ marginLeft: `10%` }}
												className="input"
												type="text"
												placeholder="Tanggal Masuk"
												{...register(`tanggal_masukA[${index}]`)}
												readOnly
											/>
										</div>
										<div
											className="field"
											style={{ marginLeft: `2%`, width: `12%` }}
										>
											<div className="control">
												<label
													style={{ fontWeight: `bolder`, marginLeft: `10%` }}
													htmlFor="Pengirim"
												>
													Pengirim
												</label>
												<input
													style={{ marginLeft: `10%` }}
													className="input"
													type="text"
													placeholder="Pengirim"
													{...register(`pengirimA[${index}]`)}
													readOnly
												/>
											</div>
										</div>
										<div
											className="field"
											style={{ marginLeft: `1%`, width: `13%` }}
										>
											<div className="control">
												<label
													style={{ fontWeight: `bolder`, marginLeft: `10%` }}
													htmlFor="PenerimaA"
												>
													Penerima
												</label>
												<input
													style={{ marginLeft: `10%` }}
													className="input"
													type="text"
													placeholder="Penerima"
													{...register(`penerimaA[${index}]`)}
													readOnly
												/>
											</div>
										</div>
										<div
											className="field"
											style={{ marginLeft: `2%`, width: `5%` }}
										>
											<label
												style={{ fontWeight: `bolder`, marginLeft: `10%` }}
												className="label"
											>
												Koli
											</label>
											<div className="control">
												<input
													style={{ marginLeft: `10%` }}
													className="input"
													type="text"
													placeholder="Koli"
													{...register(`koliA[${index}]`)}
													readOnly
												/>
											</div>
										</div>
										<div
											className="field"
											style={{ marginLeft: `2%`, width: `12%` }}
										>
											<label
												style={{ fontWeight: `bolder`, fontSize: `14px` }}
												className="label"
											>
												Volume M³
											</label>
											<div className="control">
												<input
													className="input"
													type="text"
													placeholder="Volume M³"
													{...register(`volumeA[${index}]`)}
													readOnly
												/>
											</div>
										</div>
										<div
											className="field"
											style={{ marginLeft: `2%`, width: `13%` }}
										>
											<label
												style={{ fontWeight: `bolder`, fontSize: `14px` }}
												className="label"
											>
												Nama Barang
											</label>
											<div className="control">
												<input
													className="input"
													type="text"
													placeholder="Nama Barang"
													{...register(`nama_barangA[${index}]`)}
													readOnly
												/>
											</div>
										</div>
										<div
											className="field"
											style={{ marginLeft: `15px`, marginTop: `30px` }}
										>
											<i
												className="icon"
												onClick={(e) => {
													e.preventDefault()
													removeatas(index)
												}}
												role="img"
											>
												<IconTrash className="svg" />
											</i>
										</div>
									</div>
								)
							})}
						</div>
						<div
							className="stepn stepn-active"
							data-step="1"
							style={{ marginTop: `2%` }}
						>
							<div>
								<div className="field" style={{}}>
									<label
										style={{ marginLeft: `53%`, fontWeight: `bolder` }}
										className="label"
									>
										Tengah
									</label>
								</div>
								<div
									className="row"
									style={{ display: `flex`, paddingTop: `1%` }}
								>
									<div className="col" style={{ width: `100%` }}>
										<label style={{ fontWeight: `bolder` }} htmlFor="no_ttb">
											No. TTB
										</label>
										<select
											{...register(`nomor_ttbtengah`)}
											//set value all field with same $index
											onChange={(e) => handleChangeMBtengah(e.target.value)}
										>
											<option value={selectednoTTBtengah}>
												{selectednoTTBtengah === undefined
													? `Silahkan Pilih No. TTB`
													: selectednoTTBtengah}
											</option>
											{filterSalesOrderA
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
									<div className="col" style={{ width: `16%` }}>
										<label
											style={{ fontWeight: `bolder`, marginLeft: `10%` }}
											htmlFor="tanggal_masuk"
										>
											Tanggal Masuk
										</label>
										<input
											style={{ marginLeft: `10%` }}
											className="input"
											type="text"
											placeholder="Tanggal Masuk"
											{...register(`tanggal_masuktengah`)}
											readOnly
										/>
									</div>
									<div
										className="field"
										style={{ marginLeft: `2%`, width: `12%` }}
									>
										<div className="control">
											<label
												style={{ fontWeight: `bolder`, marginLeft: `10%` }}
												htmlFor="Pengirim"
											>
												Pengirim
											</label>
											<input
												style={{ marginLeft: `10%` }}
												className="input"
												type="text"
												placeholder="Pengirim"
												{...register(`pengirimtengah`)}
												readOnly
											/>
										</div>
									</div>
									<div
										className="field"
										style={{ marginLeft: `1%`, width: `13%` }}
									>
										<div className="control">
											<label
												style={{ fontWeight: `bolder`, marginLeft: `10%` }}
												htmlFor="PenerimaA"
											>
												Penerima
											</label>
											<input
												style={{ marginLeft: `10%` }}
												className="input"
												type="text"
												placeholder="Penerima"
												{...register(`penerimatengah`)}
												readOnly
											/>
										</div>
									</div>
									<div
										className="field"
										style={{ marginLeft: `2%`, width: `5%` }}
									>
										<label
											style={{ fontWeight: `bolder`, marginLeft: `10%` }}
											className="label"
										>
											Koli
										</label>
										<div className="control">
											<input
												style={{ marginLeft: `10%` }}
												className="input"
												type="text"
												placeholder="Koli"
												{...register(`kolitengah`)}
												readOnly
											/>
										</div>
									</div>
									<div
										className="field"
										style={{ marginLeft: `2%`, width: `12%` }}
									>
										<label
											style={{ fontWeight: `bolder`, fontSize: `14px` }}
											className="label"
										>
											Volume M³
										</label>
										<div className="control">
											<input
												className="input"
												type="text"
												placeholder="Volume M³"
												{...register(`volumetengah`)}
												readOnly
											/>
										</div>
									</div>
									<div
										className="field"
										style={{ marginLeft: `2%`, width: `13%` }}
									>
										<label
											style={{ fontWeight: `bolder`, fontSize: `14px` }}
											className="label"
										>
											Nama Barang
										</label>
										<div className="control">
											<input
												className="input"
												type="text"
												placeholder="Nama Barang"
												{...register(`nama_barangtengah`)}
												readOnly
											/>
										</div>
									</div>
									<div
										className="field"
										style={{ marginLeft: `35px`, marginTop: `30px` }}
									>
										<i className="icon" role="img"></i>
									</div>
								</div>
							</div>
							{tengahfields.map((item, index) => {
								return (
									<div
										className="row"
										key={item.id}
										style={{ display: `flex`, paddingTop: `1%` }}
									>
										<div className="col" style={{ width: `100%` }}>
											<label style={{ fontWeight: `bolder` }} htmlFor="no_ttb">
												No. TTB
											</label>
											<select
												{...register(`nomor_ttbT[${index}]`)}
												//set value all field with same $index
												onChange={(e) => {
													handleChangeMBT(e.target.value, index)
													selectednoTTBT[index] = e.target.value
												}}
											>
												<option value={selectednoTTBT[index]}>
													{selectednoTTBT[index] === undefined
														? `Silahkan Pilih No. TTB`
														: selectednoTTBT[index]}
												</option>
												{filterSalesOrderA
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
										<div className="col" style={{ width: `16%` }}>
											<label
												style={{ fontWeight: `bolder`, marginLeft: `10%` }}
												htmlFor="tanggal_masuk"
											>
												Tanggal Masuk
											</label>
											<input
												style={{ marginLeft: `10%` }}
												className="input"
												type="text"
												placeholder="Tanggal Masuk"
												{...register(`tanggal_masukT[${index}]`)}
												readOnly
											/>
										</div>
										<div
											className="field"
											style={{ marginLeft: `2%`, width: `12%` }}
										>
											<div className="control">
												<label
													style={{ fontWeight: `bolder`, marginLeft: `10%` }}
													htmlFor="Pengirim"
												>
													Pengirim
												</label>
												<input
													style={{ marginLeft: `10%` }}
													className="input"
													type="text"
													placeholder="Pengirim"
													{...register(`pengirimT[${index}]`)}
													readOnly
												/>
											</div>
										</div>
										<div
											className="field"
											style={{ marginLeft: `1%`, width: `13%` }}
										>
											<div className="control">
												<label
													style={{ fontWeight: `bolder`, marginLeft: `10%` }}
													htmlFor="PenerimaA"
												>
													Penerima
												</label>
												<input
													style={{ marginLeft: `10%` }}
													className="input"
													type="text"
													placeholder="Penerima"
													{...register(`penerimaT[${index}]`)}
													readOnly
												/>
											</div>
										</div>
										<div
											className="field"
											style={{ marginLeft: `2%`, width: `5%` }}
										>
											<label
												style={{ fontWeight: `bolder`, marginLeft: `10%` }}
												className="label"
											>
												Koli
											</label>
											<div className="control">
												<input
													style={{ marginLeft: `10%` }}
													className="input"
													type="text"
													placeholder="Koli"
													{...register(`koliT[${index}]`)}
													readOnly
												/>
											</div>
										</div>
										<div
											className="field"
											style={{ marginLeft: `2%`, width: `12%` }}
										>
											<label
												style={{ fontWeight: `bolder`, fontSize: `14px` }}
												className="label"
											>
												Volume M³
											</label>
											<div className="control">
												<input
													className="input"
													type="text"
													placeholder="Volume M³"
													{...register(`volumeT[${index}]`)}
													readOnly
												/>
											</div>
										</div>
										<div
											className="field"
											style={{ marginLeft: `2%`, width: `13%` }}
										>
											<label
												style={{ fontWeight: `bolder`, fontSize: `14px` }}
												className="label"
											>
												Nama Barang
											</label>
											<div className="control">
												<input
													className="input"
													type="text"
													placeholder="Nama Barang"
													{...register(`nama_barangT[${index}]`)}
													readOnly
												/>
											</div>
										</div>
										<div
											className="field"
											style={{ marginLeft: `15px`, marginTop: `30px` }}
										>
											<i
												className="icon"
												onClick={(e) => {
													e.preventDefault()
													removetengah(index)
												}}
												role="img"
											>
												<IconTrash className="svg" />
											</i>
										</div>
									</div>
								)
							})}
						</div>
						<div
							className="stepn stepn-active"
							data-step="1"
							style={{ marginTop: `2%` }}
						>
							<div>
								<div className="field" style={{}}>
									<label
										style={{ marginLeft: `50%`, fontWeight: `bolder` }}
										className="label"
									>
										Belakang (Pintu)
									</label>
								</div>
								<div
									className="row"
									style={{ display: `flex`, paddingTop: `1%` }}
								>
									<div className="col" style={{ width: `100%` }}>
										<label style={{ fontWeight: `bolder` }} htmlFor="no_ttb">
											No. TTB
										</label>
										<select
											{...register(`nomor_ttbbawah`)}
											//set value all field with same $index
											onChange={(e) => handleChangeMBbawah(e.target.value)}
										>
											<option value={selectednoTTBbawah}>
												{selectednoTTBbawah === undefined
													? `Silahkan Pilih No. TTB`
													: selectednoTTBbawah}
											</option>
											{filterSalesOrderA
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
									<div className="col" style={{ width: `16%` }}>
										<label
											style={{ fontWeight: `bolder`, marginLeft: `10%` }}
											htmlFor="tanggal_masuk"
										>
											Tanggal Masuk
										</label>
										<input
											style={{ marginLeft: `10%` }}
											className="input"
											type="text"
											placeholder="Tanggal Masuk"
											{...register(`tanggal_masukbawah`)}
											readOnly
										/>
									</div>
									<div
										className="field"
										style={{ marginLeft: `2%`, width: `12%` }}
									>
										<div className="control">
											<label
												style={{ fontWeight: `bolder`, marginLeft: `10%` }}
												htmlFor="Pengirim"
											>
												Pengirim
											</label>
											<input
												style={{ marginLeft: `10%` }}
												className="input"
												type="text"
												placeholder="Pengirim"
												{...register(`pengirimbawah`)}
												readOnly
											/>
										</div>
									</div>
									<div
										className="field"
										style={{ marginLeft: `1%`, width: `13%` }}
									>
										<div className="control">
											<label
												style={{ fontWeight: `bolder`, marginLeft: `10%` }}
												htmlFor="PenerimaA"
											>
												Penerima
											</label>
											<input
												style={{ marginLeft: `10%` }}
												className="input"
												type="text"
												placeholder="Penerima"
												{...register(`penerimabawah`)}
												readOnly
											/>
										</div>
									</div>
									<div
										className="field"
										style={{ marginLeft: `2%`, width: `5%` }}
									>
										<label
											style={{ fontWeight: `bolder`, marginLeft: `10%` }}
											className="label"
										>
											Koli
										</label>
										<div className="control">
											<input
												style={{ marginLeft: `10%` }}
												className="input"
												type="text"
												placeholder="Koli"
												{...register(`kolibawah`)}
												readOnly
											/>
										</div>
									</div>
									<div
										className="field"
										style={{ marginLeft: `2%`, width: `12%` }}
									>
										<label
											style={{ fontWeight: `bolder`, fontSize: `14px` }}
											className="label"
										>
											Volume M³
										</label>
										<div className="control">
											<input
												className="input"
												type="text"
												placeholder="Volume M³"
												{...register(`volumebawah`)}
												readOnly
											/>
										</div>
									</div>
									<div
										className="field"
										style={{ marginLeft: `2%`, width: `13%` }}
									>
										<label
											style={{ fontWeight: `bolder`, fontSize: `14px` }}
											className="label"
										>
											Nama Barang
										</label>
										<div className="control">
											<input
												className="input"
												type="text"
												placeholder="Nama Barang"
												{...register(`nama_barangbawah`)}
												readOnly
											/>
										</div>
									</div>
									<div
										className="field"
										style={{ marginLeft: `35px`, marginTop: `30px` }}
									>
										<i className="icon" role="img"></i>
									</div>
								</div>
							</div>
							{bawahfields.map((item, index) => {
								return (
									<div
										className="row"
										key={item.id}
										style={{ display: `flex`, paddingTop: `1%` }}
									>
										<div className="col" style={{ width: `100%` }}>
											<label style={{ fontWeight: `bolder` }} htmlFor="no_ttb">
												No. TTB
											</label>
											<select
												{...register(`nomor_ttbB[${index}]`)}
												onChange={(e) => {
													handleChangeMBB(e.target.value, index)
													selectednoTTBB[index] = e.target.value
												}}
											>
												<option value={selectednoTTBB[index]}>
													{selectednoTTBB[index] === undefined
														? `Silahkan Pilih No. TTB`
														: selectednoTTBB[index]}
												</option>
												{filterSalesOrderA
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
										<div className="col" style={{ width: `16%` }}>
											<label
												style={{ fontWeight: `bolder`, marginLeft: `10%` }}
												htmlFor="tanggal_masuk"
											>
												Tanggal Masuk
											</label>
											<input
												style={{ marginLeft: `10%` }}
												className="input"
												type="text"
												placeholder="Tanggal Masuk"
												{...register(`tanggal_masukB[${index}]`)}
												readOnly
											/>
										</div>
										<div
											className="field"
											style={{ marginLeft: `2%`, width: `12%` }}
										>
											<div className="control">
												<label
													style={{ fontWeight: `bolder`, marginLeft: `10%` }}
													htmlFor="Pengirim"
												>
													Pengirim
												</label>
												<input
													style={{ marginLeft: `10%` }}
													className="input"
													type="text"
													placeholder="Pengirim"
													{...register(`pengirimB[${index}]`)}
													readOnly
												/>
											</div>
										</div>
										<div
											className="field"
											style={{ marginLeft: `1%`, width: `13%` }}
										>
											<div className="control">
												<label
													style={{ fontWeight: `bolder`, marginLeft: `10%` }}
													htmlFor="PenerimaA"
												>
													Penerima
												</label>
												<input
													style={{ marginLeft: `10%` }}
													className="input"
													type="text"
													placeholder="Penerima"
													{...register(`penerimaB[${index}]`)}
													readOnly
												/>
											</div>
										</div>
										<div
											className="field"
											style={{ marginLeft: `2%`, width: `5%` }}
										>
											<label
												style={{ fontWeight: `bolder`, marginLeft: `10%` }}
												className="label"
											>
												Koli
											</label>
											<div className="control">
												<input
													style={{ marginLeft: `10%` }}
													className="input"
													type="text"
													placeholder="Koli"
													{...register(`koliB[${index}]`)}
													readOnly
												/>
											</div>
										</div>
										<div
											className="field"
											style={{ marginLeft: `2%`, width: `12%` }}
										>
											<label
												style={{ fontWeight: `bolder`, fontSize: `14px` }}
												className="label"
											>
												Volume M³
											</label>
											<div className="control">
												<input
													className="input"
													type="text"
													placeholder="Volume M³"
													{...register(`volumeB[${index}]`)}
													readOnly
												/>
											</div>
										</div>
										<div
											className="field"
											style={{ marginLeft: `2%`, width: `13%` }}
										>
											<label
												style={{ fontWeight: `bolder`, fontSize: `14px` }}
												className="label"
											>
												Nama Barang
											</label>
											<div className="control">
												<input
													className="input"
													type="text"
													placeholder="Nama Barang"
													{...register(`nama_barangB[${index}]`)}
													readOnly
												/>
											</div>
										</div>
										<div
											className="field"
											style={{ marginLeft: `15px`, marginTop: `30px` }}
										>
											<i
												className="icon"
												onClick={(e) => {
													e.preventDefault()
													removebawah(index)
												}}
												role="img"
											>
												<IconTrash className="svg" />
											</i>
										</div>
									</div>
								)
							})}
						</div>
						<div
							className="field"
							style={{
								display: `inline-block`,
								width: `calc(50% - 8px)`,
								marginTop: `2%`
							}}
						>
							<label style={{ fontWeight: `bolder` }} className="label">
								Tanggal Muat Barang
							</label>
							<div className="control">
								<Controller
									control={control}
									name="tanggal_mb"
									rules={{ required: true }}
									render={({ field }) => (
										<DatePicker
											{...field}
											style={{ width: `100%`, height: `38px` }}
											placeholder="Tanggal Input Muat Barang"
											onChange={(date) => field.onChange(date)}
											format="DD-MM-YYYY"
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
								style={{
									fontWeight: `bolder`,
									marginTop: `30%`,
									marginLeft: `10px`
								}}
								className="label"
							>
								Nama Kapal
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
									placeholder="Nama Kapal"
									{...register(`nama_kapal`)}
								/>
							</div>
						</div>
						<div
							className="field"
							style={{
								display: `inline-block`,
								width: `calc(50% - 8px)`,
								marginTop: `2%`
							}}
						>
							<label
								style={{ fontWeight: `bolder`, marginTop: `30%` }}
								className="label"
							>
								No. Kendaraan
							</label>
							<div className="control">
								<select
									style={{
										display: `inline-block`,
										width: `100%`
									}}
									className="input"
									placeholder="Nomor kendaraan"
									{...register(`nomor_kendaraan`)}
									required
								>
									<option value="">Pilih Nomor Kendaraan</option>
									{dataMobil?.vechnicle.map((item, index) => {
										return (
											<option key={index} value={item.nomor_kendaraan}>
												{item.nomor_kendaraan}
											</option>
										)
									})}
								</select>
							</div>
						</div>

						<div
							className="field"
							style={{ display: `inline-block`, width: `calc(50% - 8px)` }}
						>
							<label
								style={{
									fontWeight: `bolder`,
									marginTop: `30%`,
									marginLeft: `10px`
								}}
								className="label"
							>
								Vendor Pelayaran
							</label>
							<div className="control">
								<select
									style={{
										display: `inline-block`,
										width: `calc(120% - 8px)`,
										margin: `0 8px`
									}}
									className="input"
									placeholder="Vendor pelayaNan"
									{...register(`vendor_pelayanan`)}
									required
								>
									<option value="">Pilih Vendor Pelayaran</option>
									{dataVendor?.vendor.map((item, index) => {
										return (
											<option key={index} value={item.nama_vendor}>
												{item.nama_vendor}
											</option>
										)
									})}
								</select>
							</div>
						</div>
						<div
							className="field"
							style={{
								display: `inline-block`,
								width: `calc(50% - 8px)`,
								marginTop: `2%`
							}}
						>
							<label
								style={{ fontWeight: `bolder`, marginTop: `30%` }}
								className="label"
							>
								No. Container
							</label>
							<div className="control">
								<input
									style={{ width: `100%` }}
									className="input"
									type="text"
									placeholder="nomor container"
									{...register(`nomor_container`)}
									required
								/>
							</div>
						</div>
						<div
							className="field"
							style={{ display: `inline-block`, width: `calc(50% - 8px)` }}
						>
							<label
								style={{
									fontWeight: `bolder`,
									marginTop: `30%`,
									marginLeft: `10px`
								}}
								className="label"
							>
								Nomor Seal
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
									placeholder="Nomor seal"
									{...register(`nomor_seal`)}
									required
								/>
							</div>
						</div>
						<div className="field" style={{ marginTop: `2%` }}>
							<label style={{ fontWeight: `bolder` }} className="label">
								Tanggal Estimasi
							</label>
							<div className="control">
								<Controller
									control={control}
									name="estimasi_date"
									rules={{ required: true }}
									render={({ field }) => (
										<DatePicker
											{...field}
											style={{ width: `100%`, height: `38px` }}
											placeholder="Tanggal Estimasi"
											onChange={(date) => field.onChange(date)}
											format="DD-MM-YYYY"
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
