import { gql, useQuery } from "@apollo/client"
import AdminPage from "@components/admin/AdminPage.component"
import Dashboard from "@components/dashboard/Dashboard.component"
import { Table } from "antd"
import "antd/dist/antd.css"
import { ColumnsType } from "antd/lib/table"
import { useState } from "react"
import { useForm } from "react-hook-form"
//import icon icon-car.svg
import Access from "@components/util/Access.component"
import { GET_DAFTAR_TTB } from "graphql/daftar_ttb/queries"
import Link from "next/link"
import router from "next/router"

//get DATA

const GET_DATA = gql`
	query daftar_surat_jalan {
		daftar_surat_jalan {
			id
			nomor_surat_jalan
			nomor_ttb
			vendor_pelayanan
			koli
			volume
			total_koli
			total_volume
			tanggal_surat_jalan
			tanggal_keberangkatan
			nomor_container
			nomor_seal
			keterangan
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
	total_volume: string
	volume: string
	nomor_kendaraan: string
	vendor_pelayanan: string
	posisi: string
	nomor_container: string
	nomor_seal: string
}

export default function Home() {
	const { data, loading } = useQuery(GET_DATA)

	//GET DAftar ttb
	const { data: dataTTB } = useQuery(GET_DAFTAR_TTB)

	const setForm = useForm()

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
			title: `Volume M³`,
			dataIndex: `volume`,
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

	//DATA FOr table with date moment
	const dataTable = filteredData?.map((item) => {
		return {
			id: item.id,
			//get pengirim from ttb where ttb number same
			pengirim: dataTTB?.daftar_ttb.find(
				(ttb) => ttb.ttb_number === item.nomor_ttb
			)?.pengirim,
			nomor_ttb: item.nomor_ttb,
			nomor_surat_jalan: item.nomor_surat_jalan,
			nomor_container: item.nomor_container,
			nomor_seal: item.nomor_seal,
			volume: item.total_volume,
			kota_tujuan: dataTTB?.daftar_ttb.find(
				(ttb) => ttb.ttb_number === item.nomor_ttb
			)?.kota_tujuan,
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
	console.log(`data`, dataTable)
	return (
		<AdminPage
			authId="daftar-surat-jalan"
			title="Daftar Surat Jalan"
			setForm={setForm}
			action={
				<Access
					auth="write:settings-users"
					yes={
						<ul className="actions">
							<li className="action">
								<div className="form-group">
									<button className="button is-primary">
										<Link href="/pengiriman/daftar-surat-jalan/add">
											<a style={{ color: `white`, width: `170px` }}>Tambah</a>
										</Link>
									</button>
								</div>
							</li>
						</ul>
					}
				/>
			}
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
							onRow={(record) => {
								return {
									onClick: () => {
										router.push(`/pengiriman/daftar-surat-jalan/${record.id}`)
									}
								}
							}}
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
