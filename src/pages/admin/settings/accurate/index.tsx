import { gql, useMutation, useQuery } from "@apollo/client"
import AdminPage from "@components/admin/AdminPage.component"
import Dashboard from "@components/dashboard/Dashboard.component"
import { Popconfirm, Table } from "antd"
import { ColumnsType } from "antd/lib/table"
import { DELETE_ACCURATE } from "graphql/accurate/mutations"
import Link from "next/link"
import { useState } from "react"
import { useForm } from "react-hook-form"

const GET_DATA = gql`
	query accurate {
		accurate {
			id
			nama_barang
			jenis
			kode_barang
			akun_penjualan
			salesDiscountGlAccountId
			salesGlAccountId
			inventoryGlAccountId
		}
	}
`

interface DataType {
	updated_by: any
	creator: any
	nama_barang: any
	id: number
}

export default function Home() {
	const { data, loading } = useQuery(GET_DATA)

	const setForm = useForm()

	const [deleteAccurate] = useMutation(DELETE_ACCURATE, {
		refetchQueries: [{ query: GET_DATA }]
	})

	const deleteData = async (id) => {
		deleteAccurate({ variables: { deleteAccurateId: id } })
	}

	//search
	const [search, setSearch] = useState(``)
	const handleSearch = (e) => {
		setSearch(e.target.value)
	}
	const filteredData = data?.accurate.filter((item) => {
		return (
			item.nama_barang.toLowerCase().includes(search.toLowerCase()) ||
			item.nama_barang.toLowerCase().includes(search.toLowerCase())
		)
	})
	//make antd table with search
	const columns: ColumnsType<DataType> = [
		{
			title: `Nama Barang`,
			dataIndex: `nama_barang`,
			key: `nama_barang`,
			width: `1000%`,
			sorter: (a, b) => a.nama_barang.length - b.nama_barang.length,
			sortDirections: [`descend`, `ascend`]
		},
		{
			title: `Action`,
			key: `action`,
			render: (text, record) => (
				<span>
					<Popconfirm
						title="Are you sure delete this task?"
						onConfirm={() => deleteData(record.id)}
					>
						<a>Delete</a>
					</Popconfirm>
				</span>
			)
		}
	]

	//DATA FOR TABLE
	const dataSource = filteredData ? filteredData : data?.accurate

	return (
		<AdminPage
			legend=""
			authId=""
			title="Barang dan Jasa"
			setForm={setForm}
			action={
				<div className="form-group">
					<button className="button is-primary">
						<Link href="/admin/settings/accurate/add" passHref>
							<a style={{ color: `white`, width: `170px` }}>Tambah</a>
						</Link>
					</button>
				</div>
			}
		>
			<section className="section">
				<div className="admin-section" key="admin-section">
					<div className="admin-section-header" key="admin-header">
						<div
							className="admin-section-header-search"
							style={{ marginLeft: `80%` }}
							key="search"
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
						key="table1"
					>
						<Table
							rowKey={(record) => record.id}
							columns={columns}
							dataSource={dataSource}
							pagination={{ pageSize: 10 }}
							loading={loading}
							scroll={{ x: `max-content` }}
							// onRow={(record) => {
							// 	return {
							// 		onClick: () => {
							// 			router.push(`/data/jenis-pengiriman/${record.id}`)
							// 		}
							// 	}
							// }}
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
