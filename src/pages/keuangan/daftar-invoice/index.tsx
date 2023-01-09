import { gql, useQuery } from "@apollo/client"
import AdminPage from "@components/admin/AdminPage.component"
import Dashboard from "@components/dashboard/Dashboard.component"
import { Table } from "antd"

import { ColumnsType } from "antd/lib/table"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
//import icon icon-car.svg
import Access from "@components/util/Access.component"
import { GET_DAFTAR_TTB } from "graphql/daftar_ttb/queries"
import { GET_DAFTAR_TUJUAN } from "graphql/daftar_tujuan/queries"
import Link from "next/link"
import router from "next/router"
import { GET_DAFTAR_INVOICE } from "../../../../graphql/daftar_invoice/queries"

//get DATA

const GET_DATA = gql`
	query daftar_invoice {
		daftar_invoice {
			id
			nomor_invoice
			nomor_surat_jalan
			nomor_ttb
			vendor_pelayanan
			koli
			volume
			total_koli
			total_volume
			tanggal_invoice
			tanggal_keberangkatan
			nomor_container
			nomor_seal
			keterangan
		}
	}
`

interface DataType {
	nomor_surat_jalan: any
	nomor_invoice: any
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
	const { data, loading, refetch } = useQuery(GET_DAFTAR_INVOICE, {
		fetchPolicy: `no-cache`,
		nextFetchPolicy: `no-cache`,
		pollInterval: 500
	})
	//GET DAftar ttb
	const { data: dataTTB } = useQuery(GET_DAFTAR_TTB)

	//GET DAFTAR TUJUAN
	const { data: dataTujuan } = useQuery(GET_DAFTAR_TUJUAN)

	const setForm = useForm()

	//useEffect refetch
	useEffect(() => {
		refetch()
		console.log(data)
	}, [data])

	//search
	const [search, setSearch] = useState(``)
	const handleSearch = (e) => {
		setSearch(e.target.value)
	}
	//make filtered data
	const filteredData = data?.daftar_invoice?.filter((item) => {
		return item.nomor_invoice.toLowerCase().includes(search.toLowerCase())
	})
	//make antd table with search
	const columns: ColumnsType<DataType> = [
		{
			title: `No. Invoice`,
			dataIndex: `nomor_invoice`,
			key: `nomor_invoice`,
			align: `center`,
			width: `20%`,
			sorter: (a, b) => a.nomor_invoice.localeCompare(b.nomor_invoice),
			sortDirections: [`descend`, `ascend`]
		},
		{
			title: `Kota Tujuan`,
			dataIndex: `kota_tujuan`,
			key: `kota_tujuan`,
			align: `center`,
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
			align: `center`,
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
		// 				onClick={() => {
		// 					window.open(
		// 						`/keuangan/daftar-invoice/print/${record.id}`,
		// 						`_blank`
		// 					)
		// 				}}
		// 			>
		// 				Print
		// 			</a>
		// 		</span>
		// 	)
		// }
	]

	//split fildered data nomor_ttb by ,
	const splitNomorTTB = filteredData?.map((item) => {
		return item.nomor_ttb.split(`,`)
	})

	//split fildered data nomor_surat_jalan by ,
	const splitNomorSuratJalan = filteredData?.map((item) => {
		return item.nomor_surat_jalan.split(`,`)
	})

	//DATA FOr table with date moment
	const dataTable = filteredData?.map((item) => {
		return {
			id: item.id,
			nomor_invoice: item.nomor_invoice,
			// nomor_ttb: splitNomorTTB
			nomor_ttb: String(
				splitNomorTTB?.map((item) => {
					return item[0]
				})
			),
			pengirim: dataTTB?.daftar_ttb.find(
				(ttb) => ttb.ttb_number === item.nomor_ttb
			)?.pengirim,
			//get only 1 nomor surat jalan
			nomor_surat_jalan: String(
				String(
					splitNomorTTB?.map((item) => {
						return item[0]
					})
				)
			),
			nomor_container: item.nomor_container,
			nomor_seal: item.nomor_seal,
			volume: item.total_volume,
			kota_tujuan: dataTTB?.daftar_ttb.find(
				(ttb) =>
					ttb.ttb_number ===
					String(
						splitNomorTTB?.map((item) => {
							return item[0]
						})
					)
			)?.kota_tujuan,
			nama_tujuan: dataTujuan?.daftar_tujuan.find(
				(tujuan) => tujuan.kode_tujuan === item.kode_tujuan
			)?.nama_tujuan,
			vendor_pelayanan: item.vendor_pelayanan,
			total_ttb: item.total_ttb
		}
	})

	console.log(`data table`, dataTable)
	//merge duplicate data nomor ttb
	const mergeData = dataTable?.reduce((acc, current) => {
		const x = acc.find((item) => item.nomor_invoice === current.nomor_invoice)
		if (!x) {
			return acc.concat([current])
		} else {
			return acc
		}
	}, [])
	const dataMap = mergeData
	const dataSource = dataMap
	return (
		<AdminPage
			authId="daftar-invoice"
			title="Daftar Invoice"
			setForm={setForm}
			action={
				<Access
					auth="write:settings-users"
					yes={
						<ul className="actions">
							<li className="action">
								<div className="form-group">
									<button className="button is-primary">
										<Link href="/keuangan/daftar-invoice/add">
											<a style={{ color: `white`, width: `100px` }}>Tambah</a>
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
