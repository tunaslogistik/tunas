import { gql, useQuery } from "@apollo/client"
import AdminPage from "@components/admin/AdminPage.component"
import Dashboard from "@components/dashboard/Dashboard.component"
import Access from "@components/util/Access.component"
import { Table } from "antd"

import Link from "next/link"
import router from "next/router"
import { useState } from "react"
import { useForm } from "react-hook-form"

//get DATA

const GET_DATA = gql`
	query DaftarHarga {
		daftar_harga {
			id
			kode_asal
			kode_tujuan
			jenis_pengiriman
			harga
			minimal_kubik
			creator
			updated_by
		}
	}
`

export default function Home() {
	const { data, loading } = useQuery(GET_DATA)

	const setForm = useForm()
	//search

	const [search, setSearch] = useState(``)
	const handleSearch = (e) => {
		setSearch(e.target.value)
	}
	//make filtered data
	const filteredData = data?.daftar_harga.filter((item) => {
		return (
			item.kode_asal.toLowerCase().includes(search.toLowerCase()) ||
			item.kode_tujuan.toLowerCase().includes(search.toLowerCase())
		)
	})

	//DATA FOr table with date moment
	const dataTable = filteredData?.map((item) => {
		return {
			id: item.id,
			kode_asal: item.kode_asal,
			kode_tujuan: item.kode_tujuan,
			jenis_pengiriman: item.jenis_pengiriman,
			harga: item.harga?.toLocaleString(`id-ID`, {
				style: `currency`,
				currency: `IDR`
			}),
			minimal_kubik: item.minimal_kubik,
			creator: item.creator,
			updated_by: item.updated_by
		}
	})

	//map and filter same value
	const mapDataTable = dataTable?.map((item) => {
		return {
			id: item.id,
			kode_asal: item.kode_asal,
			kode_tujuan: item.kode_tujuan,
			jenis_pengiriman: item.jenis_pengiriman,
			harga: item.harga,
			minimal_kubik: item.minimal_kubik,
			creator: item.creator,
			updated_by: item.updated_by
		}
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
			if (uniqueUserIdsPerPage.has(rowData.kode_asal)) {
				updatedRowsData.rowSpan = 0
			} else {
				const occurCount = rowsData
					.slice(pageNo * pageSize, (pageNo + 1) * pageSize)
					.filter(
						(data) =>
							data.kode_asal === rowData.kode_asal &&
							data.kode_tujuan === rowData.kode_tujuan
					).length
				updatedRowsData.rowSpan = Math.min(pageSize, occurCount)
				uniqueUserIdsPerPage.add(rowData.kode_asal)
			}
			return updatedRowsData
		})
		return mergedData
	}

	function fieldSorter(fields) {
		return function (a, b) {
			return fields
				.map(function (o) {
					var dir = 1
					if (o[0] === `-`) {
						dir = -1
						o = o.substring(1)
					}
					if (a[o] > b[o]) return dir
					if (a[o] < b[o]) return -dir
					return 0
				})
				.reduce(function firstNonZeroValue(p, n) {
					return p ? p : n
				}, 0)
		}
	}

	const store = mapDataTable?.sort(fieldSorter([`kode_asal`, `-kode_tujuan`]))
	const updatedRowsData2 = mergeSimilarRows(store)
	const merged = updatedRowsData2
	//count duplicate merged kode_asal and kode_tujuan
	const countDuplicate = (arr) => {
		const counts = {}
		arr.forEach(function (x) {
			counts[x] = (counts[x] || 0) + 1
		})
		return counts
	}
	const countDuplicateMerged = countDuplicate(
		updatedRowsData2.map((item) => item.kode_asal + item.kode_tujuan)
	)

	// for (let i = 0; i < merged.length; i++) {
	// 	if (merged[i].kode_asal + merged[i].kode_tujuan in countDuplicateMerged) {
	// 		merged[i].rowSpan =
	// 			countDuplicateMerged[merged[i].kode_asal + merged[i].kode_tujuan]
	// 	}
	// }
	for (let i = 1; i < merged.length; i++) {
		const j = i - 1
		if (
			(merged[j].kode_asal !== merged[i].kode_asal ||
				merged[j].kode_tujuan !== merged[i].kode_tujuan) &&
			merged[j].rowSpan === 0
		) {
			merged[i].rowSpan =
				countDuplicateMerged[merged[i].kode_asal + merged[i].kode_tujuan]
		}
		if (
			(merged[j].kode_asal !== merged[i].kode_asal ||
				merged[j].kode_tujuan !== merged[i].kode_tujuan) &&
			merged[i].rowSpan === 0
		) {
			merged[i].rowSpan =
				countDuplicateMerged[merged[i].kode_asal + merged[i].kode_tujuan]
		}
	}

	const dataSource = merged
	//make antd table with search
	const columns = [
		{
			title: `Kode asal`,
			dataIndex: `kode_asal`,
			colSpan: 1,
			width: `20%`,
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
			title: `Kode tujuan`,
			dataIndex: `kode_tujuan`,
			colSpan: 1,
			width: `20%`,
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
			title: `Jenis Pengiriman`,
			dataIndex: `jenis_pengiriman`,
			key: `jenis_pengiriman`,
			width: `20%`
		},
		{
			title: `Harga`,
			dataIndex: `harga`,
			key: `harga`,
			width: `20%`
		},
		{
			title: `Minimal Kubik`,
			dataIndex: `minimal_kubik`,
			key: `minimal_kubik`,
			width: `20%`
		}
		// {
		// 	title: "Action",
		// 	key: "action",
		// 	//disable onRowClick
		// 	render: (text, record) => (
		// 		<span>
		// 			<a
		// 				href={`/data/daftar-harga/${record.id}`}
		// 				style={{ marginRight: "10px" }}
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

	return (
		<AdminPage
			authId="daftar-harga"
			title="Daftar Harga"
			setForm={setForm}
			action={
				<Access
					auth="write:settings-users"
					yes={
						<ul className="actions">
							<li className="action">
								<div className="form-group">
									<button className="button is-primary">
										<Link href="/data/daftar-harga/add">
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
							//when click redirect to edit page but not in action col
							onRow={(record, rowIndex) => {
								return {
									onClick: (event) => {
										router.push(`/data/daftar-harga/${record.id}`)
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
