import { gql, useMutation, useQuery } from "@apollo/client"
import AdminPage from "@components/admin/AdminPage.component"
import Dashboard from "@components/dashboard/Dashboard.component"
import Access from "@components/util/Access.component"
import { message, Table } from "antd"
import "antd/dist/antd.css"
import { ColumnsType } from "antd/lib/table"
import { DELETE_DAFTAR_TUJUAN } from "graphql/daftar_tujuan/mutations"
import Link from "next/link"
import router from "next/router"
import { useState } from "react"
import { useForm } from "react-hook-form"

const GET_DATA = gql`
	query Daftar_tujuan {
		daftar_tujuan {
			id
			kode_tujuan
			nama_tujuan
			updated_by
			creator
		}
	}
`

interface DataType {
	updated_by: any
	creator: any
	nama_tujuan: any
	kode_tujuan: any
	id: number
	firstName: string
	lastName: string
	age: number
	address: string
	tags: string[]
}

export default function Home() {
	const { data, loading, error } = useQuery(GET_DATA)

	const [deleteDaftarTujuan] = useMutation(DELETE_DAFTAR_TUJUAN, {
		refetchQueries: [{ query: GET_DATA }]
	})
	const deleteData = (id) => {
		deleteDaftarTujuan({ variables: { deleteDaftarTujuanId: id } })
		message.success(`Data Berhasil Dihapus`)
	}

	const setForm = useForm()

	//search
	const [search, setSearch] = useState(``)
	const handleSearch = (e) => {
		setSearch(e.target.value)
	}
	const filteredData = data?.daftar_tujuan.filter((item) => {
		return (
			item.kode_tujuan.toLowerCase().includes(search.toLowerCase()) ||
			item.nama_tujuan.toLowerCase().includes(search.toLowerCase())
		)
	})
	//make antd table with search
	const columns: ColumnsType<DataType> = [
		{
			title: `Kode Kota`,
			dataIndex: `kode_tujuan`,
			key: `kode_tujuan`,
			width: `50%`,
			sorter: (a, b) => a.kode_tujuan.localeCompare(b.kode_tujuan),
			sortDirections: [`descend`, `ascend`]
		},
		{
			title: `Nama Kota`,
			dataIndex: `nama_tujuan`,
			key: `nama_tujuan`,
			width: `50%`,
			sorter: (a, b) => a.nama_tujuan.localeCompare(b.nama_tujuan),
			sortDirections: [`descend`, `ascend`]
		}
		// {
		//     title: `Action`,
		//     key: `action`,
		//     render: (text, record) => (
		//         <span>
		//            <a href={`/data/daftar-tujuan/${record.id}`} style={{ marginRight:`10px` }}>Edit</a>
		//             <Popconfirm title="Are you sure delete this task?" onConfirm={() => deleteData(record.id)}>
		//                 <a>Delete</a>
		//             </Popconfirm>
		//         </span>
		//     ),
		// }
	]

	//DATA FOR TABLE
	const dataSource = filteredData ? filteredData : data?.daftar_tujuan
	return (
		<AdminPage
			authId="daftar-tujuan"
			title="Daftar Kota"
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
										<Link href="/data/daftar-tujuan/add">
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
							sortDirections={[`descend`, `ascend`]}
							loading={loading}
							scroll={{ x: `max-content` }}
							onRow={(record) => {
								return {
									onClick: () => {
										router.push(`/data/daftar-tujuan/${record.id}`)
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
