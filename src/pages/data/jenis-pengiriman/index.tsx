import { gql, useQuery } from "@apollo/client"
import AdminPage from "@components/admin/AdminPage.component"
import Dashboard from "@components/dashboard/Dashboard.component"
import Access from "@components/util/Access.component"
import { Table } from "antd"
import "antd/dist/antd.css"
import { ColumnsType } from "antd/lib/table"
import Link from "next/link"
import router from "next/router"
import { useState } from "react"
import { useForm } from "react-hook-form"

const GET_DATA = gql`
	query Jenis_pengiriman {
		jenis_pengiriman {
			id
			nama_pengiriman
			updated_by
			creator
		}
	}
`

interface DataType {
	updated_by: any
	creator: any
	nama_pengiriman: any
	id: number
}

export default function Home() {
	const { data, loading } = useQuery(GET_DATA)

	const setForm = useForm()

	//search
	const [search, setSearch] = useState(``)
	const handleSearch = (e) => {
		setSearch(e.target.value)
	}
	const filteredData = data?.jenis_pengiriman.filter((item) => {
		return (
			item.nama_pengiriman.toLowerCase().includes(search.toLowerCase()) ||
			item.nama_pengiriman.toLowerCase().includes(search.toLowerCase())
		)
	})
	//make antd table with search
	const columns: ColumnsType<DataType> = [
		{
			title: `Nama Pengiriman`,
			dataIndex: `nama_pengiriman`,
			key: `nama_pengiriman`,
			width: `1000%`,
			sorter: (a, b) => a.nama_pengiriman.length - b.nama_pengiriman.length,
			sortDirections: [`descend`, `ascend`]
		}
		// {
		//     title: 'Action',
		//     key: 'action',
		//     render: (text, record) => (
		//         <span>
		//            <a href={`/data/jenis-pengiriman/${record.id}`} style={{ marginRight:"10px", }}>Edit</a>
		//             <Popconfirm title="Are you sure delete this task?" onConfirm={() => deleteData(record.id)}>
		//                 <a>Delete</a>
		//             </Popconfirm>
		//         </span>
		//     ),
		// },
	]

	//DATA FOR TABLE
	const dataSource = filteredData ? filteredData : data?.jenis_pengiriman

	return (
		<AdminPage
			legend=""
			authId=""
			title="Jenis Pengiriman"
			setForm={setForm}
			action={
				<Access
					auth="write:settings-users"
					yes={
						<ul className="actions">
							<li className="action">
								<div className="form-group">
									<button className="button is-primary">
										<Link href="/data/jenis-pengiriman/add">
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
										router.push(`/data/jenis-pengiriman/${record.id}`)
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
