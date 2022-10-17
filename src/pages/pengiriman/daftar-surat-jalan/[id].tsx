import { gql, useMutation, useQuery } from "@apollo/client"
import IconPrint from "@assets/icons/icon-print.svg"
import AdminPage from "@components/admin/AdminPage.component"
import Dashboard from "@components/dashboard/Dashboard.component"
import Access from "@components/util/Access.component"
import useLoading from "@hooks/useLoading.hook"
import { Button, message, Table } from "antd"
import "antd/dist/antd.css"
import { ColumnsType } from "antd/lib/table"
import { GET_CUSTOMER } from "graphql/customer/queries"
import { GET_DAFTAR_SALES_ORDER } from "graphql/daftar_sales_order/queries"
import { UPDATE_DAFTAR_SURAT_JALAN } from "graphql/daftar_surat_jalan/mutations"
import { GET_DAFTAR_TTB } from "graphql/daftar_ttb/queries"
import moment from "moment"
import Link from "next/link"
import router from "next/router"
import { useState } from "react"
import { useForm } from "react-hook-form"
//import icon icon-car.svg

//get DATA

const GET_DATA = gql`
	query daftar_surat_jalan {
		daftar_surat_jalan {
			id
			nomor_surat_jalan
			nomor_ttb
			volume
			koli
			total_volume
			total_koli
			vendor_pelayanan
			nama_kapal
			tanggal_surat_jalan
			tanggal_keberangkatan
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

	const [updateDaftar_surat_jalan] = useMutation(UPDATE_DAFTAR_SURAT_JALAN, {
		refetchQueries: [{ query: GET_DATA }]
	})

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
			item.nomor_surat_jalan.toLowerCase().includes(search.toLowerCase()) ||
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

	const filteredDatasurat = data?.daftar_surat_jalan.filter(
		(item) =>
			item.nomor_surat_jalan === filteredDataById?.[0]?.nomor_surat_jalan
	)
	console.log(`filteredDatasurat`, filteredDatasurat)
	//merge duplicate data by nomor_ttb
	const mergeData = filteredDatasurat?.reduce((acc, current) => {
		const x = acc.find(
			(item) => item.nomor_surat_jalan === current.nomor_surat_jalan
		)
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
			id: item.id,
			nomor_ttb: item.nomor_ttb,
			nomor_surat_jalan: item.nomor_surat_jalan,
			nomor_container: item.nomor_container,
			nomor_seal: item.nomor_seal,
			tanggal_keberangkatan: moment(item.tanggal_keberangkatan).format(
				`DD MMMM YYYY`
			),
			tanggal_surat_jalan: moment(item.tanggal_surat_jalan).format(
				`DD MMMM YYYY`
			),
			alamat_penerima: filteredDataTtb?.[0]?.alamat_tujuan,
			penerima: filteredDataTtb?.[0]?.nama_penerima,
			vendor_pelayanan: item.vendor_pelayanan,
			pengirim: filteredDataTtb?.[0]?.pengirim,
			alamat_pengirim: alamatCustomer?.[0]?.alamat,
			volume: item.total_volume,
			nama_kapal: item.nama_kapal,
			koli: item.total_koli,
			total_koli: item.total_koli,
			kota_tujuan: filteredDataTtb?.[0]?.kota_tujuan,
			total_volume: item.total_volume,
			keterangan: item.keterangan
		}
	})

	console.log(`mapData`, mapData)

	//make antd table with search
	const columns: ColumnsType<DataType> = [
		{
			title: `No. Surat Jalan`,
			dataIndex: `nomor_surat_jalan`,
			key: `nomor_surat_jalan`,
			width: `20%`,
			sorter: (a, b) => a.nomor_surat_jalan.localeCompare(b.nomor_surat_jalan),
			sortDirections: [`descend`, `ascend`]
		},
		{
			title: `No. TTB`,
			dataIndex: `nomor_ttb`,
			key: `nomor_ttb`,
			width: `20%`,
			sorter: (a, b) => a.nomor_ttb.localeCompare(b.nomor_ttb),
			sortDirections: [`descend`, `ascend`]
		},
		{
			title: `Pengirim`,
			dataIndex: `pengirim`,
			key: `pengirim`,
			width: `20%`,
			sorter: (a, b) => a.pengirim.localeCompare(b.pengirim),
			sortDirections: [`descend`, `ascend`]
		},
		{
			title: `Kota Tujuan`,
			dataIndex: `kota_tujuan`,
			key: `kota_tujuan`,
			width: `20%`,
			sorter: (a, b) => a.kota_tujuan.localeCompare(b.kota_tujuan),
			sortDirections: [`descend`, `ascend`]
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
			title: `Volume M³`,
			dataIndex: `total_volume`,
			key: `total_volume`,
			width: `20%`,
			sorter: (a, b) => a.total_volume.localeCompare(b.total_volume),
			sortDirections: [`descend`, `ascend`]
		}
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

	//get id surat jalan
	const filteredDataIdSurat = filteredDatasurat?.map((item) => {
		return {
			id: item.id
		}
	})

	async function onSubmit(formData) {
		setLoading(true)
		try {
			if (formData.keterangan === ``) {
				formData.keterangan = filteredDatasurat?.[0].keterangan
			}

			//map formdata to data map
			const dataTemp = filteredDatasurat?.map((item) => {
				return {
					id: item.id,
					nomor_surat_jalan: item.nomor_surat_jalan,
					nomor_container: item.nomor_container,
					nomor_seal: item.nomor_seal,
					nomor_ttb: item.nomor_ttb,
					koli: item.koli,
					volume: item.volume,
					nama_kapal: formData.nama_kapal,
					total_volume: item.total_volume,
					total_koli: item.total_koli,
					tanggal_keberangkatan: formData.tanggal_keberangkatan,
					tanggal_surat_jalan: formData.tanggal_surat_jalan,
					keterangan: formData.keterangan
				}
			})
			console.log(`dataTemp`, dataTemp)
			//make loop update for data table
			for (let i = 0; i < dataTemp.length; i++) {
				await updateData(dataTemp[i])
			}

			message.success(`Data Berhasil Disimpan`)
		} catch (error) {
			console.log(error)
		}
		setLoading(false)
	}
	const date = moment(mapData?.[0]?.tanggal_keberangkatan).format(`YYYY-MM-DD`)
	const date_surat_jalan = moment(mapData?.[0]?.tanggal_surat_jalan).format(
		`YYYY-MM-DD`
	)
	return (
		<AdminPage
			parent={
				<Link href="/pengiriman/daftar-surat-jalan">
					<a>Daftar Surat Jalan</a>
				</Link>
			}
			authId=""
			title="Edit Surat Jalan"
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
											`/pengiriman/daftar-surat-jalan/print/${id}`,
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
									form="formSJ"
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
				<form className="form" id="formSJ" onSubmit={handleSubmit(onSubmit)}>
					<div className="form-group">
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
							<div
								className="field"
								style={{
									display: `inline-block`,
									width: `calc(50% - 8px)`,
									marginTop: `1%`
								}}
							>
								<label
									style={{ fontWeight: `bolder`, marginTop: `30%` }}
									className="label"
								>
									Tanggal Surat Jalan
								</label>
								<div className="control">
									<input
										style={{
											width: `100%`,
											marginTop: `4px`
										}}
										className="input"
										type="date"
										defaultValue={date_surat_jalan}
										placeholder="Tanggal Surat Jalan"
										{...register(`tanggal_surat_jalan`)}
										required
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
										placeholder="nomor container"
										defaultValue={mapData?.[0]?.nama_kapal}
										{...register(`nama_kapal`)}
										required
									/>
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
									Vendor Pelayaran
								</label>
								<div className="control">
									<input
										style={{ width: `100%`, marginTop: `4px` }}
										className="input"
										type="text"
										placeholder="Vendor Pelayaran"
										value={mapData?.[0]?.vendor_pelayanan}
										{...register(`vendor_pelayaran`)}
										required
										disabled
									/>
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
								<label
									style={{ fontWeight: `bolder`, marginTop: `30%` }}
									className="label"
								>
									Tanggal Keberangkatan
								</label>
								<div className="control">
									<input
										style={{
											width: `100%`,
											marginTop: `4px`
										}}
										className="input"
										type="date"
										defaultValue={date}
										placeholder="Tanggal Keberangkatan"
										{...register(`tanggal_keberangkatan`)}
										required
									/>
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
									No. Container
								</label>
								<div className="control">
									<input
										style={{ width: `100%` }}
										className="input"
										type="text"
										placeholder="nomor container"
										value={mapData?.[0]?.nomor_container}
										{...register(`nomor_container`)}
										required
										disabled
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
										placeholder="nomor container"
										defaultValue={mapData?.[0]?.nomor_seal}
										{...register(`nomor_seal`)}
										required
										disabled
									/>
								</div>
							</div>
							<div>
								<div
									className="form-group"
									style={{ width: `100%`, marginTop: `20px` }}
								>
									<label style={{ fontWeight: `bolder` }} className="label">
										Keterangan
									</label>
									<textarea
										style={{ width: `100%` }}
										defaultValue={mapData?.[0]?.keterangan}
										id="keterangan"
										{...register(`keterangan`)}
									/>
								</div>
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
