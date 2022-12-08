import { gql, useQuery } from "@apollo/client"
import AdminPage from "@components/admin/AdminPage.component"
import { Table } from "antd"
import { ColumnsType } from "antd/lib/table"
import { useState } from "react"
import { useForm } from "react-hook-form"
//import icon icon-car.svg
import Dashboard from "@components/dashboard/Dashboard.component"
import Access from "@components/util/Access.component"
import moment from "moment"
import Link from "next/link"
import router from "next/router"

//get DATA

const GET_DATA = gql`
	query daftar_workorder {
		daftar_workorder {
			id
			nomor_workorder
			kendaraan
			nomor_container
			nomor_seal
			kota_tujuan
			komentar_container
			komentar_muat_barang
			komentar_menuju_pelabuhan
			komentar_tiba_pelabuhan
			komentar_muatan
			komentar_destinasi
			tanggal_wo
			tanggal_container
			tanggal_muat_barang
			tanggal_menuju_pelabuhan
			tanggal_tiba_pelabuhan
			tanggal_muatan
			tanggal_destinasi
			nomor_kendaraan
			nama_supir
			nama_kenek
			wa_supir
			wa_kenek
			photo_container
			photo_seal_pelabuhan
			photo_surat_jalan
			photo_muat_barang
			photo_seal_muatan
			photo_seal_destinasi
			status
		}
	}
`

interface DataType {
	id: any
	nomor_workorder: string
	kendaraan: string
	nomor_container: string
	nomor_seal: string
	kota_tujuan: string
	status: string
	tanggal_container: string
	tanggal_muat_barang: string
	tanggal_menuju_pelabuhan: string
	tanggal_tiba_pelabuhan: string
	tanggal_muatan: string
	tanggal_destinasi: string
}

export default function Home() {
	const { data, loading } = useQuery(GET_DATA)

	const setForm = useForm()

	//search
	const [search, setSearch] = useState(``)
	const handleSearch = (e) => {
		setSearch(e.target.value)
	}
	//make filtegreen data
	const filteredData = data?.daftar_workorder.filter((item) => {
		return item.nomor_workorder?.toLowerCase().includes(search.toLowerCase())
	})

	//make antd table with search

	//DATA FOr table with date moment
	const dataTable = filteredData?.map((item) => {
		return {
			nomor_workorder: item.nomor_workorder,
			kendaraan: item.kendaraan,
			nomor_container: item.nomor_container,
			nomor_seal: item.nomor_seal,
			kota_tujuan: item.kota_tujuan,
			komentar_container: item.komentar_container,
			komentar_muat_barang: item.komentar_muat_barang,
			komentar_menuju_pelabuhan: item.komentar_menuju_pelabuhan,
			komentar_tiba_pelabuhan: item.komentar_tiba_pelabuhan,
			komentar_muatan: item.komentar_muatan,
			komentar_destinasi: item.komentar_destinasi,
			tanggal_wo: moment(item.tanggal_wo).format(`DD MM YYYY`),
			tanggal_container:
				item.tanggal_container === `Invalid date`
					? null
					: item.tanggal_container,
			tanggal_muat_barang:
				item.tanggal_muat_barang === `Invalid date`
					? null
					: item.tanggal_muat_barang,
			tanggal_menuju_pelabuhan:
				item.tanggal_menuju_pelabuhan === `Invalid date`
					? null
					: item.tanggal_menuju_pelabuhan,
			tanggal_tiba_pelabuhan:
				item.tanggal_tiba_pelabuhan === `Invalid date`
					? null
					: item.tanggal_tiba_pelabuhan,
			tanggal_muatan:
				item.tanggal_muatan === `Invalid date` ? null : item.tanggal_muatan,
			tanggal_destinasi:
				item.tanggal_destinasi === `Invalid date`
					? null
					: item.tanggal_destinasi,
			nomor_kendaraan: item.nomor_kendaraan,
			nama_supir: item.nama_supir,
			nama_kenek: item.nama_kenek,
			wa_supir: item.wa_supir,
			wa_kenek: item.wa_kenek,
			photo_container: item.photo_container,
			photo_seal_pelabuhan: item.photo_seal_pelabuhan,
			photo_surat_jalan: item.photo_surat_jalan,
			photo_muat_barang: item.photo_muat_barang,
			photo_seal_muatan: item.photo_seal_muatan,
			photo_seal_destinasi: item.photo_seal_destinasi,
			status: item.status
		}
	})
	//merge duplicate data nomor ttb
	const mergeData = dataTable?.reduce((acc, current) => {
		const x = acc.find(
			(item) => item.nomor_workorder === current.nomor_workorder
		)
		if (!x) {
			return acc.concat([current])
		} else {
			return acc
		}
	}, [])

	const dataMap = mergeData
	const dataSource = dataMap

	console.log(`data`, dataSource?.tanggal_container)

	const columns: ColumnsType<DataType> = [
		{
			title: `No. Work Order`,
			dataIndex: `nomor_workorder`,
			key: `nomor_workorder`,
			align: `center`,
			width: `10%`,
			sorter: (a, b) => a.nomor_workorder.localeCompare(b.nomor_workorder),
			sortDirections: [`descend`, `ascend`]
		},
		{
			title: `Kendaraan`,
			dataIndex: `kendaraan`,
			key: `kendaraan`,
			align: `center`,
			width: `10%`,
			sorter: (a, b) => a.kendaraan.localeCompare(b.kendaraan),
			sortDirections: [`descend`, `ascend`]
		},
		{
			title: `Container/seal`,
			dataIndex: [`nomor_container`, `nomor_seal`],
			key: `nomor_container`,
			width: `10%`,
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
			title: `Kota Tujuan`,
			dataIndex: `kota_tujuan`,
			key: `kota_tujuan`,
			align: `center`,
			width: `10%`,
			sorter: (a, b) => a.kota_tujuan.localeCompare(b.kota_tujuan),
			sortDirections: [`descend`, `ascend`]
		},
		{
			//make ambil container, muat barang, menuju pelabuhan, tiba pelabuhan, pindah muatan, menuju destinasi with border
			title: `Status`,
			dataIndex: [
				`status`,
				`tanggal_container`,
				`tanggal_muat_barang`,
				`tanggal_menuju_pelabuhan`,
				`tanggal_tiba_pelabuhan`,
				`tanggal_muatan`,
				`tanggal_destinasi`
			],
			key: `status`,
			align: `center`,
			width: `20%`,
			sorter: (a, b) => a.status.localeCompare(b.status),
			sortDirections: [`descend`, `ascend`],
			render: (text, record) => (
				<span
					style={{
						flexDirection: `row`,
						display: `flex`
					}}
				>
					<span
						style={{
							//if tanggal container is not null || "" , make border black
							marginLeft: `1%`,
							border: `${
								record.tanggal_container !== null ||
								record.tanggal_container !== ``
									? `1px solid green`
									: `1px solid black`
							}`,
							color: `${
								record.tanggal_container !== null ||
								record.tanggal_container !== ``
									? `green`
									: `black`
							}`
						}}
						className="bg-blue-500 text-black rounded-md px-2 py-1"
					>
						Ambil Container
					</span>
					<span
						style={{
							//if tanggal muat barang is not null || "" , make border black
							marginLeft: `1%`,
							border: `${
								record.tanggal_muat_barang !== null ||
								record.tanggal_muat_barang !== ``
									? `1px solid green`
									: `1px solid black`
							}`,
							color: `${
								record.tanggal_muat_barang !== null ||
								record.tanggal_muat_barang !== ``
									? `green`
									: `black`
							}`
						}}
						className="bg-blue-500 text-white rounded-md px-2 py-1"
					>
						Muat Barang
					</span>
					<span
						style={{
							//if tanggal menuju pelabuhan is not null || "" , make border black
							marginLeft: `1%`,
							border: `${
								record.tanggal_menuju_pelabuhan !== null ||
								record.tanggal_menuju_pelabuhan !== ``
									? `1px solid green`
									: `1px solid black`
							}`,
							color: `${
								record.tanggal_menuju_pelabuhan !== null ||
								record.tanggal_menuju_pelabuhan !== ``
									? `green`
									: `black`
							}`
						}}
						className="bg-blue-500 text-white rounded-md px-2 py-1"
					>
						Menuju Pelabuhan
					</span>
					<span
						style={{
							//if tanggal tiba pelabuhan is null || "" || Invalid date make border black
							marginLeft: `1%`,
							border: `${
								record.tanggal_tiba_pelabuhan !== null ||
								record.tanggal_tiba_pelabuhan !== ``
									? `1px solid green`
									: `1px solid black`
							}`,
							color: `${
								record.tanggal_tiba_pelabuhan !== null ||
								record.tanggal_tiba_pelabuhan !== ``
									? `green`
									: `black`
							}`
						}}
						className="bg-blue-500 text-white rounded-md px-2 py-1"
					>
						Tiba Di Pelabuhan
					</span>
					<span
						style={{
							//if tanggal pindah muatan is not null || "" , make border black
							marginLeft: `1%`,
							border: `${
								record.tanggal_muatan !== null ||
								record.tanggal_muatan !== `` ||
								record.tanggal_container !== `Invalid date`
									? `1px solid green`
									: `1px solid black`
							}`,
							color: `${
								record.tanggal_muatan !== null ||
								record.tanggal_muatan !== `` ||
								record.tanggal_container !== `Invalid date`
									? `green`
									: `black`
							}`
						}}
						className="bg-blue-500 text-white rounded-md px-2 py-1"
					>
						Pindah Muatan
					</span>
					<span
						style={{
							//if tanggal menuju destinasi is not null || "" , make border and font color black
							marginLeft: `1%`,
							border: `${
								record.tanggal_destinasi !== null ||
								record.tanggal_destinasi !== `` ||
								record.tanggal_container !== `Invalid date`
									? `1px solid green`
									: `1px solid black`
							}`,
							color: `${
								record.tanggal_destinasi !== null ||
								record.tanggal_destinasi !== `` ||
								record.tanggal_container !== `Invalid date`
									? `green`
									: `black`
							}`
						}}
						className="bg-blue-500 text-white rounded-md px-2 py-1"
					>
						Menuju Destinasi
					</span>
				</span>
			)
		}
	]

	return (
		<AdminPage
			authId="workorder"
			title="Work Order"
			setForm={setForm}
			action={
				<Access
					auth="write:settings-users"
					yes={
						<ul className="actions">
							<li className="action">
								<div className="form-group">
									<button className="button is-primary">
										<Link href="/pengiriman/workorder/add">
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
							rowKey={(record) => record.id}
							columns={columns}
							dataSource={dataSource}
							pagination={{ pageSize: 10 }}
							loading={loading}
							scroll={{ x: `max-content` }}
							onRow={(record) => {
								return {
									onClick: () => {
										router.push(`/keuangan/daftar-invoice/${record.id}`)
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
