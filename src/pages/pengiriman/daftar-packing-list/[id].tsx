import { gql, useQuery } from "@apollo/client"
import IconPrint from "@assets/icons/icon-print.svg"
import AdminPage from "@components/admin/AdminPage.component"
import Dashboard from "@components/dashboard/Dashboard.component"
import Access from "@components/util/Access.component"
import "antd/dist/antd.css"
import Table, { ColumnsType } from "antd/lib/table"
import { GET_DAFTAR_TTB } from "graphql/daftar_ttb/queries"
import Link from "next/link"
import router from "next/router"
import { useForm } from "react-hook-form"
//import icon icon-car.svg

//get DATA

const GET_DATA = gql`
	query daftar_packing_list {
		daftar_packing_list {
			id
			nomor_muat_barang
			nomor_ttb
			total_ttb
			total_koli
			pengirim
			kota_tujuan
			total_volume
			nomor_kendaraan
			vendor_pelayanan
			posisi
			nomor_container
			tanggal_masuk
			nomor_seal
		}
	}
`

interface DataType {
	rowSpan: any
	enabled: any
	koli: any
	nama_barang: any
	alamat_penerima: any
	penerima: any
	tanggal_pengiriman: any
	nama_kapal: any
	nomor_surat_jalan: any
	pengirim: any
	id: number
	nomor_muat_barang: string
	nomor_ttb: string
	total_ttb: string
	tanggal_masuk: string
	total_koli: string
	kota_tujuan: string
	total_volume: string
	nomor_kendaraan: string
	vendor_pelayanan: string
	posisi: string
	nomor_container: string
	nomor_seal: string
}

export default function Home() {
	const { data, loading } = useQuery(GET_DATA)

	//get data ttb
	const { data: dataTtb } = useQuery(GET_DAFTAR_TTB)

	const setForm = useForm()
	const {} = setForm

	const id = router.query.id
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

	//DATA FOr table with date momen

	//filter data table by id
	const filteredDataById = data?.daftar_packing_list?.filter((item) => {
		return item.id === parseInt(id as string)
	})

	const filterpackinglist = data?.daftar_packing_list?.filter((item) => {
		return item.nomor_muat_barang === filteredDataById?.[0]?.nomor_muat_barang
	})

	//get all nomor ttb filterpackinglist
	const nomorTtb = filterpackinglist?.map((item) => {
		return item.nomor_ttb
	})

	//get all dataTTb by nomorTtb
	const dataTtbByNomorTtb = dataTtb?.daftar_ttb?.filter((item) => {
		return nomorTtb?.includes(item.ttb_number)
	})

	const mergeSimilarRows = (rowsData = []) => {
		const pageSize = 10
		const uniqueUserIdsPerPage = new Set()
		let pageNo = 0
		const mergedData = rowsData.map((rowData, index) => {
			const updatedRowsData = { ...rowData }
			if (index !== 0 && index % pageSize === 0) {
				uniqueUserIdsPerPage.clear()
				pageNo += 1
			}
			if (uniqueUserIdsPerPage.has(rowData.nama_penerima)) {
				updatedRowsData.rowSpan = 0
			} else {
				const occurCount = rowsData
					.slice(pageNo * pageSize, (pageNo + 1) * pageSize)
					.filter((data) => data.nama_penerima === rowData.nama_penerima).length
				updatedRowsData.rowSpan = Math.min(pageSize, occurCount)
				uniqueUserIdsPerPage.add(rowData.nama_penerima)
			}
			return updatedRowsData
		})
		return mergedData
	}

	const datasource = mergeSimilarRows(dataTtbByNomorTtb)

	console.log(`dataTtbByNomorTtb`, dataTtbByNomorTtb)

	const columns2: ColumnsType<DataType> = [
		{
			title: `Penerima/alamat`,
			dataIndex: `nama_penerima`,
			key: `nama_penerima`,
			width: `20%`,
			sortDirections: [`descend`, `ascend`],
			render: (value, row) => {
				const obj = {
					children: value,
					props: {
						colSpan: 1,
						rowSpan: row.rowSpan
					}
				}
				return obj
			}
		},
		{
			title: `Jumlah Koli`,
			dataIndex: `koli`,
			key: `koli`,
			width: `20%`,
			sortDirections: [`descend`, `ascend`]
		},
		{
			title: `Jenis Barang`,
			dataIndex: `nama_barang`,
			key: `nama_barang`,
			width: `20%`,
			sortDirections: [`descend`, `ascend`]
		}
	]
	//merge data packing list no.container/no.seal/tanggal_masuk with moment date month year in 1 line string
	const mergeData = filterpackinglist?.map((item) => {
		return {
			...item,
			no_container: `${item.nomor_container}/${item.nomor_seal}/${item.tanggal_masuk}`
		}
	})
	return (
		<AdminPage
			parent={
				<Link href="/pengiriman/daftar-packing-list">
					<a>Dafar Packing List</a>
				</Link>
			}
			authId=""
			title="Edit Packing List"
			setForm={setForm}
			action={
				<Access
					auth="write:settings-users"
					yes={
						<ul className="actions">
							<li className="action">
								<button
									type="button"
									className="button button-small button-white button-icon"
									style={{
										backgroundColor: `white`
									}}
									//dispatch
									onClick={() => {
										window.open(
											`/pengiriman/daftar-packing-list/print/${id}`,
											`_blank`
										)
									}}
								>
									<i
										className="icon"
										role="img"
										style={{ height: `30px`, width: `100px` }}
									>
										<IconPrint className="svg" />
									</i>
								</button>
							</li>
						</ul>
					}
				/>
			}
		>
			<section className="section">
				<div>
					<span style={{ fontWeight: `bold` }}> TKP LOGISTIK</span>
					<br />
					<span>{mergeData?.[0]?.no_container}</span>
				</div>

				<div className="form-group">
					<div className="admin-section">
						<div
							className="relative"
							style={{ overflowX: `scroll`, marginTop: `20px` }}
						></div>
						<div style={{ width: `75%`, marginTop: `20px` }}>
							<Table
								rowKey="id"
								rowClassName={(record) => !record.enabled && `disabled-row`}
								columns={columns2}
								dataSource={datasource}
								pagination={false}
								loading={loading}
								scroll={{ x: `max-content` }}
							/>
						</div>
					</div>
				</div>
			</section>
		</AdminPage>
	)
}
Home.getLayout = function getLayout(page) {
	return <Dashboard>{page}</Dashboard>
}
