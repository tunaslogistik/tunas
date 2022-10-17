import { gql, useQuery } from "@apollo/client"
import AdminPage from "@components/admin/AdminPage.component"
import Dashboard from "@components/dashboard/Dashboard.component"
import { Table } from "antd"
import "antd/dist/antd.css"
import { ColumnsType } from "antd/lib/table"
import { useState } from "react"
import { useForm } from "react-hook-form"
//import icon icon-car.svg
import IconTruck from "@assets/icons/icon-car.svg"
import Access from "@components/util/Access.component"
import { GET_DAFTAR_MUAT_BARANG } from "graphql/daftar_muat_barang/queries"
import { GET_DAFTAR_SALES_ORDER } from "graphql/daftar_sales_order/queries"
import { GET_DAFTAR_TUJUAN } from "graphql/daftar_tujuan/queries"
import Link from "next/link"
import router from "next/router"

//get DATA

const GET_DATA = gql`
	query daftar_ttb {
		daftar_ttb {
			id
			ttb_number
			pengirim
			kota_tujuan
			tanggal_diterima
			nama_penerima
			jenis_pengiriman
			nomor_telepon
			total_volume
			nama_barang
			panjang
			lebar
			tinggi
			koli
			alamat_tujuan
			status
			kategori
			full_container
		}
	}
`

interface DataType {
	id: number
	ttb_number: string
	pengirim: string
	kota_tujuan: string
	tanggal_diterima: string
	nama_penerima: string
	jenis_pengiriman: string
	nomor_telepon: string
	nama_barang: string
	panjang: string
	lebar: string
	tinggi: string
	koli: string
	alamat_tujuan: string
	status: string
	kategori: string
	full_container: string
}

export default function Home() {
	const { data, loading } = useQuery(GET_DATA)

	//GET DAFTAR TUJUAN
	const { data: dataTujuan } = useQuery(GET_DAFTAR_TUJUAN)
	const { data: dataSalesOrder } = useQuery(GET_DAFTAR_SALES_ORDER)
	const { data: dataMuatBarang } = useQuery(GET_DAFTAR_MUAT_BARANG)

	const setForm = useForm()

	//search
	const [search, setSearch] = useState(``)
	const handleSearch = (e) => {
		setSearch(e.target.value)
	}
	//make filtered data
	const filteredData = data?.daftar_ttb.filter((item) => {
		return (
			item.ttb_number.toLowerCase().includes(search.toLowerCase()) ||
			item.pengirim.toLowerCase().includes(search.toLowerCase())
		)
	})
	//make antd table with search
	const columns: ColumnsType<DataType> = [
		{
			title: `No. TTB`,
			dataIndex: `ttb_number`,
			key: `ttb_number`,
			width: `20%`,
			sorter: (a, b) => a.ttb_number.localeCompare(b.ttb_number),
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
			title: `Kota tujuan`,
			dataIndex: `kota_tujuan`,
			key: `kota_tujuan`,
			width: `20%`,
			sorter: (a, b) => a.kota_tujuan.localeCompare(b.kota_tujuan),
			sortDirections: [`descend`, `ascend`]
		},
		{
			title: `Volume M³`,
			dataIndex: `volume_m3`,
			key: `volume_m3`,
			width: `20%`,
			sortDirections: [`descend`, `ascend`]
		},
		{
			title: `Jenis pengiriman`,
			dataIndex: `jenis_pengiriman`,
			key: `jenis_pengiriman`,
			width: `20%`,
			sorter: (a, b) => a.jenis_pengiriman.localeCompare(b.jenis_pengiriman),
			sortDirections: [`descend`, `ascend`]
		},
		{
			title: `Status`,
			dataIndex: `status`,
			key: `status`,
			width: `20%`,
			sorter: (a, b) => a.status.localeCompare(b.status),
			sortDirections: [`descend`, `ascend`]
		}
	]

	//make icon on the table
	const makeIcon = (full_container) => {
		if (full_container === `true`) {
			return <IconTruck style={{ color: `green` }} />
		} else if (full_container === `false`) {
			return (
				<span style={{ color: `red` }}>
					<i className="fas fa-times-circle"></i>
				</span>
			)
		}
	}

	//DATA FOr table with date moment
	const dataTable = filteredData?.map((item) => {
		return {
			id: item.id,
			ttb_number: item.ttb_number,
			pengirim: item.pengirim,
			kota_tujuan: dataTujuan?.daftar_tujuan.find(
				(item2) => item2.kode_tujuan === item.kota_tujuan
			)?.nama_tujuan,
			volume_m3: item.total_volume,
			jenis_pengiriman: item.jenis_pengiriman,
			note: makeIcon(item.full_container),
			//status if nomor ttb in sales order then set status "sales order" if nomor ttb in sales order and muat barang then set status "muat barang"
			status: dataSalesOrder?.daftar_sales_order.find(
				(item2) => item2.nomor_ttb === item.ttb_number
			)
				? dataMuatBarang?.daftar_muat_barang.find(
						(item2) => item2.nomor_ttb === item.ttb_number
				  )
					? `Muat Barang`
					: `Sales Order`
				: `TTB`
		}
	})

	const ids = dataTable?.map((o) => o.ttb_number)
	const filtered = dataTable?.filter(
		({ ttb_number }, index) => !ids.includes(ttb_number, index + 1)
	)

	const dataMap = filtered
	const dataSource = dataMap
	console.log(dataSource)
	return (
		<AdminPage
			authId="daftar-ttb"
			title="Daftar TTB"
			setForm={setForm}
			action={
				<Access
					auth="write:settings-users"
					yes={
						<ul className="actions">
							<li className="action">
								<div className="form-group">
									<button className="button is-primary">
										<Link href="/order/daftar-ttb/add">
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
										router.push(`/order/daftar-ttb/${record.id}`)
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
