import { gql, useMutation, useQuery } from "@apollo/client"
import IconPrint from "@assets/icons/icon-print.svg"
import AdminPage from "@components/admin/AdminPage.component"
import Dashboard from "@components/dashboard/Dashboard.component"
import Access from "@components/util/Access.component"
import useLoading from "@hooks/useLoading.hook"
import { message, Table } from "antd"
import "antd/dist/antd.css"
import { ColumnsType } from "antd/lib/table"
import { GET_CUSTOMER } from "graphql/customer/queries"
import { GET_DAFTAR_SALES_ORDER } from "graphql/daftar_sales_order/queries"
import { UPDATE_DAFTAR_SURAT_PENGANTAR } from "graphql/daftar_surat_pengantar/mutations"
import { GET_DAFTAR_TTB } from "graphql/daftar_ttb/queries"
import moment from "moment"
import Link from "next/link"
import router from "next/router"
import { useState } from "react"
import { useForm } from "react-hook-form"
//import icon icon-car.svg

//get DATA

const GET_DATA = gql`
	query daftar_surat_pengantar {
		daftar_surat_pengantar {
			id
			nomor_muat_barang
			nomor_surat_jalan
			nomor_ttb
			total_ttb
			total_koli
			pengirim
			kota_tujuan
			total_volume
			nomor_kendaraan
			vendor_pelayanan
			posisi
			nomor_container
			nomor_seal
			keterangan
		}
	}
`

interface DataType {
	enabled: any
	koli: any
	nama_barang: any
	alamat_penerima: any
	penerima: any
	tanggal_pengiriman: any
	nama_kapal: any
	nomor_surat_jalan: any
	pengirim: any
	id: number
	nomor_muat_barang: string
	nomor_ttb: string
	total_ttb: string
	total_koli: string
	kota_tujuan: string
	total_volume: string
	nomor_kendaraan: string
	vendor_pelayanan: string
	posisi: string
	nomor_container: string
	nomor_seal: string
}

export default function Home() {
	const { setLoading } = useLoading()
	//define id
	const id = router.query.id

	const { data, loading, error } = useQuery(GET_DATA)

	//get data ttb
	const { data: dataTtb } = useQuery(GET_DAFTAR_TTB)

	//get data sales order
	const { data: dataSalesOrder } = useQuery(GET_DAFTAR_SALES_ORDER)

	//get data customer
	const { data: dataCustomer } = useQuery(GET_CUSTOMER)
	const setForm = useForm()
	const {
		control,
		reset,
		handleSubmit,
		register,
		formState: { isDirty, errors }
	} = setForm

	const [updateDaftar_surat_jalan] = useMutation(
		UPDATE_DAFTAR_SURAT_PENGANTAR,
		{
			refetchQueries: [{ query: GET_DATA }]
		}
	)

	const updateData = (data) => {
		updateDaftar_surat_jalan({ variables: { input: data } })
	}

	//search
	const [search, setSearch] = useState(``)
	const handleSearch = (e) => {
		setSearch(e.target.value)
	}

	//make filtered data
	const filteredData = data?.daftar_surat_jalan.filter((item) => {
		return (
			item.nomor_muat_barang.toLowerCase().includes(search.toLowerCase()) ||
			item.kota_tujuan.toLowerCase().includes(search.toLowerCase())
		)
	})

	// {
	// 	title: `Action`,
	// 	key: `action`,
	// 	render: (text, record) => (
	// 		<span>
	// 			<a
	// 				href={`/order/daftar-sales-order/${record.id}`}
	// 				style={{ marginRight: `10px` }}
	// 			>
	// 				Edit
	// 			</a>
	// 			<Popconfirm
	// 				title="Are you sure delete this task?"
	// 				onConfirm={() => deleteData(record.id)}
	// 			>
	// 				<a>Delete</a>
	// 			</Popconfirm>
	// 		</span>
	// 	)
	// }

	//DATA FOr table with date momen

	//filter data table by id
	const filteredDataById = data?.daftar_surat_jalan?.filter((item) => {
		return item.id === parseInt(id as string)
	})

	//ttb

	//filter sales order by filtereddatabyid nomor_ttb
	const filteredSalesOrder = dataSalesOrder?.daftar_sales_order?.filter(
		(item) => {
			return item.nomor_ttb === filteredDataById?.[0]?.nomor_ttb
		}
	)

	//merge duplicate data by nomor_ttb
	const mergeData = filteredDataById?.reduce((acc, current) => {
		const x = acc.find((item) => item.nomor_ttb === current.ttb)
		if (!x) {
			return acc.concat([current])
		} else {
			return acc
		}
	}, [])

	//get alamat customer by mergedata pengirim
	const alamatCustomer = dataCustomer?.customer?.filter((item) => {
		return item.nama_customer === mergeData?.[0]?.pengirim
	})

	//map data
	const filteredDataTtb = dataTtb?.daftar_ttb?.filter((item) => {
		return item.ttb_number === filteredDataById?.[0]?.nomor_ttb
	})
	const mapData = mergeData?.map((item) => {
		return {
			key: item.id,
			nomor_ttb: item.nomor_ttb,
			nama_kapal: filteredSalesOrder?.[0]?.nama_kapal,
			nomor_surat_jalan: item.nomor_surat_jalan,
			nomor_container: item.nomor_container,
			nomor_seal: item.nomor_seal,
			tanggal_keberangkatan: moment(item.tanggal_keberangkatan).format(
				`DD MMMM YYYY`
			),
			alamat_penerima: filteredDataTtb?.[0]?.alamat_tujuan,
			penerima: filteredDataTtb?.[0]?.nama_penerima,
			vendor_pelayanan: item.vendor_pelayanan,
			pengirim: item.pengirim,
			alamat_pengirim: alamatCustomer?.[0]?.alamat,
			kota_tujuan: item.kota_tujuan,
			total_volume: item.total_volume,
			keterangan: item.keterangan
		}
	})

	//make antd table with search
	const columns: ColumnsType<DataType> = [
		{
			title: `Pengirim`,
			//pengirim dan alamat pengirim
			dataIndex: [`pengirim`, `alamat`],
			key: `pengirim`,
			width: `20%`,
			sorter: (a, b) => a.pengirim.localeCompare(b.pengirim),
			sortDirections: [`descend`, `ascend`],
			render: (text, record) => (
				<span>
					{record.pengirim} <br></br> {record.alamat_penerima}
				</span>
			)
		},
		{
			title: `Container/Seal`,
			dataIndex: [`nomor_container`, `nomor_seal`],
			key: `nomor_container`,
			width: `20%`,
			align: `center`,
			sorter: (a, b) => a.nomor_container.localeCompare(b.nomor_container),
			sortDirections: [`descend`, `ascend`],
			render: (text, record) => (
				<span>
					{record.nomor_container} <br></br> {record.nomor_seal}
				</span>
			)
		},
		{
			title: `Nama Kapal`,
			dataIndex: `nama_kapal`,
			key: `nama_kapal`,
			width: `20%`,
			sorter: (a, b) => a.nama_kapal.localeCompare(b.nama_kapal),
			sortDirections: [`descend`, `ascend`]
		},
		{
			title: `Tanggal Pengiriman`,
			dataIndex: `tanggal_keberangkatan`,
			key: `tanggal_pengiriman`,
			width: `20%`,
			sorter: (a, b) =>
				a.tanggal_pengiriman.localeCompare(b.tanggal_pengiriman),
			sortDirections: [`descend`, `ascend`]
		},
		{
			title: `Penerima/Alamat`,
			dataIndex: [`penerima`, `alamat_penerima`],
			key: `penerima`,
			width: `20%`,
			align: `center`,
			sorter: (a, b) => a.penerima.localeCompare(b.penerima),
			sortDirections: [`descend`, `ascend`],
			render: (text, record) => (
				<span>
					{record.penerima} <br></br> {record.alamat_penerima}
				</span>
			)
		}
	]
	//filteredDataTtb map
	const mapDataTtb = filteredDataTtb?.map((item) => {
		return {
			key: item.id,
			nama_barang: item.nama_barang,
			nomor_ttb: item.ttb_number,
			koli: item.koli
		}
	})

	const columns2: ColumnsType<DataType> = [
		{
			title: `nama_barang`,
			dataIndex: `nama_barang`,
			key: `nama_barang`,
			width: `20%`,
			sortDirections: [`descend`, `ascend`]
		},
		{
			title: `No. TTB`,
			dataIndex: `nomor_ttb`,
			key: `nomor_ttb`,
			width: `20%`,
			sortDirections: [`descend`, `ascend`]
		},
		{
			title: `koli`,
			dataIndex: `koli`,
			key: `koli`,
			width: `20%`,
			sortDirections: [`descend`, `ascend`]
		}
	]

	const dataMap = mapData
	const dataSource = dataMap
	console.log(`data`, dataSource)

	async function onSubmit(formData) {
		setLoading(true)
		try {
			if (formData.keterangan === ``) {
				formData.keterangan = dataSource?.[0].vendor_pelayanan
			}

			//map formdata to data map
			const dataTemp = mapData?.map((item) => {
				return {
					id: parseInt(id as string),
					keterangan: formData.keterangan
				}
			})

			//make loop update for data table
			for (let i = 0; i < dataTemp.length; i++) {
				await updateData(dataTemp[i])
			}

			console.log(`dataFilterTTB`, formData)

			message.success(`Data Berhasil Disimpan`)
		} catch (error) {
			console.log(error)
		}
		setLoading(false)
	}
	//daftar surat jalan remove first 4 letter
	const nomor_surat_jalan = dataSource?.[0]?.nomor_surat_jalan.slice(4)
	//add 4 letter to nomor_surat_jalan
	const nomor_surat_jalan2 = `SP-${nomor_surat_jalan}`
	return (
		<AdminPage
			parent={
				<Link href="/pengiriman/daftar-surat-pengantar">
					<a>Daftar Surat Pengantar</a>
				</Link>
			}
			authId=""
			title="Edit Surat Pengantar"
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
											`/pengiriman/daftar-surat-pengantar/print/${id}`,
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
						</ul>
					}
				/>
			}
		>
			<section className="section">
				<form className="form" onSubmit={handleSubmit(onSubmit)}>
					<div className="form-group" style={{ paddingTop: `5%` }}>
						<div className="admin-section">
							<div className="relative" style={{ overflowX: `scroll` }}>
								<Table
									rowKey="id"
									columns={columns}
									dataSource={dataSource}
									pagination={false}
									loading={loading}
									scroll={{ x: `max-content` }}
								/>
							</div>
							<div style={{ width: `75%`, marginTop: `25px` }}>
								<Table
									rowKey="id"
									rowClassName={(record) => !record.enabled && `disabled-row`}
									columns={columns2}
									dataSource={mapDataTtb}
									pagination={false}
									loading={loading}
									scroll={{ x: `max-content` }}
								/>
							</div>
						</div>
					</div>
				</form>
			</section>
		</AdminPage>
	)
}

Home.getLayout = function getLayout(page) {
	return <Dashboard>{page}</Dashboard>
}
