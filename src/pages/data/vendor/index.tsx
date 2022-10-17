/* eslint-disable @next/next/no-html-link-for-pages */
import { gql, useQuery } from "@apollo/client"
import AdminPage from "@components/admin/AdminPage.component"
import Dashboard from "@components/dashboard/Dashboard.component"
import Access from "@components/util/Access.component"
import { Table } from "antd"
import "antd/dist/antd.css"
import { ColumnsType } from "antd/lib/table"
import moment from "moment"
import Link from "next/link"
import router from "next/router"
import { useState } from "react"
import { useForm } from "react-hook-form"

const GET_DATA = gql`
	query Vendor {
		vendor {
			id
			kode_vendor
			nama_vendor
			alamat
			telepon
			npwp
			pic
			status
			jenis
			last_update
			creator
			updated_by
		}
	}
`

interface DataType {
	id: number
	nama_vendor: any
	kode_vendor: any
	alamat: any
	telepon: any
	npwp: any
	pic: any
	status: any
	jenis: any
	last_update: any
	creator: any
	updated_by: any
	tags: string[]
}

export default function Home() {
	const { data, loading } = useQuery(GET_DATA)

	const setForm = useForm()

	//search
	const [search, setSearch] = useState(``)
	const handleSearch = (e) => {
		setSearch(e.target.value)
	}
	//make filtered data
	const filteredData = data?.vendor.filter((item) => {
		return (
			item.kode_vendor.toLowerCase().includes(search.toLowerCase()) ||
			item.nama_vendor.toLowerCase().includes(search.toLowerCase())
		)
	})
	//make antd table with search
	const columns: ColumnsType<DataType> = [
		{
			title: `# Vendor`,
			dataIndex: `kode_vendor`,
			key: `kode_vendor`,
			width: `20%`,
			sorter: (a, b) => a.kode_vendor.localeCompare(b.kode_vendor),
			sortDirections: [`descend`, `ascend`]
		},
		{
			title: `Nama Vendor`,
			dataIndex: `nama_vendor`,
			key: `nama_vendor`,
			width: `20%`,
			sorter: (a, b) => a.nama_vendor.localeCompare(b.nama_vendor),
			sortDirections: [`descend`, `ascend`]
		},
		{
			title: `Alamat`,
			dataIndex: `alamat`,
			key: `alamat`,
			width: `20%`,
			sorter: (a, b) => a.alamat.localeCompare(b.alamat),
			sortDirections: [`descend`, `ascend`]
		},
		{
			title: `Telepon`,
			dataIndex: `telepon`,
			key: `telepon`,
			width: `20%`,
			sorter: (a, b) => a.telepon.localeCompare(b.telepon),
			sortDirections: [`descend`, `ascend`]
		},
		{
			title: `NPWP`,
			dataIndex: `npwp`,
			key: `npwp`,
			width: `20%`,
			sorter: (a, b) => a.npwp.localeCompare(b.npwp),
			sortDirections: [`descend`, `ascend`]
		},
		{
			title: `PIC`,
			dataIndex: `pic`,
			key: `pic`,
			width: `20%`,
			sorter: (a, b) => a.pic.localeCompare(b.pic),
			sortDirections: [`descend`, `ascend`]
		},
		{
			title: `Status`,
			dataIndex: `status`,
			key: `status`,
			width: `20%`,
			sorter: (a, b) => a.status.localeCompare(b.status),
			sortDirections: [`descend`, `ascend`]
		},
		{
			title: `Jenis`,
			dataIndex: `jenis`,
			key: `jenis`,
			width: `20%`,
			sorter: (a, b) => a.jenis.localeCompare(b.jenis),
			sortDirections: [`descend`, `ascend`]
		}
		// {
		//     title: `Action`,
		//     key: `action`,
		//     render: (text, record) => (
		//         <span>
		//               <a href={`/data/vendor/${record.id}`} style={{ marginRight:`10px` }}>Edit</a>
		//             <Popconfirm title="Are you sure delete this task?" onConfirm={() => deleteData(record.id)}>
		//                 <a>Delete</a>
		//             </Popconfirm>
		//         </span>
		//     ),
		// }
	]

	//DATA FOr table with date moment
	const dataTable = filteredData?.map((item) => {
		return {
			id: item.id,
			kode_vendor: item.kode_vendor,
			nama_vendor: item.nama_vendor,
			alamat: item.alamat,
			telepon: item.telepon,
			npwp: item.npwp,
			pic: item.pic,
			status: item.status,
			jenis: item.jenis,
			last_update: moment
				.unix(item.last_update / 1000)
				.format(`DD MMM YYYY hh:mm a`),
			creator: item.creator,
			updated_by: item.updated_by
		}
	})
	const dataSource = dataTable
	return (
		<AdminPage
			authId="daftar-vendor"
			title="Daftar Vendor"
			setForm={setForm}
			action={
				<Access
					auth="write:settings-users"
					yes={
						<ul className="actions">
							<li className="action">
								<div className="form-group">
									<button className="button is-primary">
										<Link href="/data/vendor/add">
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
										router.push(`/data/vendor/${record.id}`)
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
