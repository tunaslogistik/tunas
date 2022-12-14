import { gql, useQuery } from "@apollo/client"
import AdminPage from "@components/admin/AdminPage.component"
import Dashboard from "@components/dashboard/Dashboard.component"
import { Table } from "antd"

import { ColumnsType } from "antd/lib/table"
import { GET_DAFTAR_MUAT_BARANG } from "graphql/daftar_muat_barang/queries"
import moment from "moment"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { GET_DAFTAR_TUJUAN } from "../../../../graphql/daftar_tujuan/queries"

//get DATA

const GET_DATA = gql`
	query daftar_packing_list {
		daftar_packing_list {
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

interface DataType {
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
	const { data, loading } = useQuery(GET_DATA)

	//GET DAFTAR TUJUAN
	const { data: dataTujuan } = useQuery(GET_DAFTAR_TUJUAN)
	//GET DAFTAR MUAT BARANG
	const { data: dataMuatBarang } = useQuery(GET_DAFTAR_MUAT_BARANG)

	const setForm = useForm()

	//search
	const [search, setSearch] = useState(``)
	const handleSearch = (e) => {
		setSearch(e.target.value)
	}
	//make filtered data
	const filteredData = data?.daftar_packing_list.filter((item) => {
		return (
			item.nomor_muat_barang.toLowerCase().includes(search.toLowerCase()) ||
			item.kota_tujuan.toLowerCase().includes(search.toLowerCase())
		)
	})
	//make antd table with search
	const columns: ColumnsType<DataType> = [
		{
			title: `No. Muat Barang`,
			dataIndex: `nomor_muat_barang`,
			key: `nomor_muat_barang`,
			width: `20%`,
			sorter: (a, b) => a.nomor_muat_barang.localeCompare(b.nomor_muat_barang),
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
		// {
		// 	title: `Nama Kapal`,
		// 	dataIndex: `nama_kapal`,
		// 	key: `nama_kapal`,
		// 	width: `20%`,
		// 	sortDirections: [`descend`, `ascend`]
		// },
		{
			title: `Kota Tujuan`,
			dataIndex: `kota_tujuan`,
			key: `kota_tujuan`,
			width: `15%`,
			sorter: (a, b) => a.kota_tujuan.localeCompare(b.kota_tujuan),
			sortDirections: [`descend`, `ascend`]
		},
		{
			title: `Volume M??`,
			dataIndex: `total_volume`,
			key: `total_volume`,
			width: `15%`,
			sorter: (a, b) => a.total_volume.localeCompare(b.total_volume),
			sortDirections: [`descend`, `ascend`]
		},
		{
			title: `Koli`,
			dataIndex: `total_koli`,
			key: `total_koli`,
			width: `15%`,
			sorter: (a, b) => a.total_koli.localeCompare(b.total_koli),
			sortDirections: [`descend`, `ascend`]
		},
		{
			title: `Tanggal Pengiriman`,
			dataIndex: `tanggal_keberangkatan`,
			align: `center`,
			width: `25%`,
			sortDirections: [`descend`, `ascend`]
		},
		{
			title: `Action`,
			key: `action`,
			render: (text, record) => (
				<span>
					<a
						onClick={() => {
							window.open(
								`/pengiriman/daftar-packing-list/print/${record.id}`,
								`_blank`
							)
						}}
					>
						Print
					</a>
				</span>
			)
		}
	]

	const dataTable = filteredData?.map((item) => {
		return {
			id: item.id,
			nomor_ttb: item.nomor_ttb,
			nomor_muat_barang: item.nomor_muat_barang,
			nomor_container: item.nomor_container,
			nomor_seal: item.nomor_seal,
			nomor_kendaraan: item.nomor_kendaraan,
			kota_tujuan: dataTujuan?.daftar_tujuan.find(
				(item2) => item2.kode_tujuan === item.kota_tujuan
			)?.nama_tujuan,
			total_volume: item.total_volume,
			total_koli: item.total_koli,
			//find nama kapal from sales order
			nama_kapal: dataMuatBarang?.daftar_muat_barang.find(
				(item2) => item2.nomor_ttb === item.nomor_ttb
			)?.nama_kapal,
			tanggal_keberangkatan: moment(
				dataMuatBarang?.daftar_muat_barang.find(
					(item2) => item2.nomor_ttb === item.nomor_ttb
				)?.tanggal_muat_barang
			).format(`DD/MM/YYYY`)
		}
	})

	//merge duplicate data by nomor_ttb
	const mergeData = dataTable?.reduce((acc, current) => {
		const x = acc.find(
			(item) => item.nomor_muat_barang === current.nomor_muat_barang
		)
		if (!x) {
			return acc.concat([current])
		} else {
			return acc
		}
	}, [])
	const dataMap = mergeData
	const dataSource = dataMap
	return (
		<AdminPage authId="" title="Daftar Packing List" setForm={setForm}>
			<section className="section">
				<div className="admin-section">
					<div className="admin-section-header">
						<div
							className="admin-section-header-search"
							style={{ marginLeft: `80%` }}
						>
							<input
								type="text"
								placeholder="Search"
								onChange={handleSearch}
								style={{ width: `100%` }}
							/>
						</div>
					</div>
					<div
						className="relative"
						style={{ overflowX: `scroll`, marginTop: `20px` }}
					>
						<Table
							rowKey="id"
							columns={columns}
							dataSource={dataSource}
							pagination={{ pageSize: 10 }}
							loading={loading}
							scroll={{ x: `max-content` }}
						/>
					</div>
				</div>
			</section>
		</AdminPage>
	)
}

Home.getLayout = function getLayout(page) {
	return <Dashboard>{page}</Dashboard>
}
