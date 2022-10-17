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
	query Customer {
		customer {
			id
			kode_customer
			nama_customer
			alamat
			telepon
			npwp
			term_payment
			pic
			tipe_ppn
			status
			last_update
			creator
			updated_by
		}
	}
`

interface DataType {
	term_payment: any
	updated_by: any
	creator: any
	nama_customer: any
	kode_customer: any
	alamat: any
	telepon: any
	npwp: any
	pic: any
	status: any
	last_update: any
	id: number
	tipe_ppn: any
}

export default function Home() {
	const { data, loading } = useQuery(GET_DATA)

	const setForm = useForm()

	//search
	const [search, setSearch] = useState(``)
	const handleSearch = (e) => {
		setSearch(e.target.value)
	}
	const filteredData = data?.customer.filter((item) => {
		return (
			item.kode_customer.toLowerCase().includes(search.toLowerCase()) ||
			item.nama_customer.toLowerCase().includes(search.toLowerCase())
		)
	})
	//make antd table with search
	const columns: ColumnsType<DataType> = [
		{
			title: `# Customer`,
			dataIndex: `kode_customer`,
			key: `kode_customer`,
			width: `20%`,
			sorter: (a, b) => a.kode_customer.localeCompare(b.kode_customer),
			sortDirections: [`descend`, `ascend`]
		},
		{
			title: `Nama Customer`,
			dataIndex: `nama_customer`,
			key: `nama_customer`,
			width: `20%`,
			sorter: (a, b) => a.nama_customer.localeCompare(b.nama_customer),
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
			sorter: (a, b) => a.telepon - b.telepon,
			sortDirections: [`descend`, `ascend`]
		},
		{
			title: `TOP`,
			dataIndex: `term_payment`,
			key: `term_payment`,
			width: `20%`,
			sorter: (a, b) => a.term_payment - b.term_payment,
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
			sorter: (a, b) => a.pic - b.pic,
			sortDirections: [`descend`, `ascend`]
		},
		{
			title: `Tipe PPN`,
			dataIndex: `tipe_ppn`,
			key: `tipe_ppn`,
			width: `20%`,
			sorter: (a, b) => a.tipe_ppn.localeCompare(b.tipe_ppn),
			sortDirections: [`descend`, `ascend`]
		},
		{
			title: `status`,
			dataIndex: `status`,
			key: `status`,
			width: `20%`,
			sorter: (a, b) => a.status.localeCompare(b.status),
			sortDirections: [`descend`, `ascend`]
		}
	]

	//DATA FOR TABLE
	//DATA FOr table with date moment
	const dataTable = filteredData?.map((item) => {
		return {
			id: item.id,
			kode_customer: item.kode_customer,
			nama_customer: item.nama_customer,
			alamat: item.alamat,
			telepon: item.telepon,
			npwp: item.npwp,
			pic: item.pic,
			term_payment: item.term_payment,
			tipe_ppn: item.tipe_ppn,
			status: item.status,
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
			authId="daftar-customer"
			title="Daftar Customer"
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
										<Link href="/data/customer/add">
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
										router.push(`/data/customer/${record.id}`)
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
