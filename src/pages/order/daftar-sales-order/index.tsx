import { gql, useQuery } from "@apollo/client"
import AdminPage from "@components/admin/AdminPage.component"
import Dashboard from "@components/dashboard/Dashboard.component"
import { DashboardContext } from "@contexts/DashboardContext.context"
import { Table } from "antd"
import { ColumnsType } from "antd/lib/table"
import { GET_USERS } from "graphql/user/queries"
import Link from "next/link"
import { useContext, useEffect, useState } from "react"
import { useForm } from "react-hook-form"
//import icon icon-car.svg
import Access from "@components/util/Access.component"
import { watch } from "fs"
import { GET_DAFTAR_TUJUAN } from "graphql/daftar_tujuan/queries"
import Router from "next/router"

//get DATA

const GET_DATA = gql`
	query daftar_sales_order {
		daftar_sales_order {
			id
			nomor_ttb
			nomor_sales_order
			total_volume
			pengirim
			harga
			total_tagihan
			kota_tujuan
			tanggal_sales_order
			term_payment
		}
	}
`

interface DataType {
	id: number
	nomor_ttb: string
	pengirim: string
	nomor_sales_order: string
	total_volume: number
	kota_tujuan: string
	harga: number
	total_ttb: number
	total_tagihan: number
	nama_kapal: string
	tanggal_keberangkatan: string
	nomor_container: string
	nomor_seal: string
	tanggal_sales_order: string
	term_payment: string
}

export default function Home() {
	const { state: dashboardState } = useContext(DashboardContext)
	const username = dashboardState.auth.username

	//GET USERS
	const { data: dataUsers } = useQuery(GET_USERS)

	const role = dataUsers?.users?.user?.find(
		(user) => user.username === username
	)?.role

	const { data, loading } = useQuery(GET_DATA)

	useEffect(() => {
		watch(data)
	}, [data])

	//GET DAFTAR TUJUAN
	const { data: dataTujuan } = useQuery(GET_DAFTAR_TUJUAN)

	const setForm = useForm()

	//search
	const [search, setSearch] = useState(``)
	const handleSearch = (e) => {
		setSearch(e.target.value)
	}
	//make filtered data
	const filteredData = data?.daftar_sales_order.filter((item) => {
		return (
			item.nomor_sales_order.toLowerCase().includes(search.toLowerCase()) ||
			item.pengirim.toLowerCase().includes(search.toLowerCase())
		)
	})
	//make antd table with search
	const columns: ColumnsType<DataType> = [
		{
			title: `No. Sales Order`,
			dataIndex: `nomor_sales_order`,
			key: `nomor_sales_order`,
			width: `20%`,
			sorter: (a, b) => a.nomor_sales_order.localeCompare(b.nomor_sales_order),
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
			title: `Volume M³`,
			dataIndex: `total_volume`,
			key: `total_volume`,
			width: `20%`,
			sorter: (a, b) => a.total_volume - b.total_volume,
			sortDirections: [`descend`, `ascend`]
		},
		{
			title: `Harga`,
			dataIndex: `harga`,
			key: `harga`,
			width: `20%`,
			sorter: (a, b) => a.harga - b.harga,
			sortDirections: [`descend`, `ascend`]
		}
		// {
		// 	title: `Total TTB`,
		// 	dataIndex: `total_ttb`,
		// 	key: `total_ttb`,
		// 	width: `20%`,
		// 	sorter: (a, b) => a.total_ttb - b.total_ttb,
		// 	sortDirections: [`descend`, `ascend`]
		// }
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
			nomor_sales_order: item.nomor_sales_order,
			pengirim: item.pengirim,
			kota_tujuan: dataTujuan?.daftar_tujuan.find(
				(item2) => item2.kode_tujuan === item.kota_tujuan
			)?.nama_tujuan,
			total_volume: item.total_volume,
			nama_kapal: item.nama_kapal,
			harga: item.harga?.toLocaleString(`id-ID`, {
				style: `currency`,
				currency: `IDR`
			}),
			total_ttb: item.total_ttb,
			tanggal_sales_order: item.tanggal_sales_order,
			tanggal_keberangkatan: item.tanggal_keberangkatan,
			nomor_container: item.nomor_container,
			nomor_seal: item.nomor_seal,
			term_payment: item.term_payment
		}
	})

	const dataMap = dataTable
	const dataSource = dataMap
	return (
		<AdminPage
			authId="daftar-sales-order"
			title="Daftar Sales Order"
			setForm={setForm}
			action={
				<Access
					auth="write:settings-users"
					yes={
						<ul className="actions">
							<li className="action">
								<div className="form-group">
									<button className="button is-primary">
										<Link href="/order/daftar-sales-order/add">
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
										Router.push(`/order/daftar-sales-order/${record.id}`)
									}
								}
							}}
							// onRow={(record, rowIndex) => {
							// 	return {
							// 		onClick: (event) => {
							// 			if (username === `ei8-admin` || role === `superadmin`) {
							// 				Router.push(`/order/daftar-sales-order/${record.id}`)
							// 			} else {
							// 				message.error(`Anda tidak memiliki akses ke menu ini`)
							// 			}
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
