import { gql, useQuery } from "@apollo/client"
import AdminPage from "@components/admin/AdminPage.component"
import Dashboard from "@components/dashboard/Dashboard.component"
import Access from "@components/util/Access.component"
import { Table } from "antd"

import { ColumnsType } from "antd/lib/table"
import moment from "moment"
import Link from "next/link"
import router from "next/router"
import { useState } from "react"
import { useForm } from "react-hook-form"

const GET_DATA = gql`
	query Vechicle {
		vechnicle {
			id
			nomor_kendaraan
			tipe_kendaraan
			nama_supir
			nama_kenek
			nomor_supir
			nomor_kenek
			status
			last_update
			creator
			updated_by
		}
	}
`

interface DataType {
	id: number
	updated_by: any
	creator: any
	nomor_kendaraan: any
	tipe_kendaraan: any
	nama_supir: any
	nama_kenek: any
	nomor_supir: any
	nomor_kenek: any
	status: any
	last_update: any
}

export default function Home() {
	const { data, loading } = useQuery(GET_DATA)

	const setForm = useForm()
	//search
	const [search, setSearch] = useState(``)
	const handleSearch = (e) => {
		setSearch(e.target.value)
	}
	const filteredData = data?.vechnicle.filter((item) => {
		return (
			item.nomor_kendaraan.toLowerCase().includes(search.toLowerCase()) ||
			item.tipe_kendaraan.toLowerCase().includes(search.toLowerCase())
		)
	})
	//make antd table with search
	const columns: ColumnsType<DataType> = [
		{
			title: `Nomor Kendaraan`,
			dataIndex: `nomor_kendaraan`,
			key: `nomor_kendaraan`,
			width: `10%`,
			sorter: (a, b) => a.nomor_kendaraan.length - b.nomor_kendaraan.length,
			sortDirections: [`descend`, `ascend`]
		},
		{
			title: `Tipe Kendaraan`,
			dataIndex: `tipe_kendaraan`,
			key: `tipe_kendaraan`,
			width: `20%`,
			sorter: (a, b) => a.tipe_kendaraan.length - b.tipe_kendaraan.length,
			sortDirections: [`descend`, `ascend`]
		},
		{
			title: `Nama Supir`,
			dataIndex: `nama_supir`,
			key: `nama_supir`,
			width: `20%`,
			sorter: (a, b) => a.nama_supir.length - b.nama_supir.length,
			render: (text, record) => (
				<>
					{text}
					<br />
					<span style={{ color: `#999`, fontSize: `10px` }}>
						{record.nomor_supir}
					</span>
				</>
			),
			sortDirections: [`descend`, `ascend`]
		},
		{
			title: `Nama Kenek`,
			dataIndex: `nama_kenek`,
			key: `nama_kenek`,
			width: `20%`,
			sorter: (a, b) => a.nama_kenek.length - b.nama_kenek.length,
			render: (text, record) => (
				<>
					{text}
					<br />
					<span style={{ color: `#999`, fontSize: `10px` }}>
						{record.nomor_kenek}
					</span>
				</>
			),
			sortDirections: [`descend`, `ascend`]
		},
		{
			title: `status`,
			dataIndex: `status`,
			key: `status`,
			width: `10%`,
			sorter: (a, b) => a.status - b.status,
			sortDirections: [`descend`, `ascend`]
		},
		{
			title: `Last Update`,
			dataIndex: `last_update`,
			key: `last_update`,
			width: `30%`,
			sorter: (a, b) => a.last_update - b.last_update,
			sortDirections: [`descend`, `ascend`]
		}
		// {
		//     title: 'Creator',
		//     dataIndex: 'creator',
		//     key: 'creator',
		//     width: '20%',
		//     sorter: (a, b) => a.creator - b.creator,
		//     sortDirections: ['descend', 'ascend'],
		// },
		// {
		//     title: 'Updated By',
		//     dataIndex: 'updated_by',
		//     key: 'updated_by',
		//     width: '20%',
		//     sorter: (a, b) => a.updated_by - b.updated_by,
		//     sortDirections: ['descend', 'ascend'],
		// },

		// {
		//     title: 'Action',
		//     key: 'action',
		//     render: (text, record) => (
		//         <span>
		//            <a href={`/data/kendaraan/${record.id}`} style={{ marginRight:"10px", }}>Edit</a>
		//             <Popconfirm title="Are you sure delete this task?" onConfirm={() => deleteData(record.id)}>
		//                 <a>Delete</a>
		//             </Popconfirm>
		//         </span>
		//     ),
		// },
	]

	//DATA FOR TABLE
	//DATA FOr table with date moment
	const dataTable = filteredData?.map((item) => {
		return {
			id: item.id,
			nomor_kendaraan: item.nomor_kendaraan,
			tipe_kendaraan: item.tipe_kendaraan,
			nama_supir: item.nama_supir,
			nama_kenek: item.nama_kenek,
			nomor_supir: item.nomor_supir,
			nomor_kenek: item.nomor_kenek,
			status: item.status,
			last_update: moment.unix(item.last_update / 1000).format(`YYYY-MM-DD`),
			creator: item.creator,
			updated_by: item.updated_by
		}
	})
	const dataSource = dataTable
	return (
		<AdminPage
			authId="Daftar-kendaraan"
			title="Daftar Kendaraan"
			legend=""
			setForm={setForm}
			action={
				<Access
					auth="write:settings-users"
					yes={
						<ul className="actions">
							<li className="action">
								<div className="form-group">
									<button className="button is-primary">
										<Link href="/data/kendaraan/add">
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
										router.push(`/data/kendaraan/${record.id}`)
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
