import { gql, useQuery } from "@apollo/client"
import AdminPage from "@components/admin/AdminPage.component"
import Dashboard from "@components/dashboard/Dashboard.component"
import { Table } from "antd"
import "antd/dist/antd.css"
import { ColumnsType } from "antd/lib/table"
import { useState } from "react"
import { useForm } from "react-hook-form"
//import icon icon-car.svg
import { GET_DAFTAR_TUJUAN } from "graphql/daftar_tujuan/queries"
import { GET_VECHNICLE } from "graphql/mobil/queries"

//get DATA

const GET_DATA = gql`
	query daftar_surat_pengantar {
		daftar_surat_pengantar {
			id
			nomor_muat_barang
			nomor_surat_jalan
			nomor_ttb
			total_koli
			pengirim
			volume
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
	nomor_surat_jalan: any
	pengirim: any
	id: number
	nomor_muat_barang: string
	nomor_ttb: string
	total_ttb: string
	total_koli: string
	kota_tujuan: string
	volume: string
	total_volume: string
	nomor_kendaraan: string
	vendor_pelayanan: string
	posisi: string
	nomor_container: string
	nomor_seal: string
}

export default function Home() {
	const { data, loading, error } = useQuery(GET_DATA)

	//GET DATA MOBIL
	const { data: dataMobil } = useQuery(GET_VECHNICLE)

	//GET DAFTAR TUJUAN
	const { data: dataTujuan } = useQuery(GET_DAFTAR_TUJUAN)

	const setForm = useForm()

	//search
	const [search, setSearch] = useState(``)
	const handleSearch = (e) => {
		setSearch(e.target.value)
	}
	//make filtered data
	const filteredData = data?.daftar_surat_pengantar.filter((item) => {
		return (
			item.nomor_muat_barang.toLowerCase().includes(search.toLowerCase()) ||
			item.kota_tujuan.toLowerCase().includes(search.toLowerCase())
		)
	})
	//make antd table with search
	const columns: ColumnsType<DataType> = [
		{
			title: `No. Surat Pengantar`,
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
			title: `Nomor Kendaraan`,
			dataIndex: `nomor_kendaraan`,
			key: `nomor_kendaraan`,
			width: `20%`,
			sortDirections: [`descend`, `ascend`]
		},
		{
			title: `Nama Supir`,
			dataIndex: `nama_supir`,
			key: `nama_supir`,
			width: `20%`,
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
			title: `Container/seal`,
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
			title: `Volume m3`,
			dataIndex: `volume`,
			key: `total_volume`,
			width: `20%`,
			sorter: (a, b) => a.total_volume.localeCompare(b.total_volume),
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
								`/pengiriman/daftar-surat-pengantar/print/${record.id}`,
								`_blank`
							)
						}}
						style={{ marginRight: `10px` }}
					>
						Print
					</a>
				</span>
			)
		}
	]

	//DATA FOr table with date moment
	const dataTable = filteredData?.map((item) => {
		return {
			id: item.id,
			pengirim: item.pengirim,
			nomor_ttb: item.nomor_ttb,
			nomor_surat_jalan: item.nomor_surat_jalan,
			nomor_muat_barang: item.nomor_muat_barang,
			nomor_container: item.nomor_container,
			nomor_seal: item.nomor_seal,
			nomor_kendaraan: item.nomor_kendaraan,
			nama_supir: dataMobil?.vechnicle.find(
				(mobil) => mobil.nomor_kendaraan === item.nomor_kendaraan
			)?.nama_supir,
			kota_tujuan: dataTujuan?.daftar_tujuan.find(
				(item2) => item2.kode_tujuan === item.kota_tujuan
			)?.nama_tujuan,
			volume: item.volume,
			total_koli: item.total_koli,
			vendor_pelayanan: item.vendor_pelayanan,
			total_ttb: item.total_ttb
		}
	})

	//merge duplicate data nomor ttb
	const mergeData = dataTable?.reduce((acc, current) => {
		const x = acc.find(
			(item) => item.nomor_surat_jalan === current.nomor_surat_jalan
		)
		if (!x) {
			return acc.concat([current])
		} else {
			return acc
		}
	}, [])
	const dataMap = mergeData
	const dataSource = dataMap
	console.log(`data`, dataSource)
	return (
		<AdminPage
			authId="daftar-surat-pengantar"
			title="Daftar Surat Pengantar"
			setForm={setForm}
		>
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
