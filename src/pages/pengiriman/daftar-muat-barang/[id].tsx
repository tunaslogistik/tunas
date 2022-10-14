import { gql, useMutation, useQuery } from "@apollo/client"
import IconPrint from "@assets/icons/icon-print.svg"
import AdminPage from "@components/admin/AdminPage.component"
import { Button, message, Popconfirm, Table } from "antd"
import "antd/dist/antd.css"
import { ColumnsType } from "antd/lib/table"
import { useState } from "react"
import { useForm } from "react-hook-form"
//import icon icon-car.svg
import Dashboard from "@components/dashboard/Dashboard.component"
import Access from "@components/util/Access.component"
import useLoading from "@hooks/useLoading.hook"
import { GET_DAFTAR_TUJUAN } from "graphql/daftar_tujuan/queries"
import { GET_VECHNICLE } from "graphql/mobil/queries"
import { GET_VENDOR } from "graphql/vendor/queries"
import moment from "moment"
import Link from "next/link"
import router from "next/router"
import {
	DELETE_DAFTAR_MUAT_BARANG,
	UPDATE_DAFTAR_MUAT_BARANG
} from "../../../../graphql/daftar_muat_barang/mutations"

const GET_DATA = gql`
	query daftar_muat_barang {
		daftar_muat_barang {
			id
			nomor_muat_barang
			nomor_ttb
			total_ttb
			total_koli
			kota_tujuan
			volume
			pengirim
			koli
			posisi
			penerima
			nomor_kendaraan
			estimated_date
			nama_kapal
			tanggal_masuk
			satuan
			nama_barang
			vendor_pelayanan
			tanggal_muat_barang
			posisi
			nomor_container
			nomor_seal
		}
	}
`

interface DataType {
	nama_barang: string
	penerima: any
	pengirim: any
	tanggal_masuk: any
	id: number
	nomor_muat_barang: string
	nomor_ttb: string
	total_ttb: string
	total_koli: string
	kota_tujuan: string
	volume: string
	nomor_kendaraan: string
	vendor_pelayanan: string
	posisi: string
	nomor_container: string
	nomor_seal: string
}

export default function Home() {
	const { setLoading } = useLoading()

	const { data, loading, error } = useQuery(GET_DATA)

	//GET DATA KENDARAAN
	const { data: dataMobil } = useQuery(GET_VECHNICLE)
	//GET DATA VENDOR
	const { data: dataVendor } = useQuery(GET_VENDOR)
	//GET DATA DAFTAR TUJUAN
	const { data: dataDaftarTujuan } = useQuery(GET_DAFTAR_TUJUAN)

	const [deleteDaftar_muat_barang] = useMutation(DELETE_DAFTAR_MUAT_BARANG, {
		refetchQueries: [{ query: GET_DATA }]
	})
	const deleteData = (id) => {
		deleteDaftar_muat_barang({ variables: { deleteDaftar_muat_barangId: id } })
		router.push(`/pengiriman/daftar-muat-barang`)
	}

	const [updateDaftar_muat_barang] = useMutation(UPDATE_DAFTAR_MUAT_BARANG, {
		refetchQueries: [{ query: GET_DATA }]
	})

	const updateData = (data) => {
		updateDaftar_muat_barang({ variables: { input: data } })
	}
	//define id
	const id = router.query.id

	const setForm = useForm()

	const {
		register,
		handleSubmit,
		formState: { isDirty, errors }
	} = setForm

	//search
	const [search, setSearch] = useState(``)
	const handleSearch = (e) => {
		setSearch(e.target.value)
	}
	//make filtered data
	const filteredData = data?.daftar_muat_barang.filter((item) => {
		return (
			item.nomor_muat_barang.toLowerCase().includes(search.toLowerCase()) ||
			item.kota_tujuan.toLowerCase().includes(search.toLowerCase())
		)
	})
	//make antd table with search
	const columns: ColumnsType<DataType> = [
		{
			title: `No. TTB`,
			dataIndex: `nomor_ttb`,
			key: `nomor_ttb`,
			width: `10%`,
			align: `center`,
			sorter: (a, b) => a.nomor_ttb.localeCompare(b.nomor_ttb),
			sortDirections: [`descend`, `ascend`]
		},
		{
			title: `Tanggal masuk`,
			dataIndex: `tanggal_masuk`,
			key: `tanggal_masuk`,
			align: `center`,
			width: `10%`,
			sorter: (a, b) => a.tanggal_masuk.localeCompare(b.tanggal_masuk),
			sortDirections: [`descend`, `ascend`]
		},
		{
			title: `Pengirim`,
			dataIndex: `pengirim`,
			key: `pengirim`,
			align: `center`,
			width: `10%`,
			sorter: (a, b) => a.pengirim.localeCompare(b.pengirim),
			sortDirections: [`descend`, `ascend`]
		},
		{
			title: `Penerima`,
			dataIndex: `penerima`,
			key: `penerima`,
			width: `10%`,
			align: `center`,
			sorter: (a, b) => a.penerima.localeCompare(b.penerima),
			sortDirections: [`descend`, `ascend`]
		},
		{
			title: `Volume M³`,
			dataIndex: `volume`,
			key: `volume`,
			width: `10%`,
			align: `center`,
			sorter: (a, b) => a.volume.localeCompare(b.volume),
			sortDirections: [`descend`, `ascend`]
		},
		{
			title: `Koli`,
			dataIndex: `total_koli`,
			key: `total_koli`,
			width: `10%`,
			align: `center`,
			sorter: (a, b) => a.total_koli.localeCompare(b.total_koli),
			sortDirections: [`descend`, `ascend`]
		},
		{
			title: `TTB`,
			dataIndex: `total_ttb`,
			key: `total_ttb`,
			width: `10%`,
			align: `center`,
			sorter: (a, b) => a.total_ttb.localeCompare(b.total_ttb),
			sortDirections: [`descend`, `ascend`]
		},
		{
			title: `Nama barang`,
			dataIndex: `nama_barang`,
			key: `nama_barang`,
			width: `10%`,
			align: `center`,
			sorter: (a, b) => a.nama_barang.localeCompare(b.nama_barang),
			sortDirections: [`descend`, `ascend`]
		}
	]

	//DATA FOr table with date moment
	const dataTable = filteredData?.map((item) => {
		return {
			id: item.id,
			nomor_ttb: item.nomor_ttb,
			pengirim: item.pengirim,
			penerima: item.penerima,
			nomor_muat_barang: item.nomor_muat_barang,
			tanggal_masuk: item.tanggal_masuk,
			nama_barang: item.nama_barang,
			satuan: item.satuan,
			posisi: item.posisi,
			nomor_container: item.nomor_container,
			estimated_date: moment(item.estimated_date).format(`DD MMMM YYYY`),
			nomor_seal: item.nomor_seal,
			nomor_kendaraan: item.nomor_kendaraan,
			nama_kapal: item.nama_kapal,
			//kota tujuan where daftar tujuan equal to kode tujuan
			kota_tujuan: dataDaftarTujuan?.daftar_tujuan.find(
				(item2) => item2.kode_tujuan === item.kode_tujuan
			)?.nama_tujuan,
			tanggal_muat_barang: moment(item.tanggal_muat_barang).format(
				`DD MMMM YYYY`
			),
			volume: item.volume,
			total_koli: item.koli,
			vendor_pelayanan: item.vendor_pelayanan,
			total_ttb: item.total_ttb
		}
	})
	console.log(`data table`, dataTable)
	//merge duplicate data by nomor_ttb
	const mergeData = dataTable

	const dataMapfirst = mergeData?.filter((item) => {
		return item.id === parseInt(id as string)
	})

	const dataMap = mergeData?.filter((item) => {
		return item.nomor_muat_barang === dataMapfirst?.[0]?.nomor_muat_barang
	})

	const dataMapId = dataMap?.map((item) => {
		return item.id
	})

	const deleteAll = () => {
		dataMapId.map((item) => {
			deleteData(item)
		})
		message.success(`Data berhasil dihapus`)
	}
	//filter get data by same nomor muat barang with datama first
	async function onSubmit(formData) {
		setLoading(true)
		try {
			if (formData.vendor_pelayanan === ``) {
				formData.vendor_pelayanan = dataMapfirst?.[0].vendor_pelayanan
			}
			if (formData.nomor_container === ``) {
				formData.nomor_container = dataMapfirst?.[0].nomor_container
			}
			if (formData.nomor_seal === ``) {
				formData.nomor_seal = dataMapfirst?.[0].nomor_seal
			}
			if (formData.nomor_kendaraan === ``) {
				formData.nomor_kendaraan = dataMapfirst?.[0].nomor_kendaraan
			}
			if (formData.kota_tujuan === undefined) {
				formData.kota_tujuan = dataMapfirst?.[0].kota_tujuan
			}

			//map formdata to data map
			const dataTemp = dataMap?.map((item) => {
				return {
					id: item.id,
					nomor_ttb: item.nomor_ttb,
					pengirim: item.pengirim,
					penerima: item.penerima,
					nomor_muat_barang: item.nomor_muat_barang,
					estimated_date: String(
						moment(formData.estimasi_date).format(`DD MMMM YYYY`)
					),
					tanggal_muat_barang: String(
						moment(formData.tanggal_muat_barang).format(`DD MMMM YYYY`)
					),
					nama_barang: item.nama_barang,
					satuan: item.satuan,
					posisi: item.posisi,
					nomor_container: formData.nomor_container,
					nomor_seal: formData.nomor_seal,
					nomor_kendaraan: formData.nomor_kendaraan,
					nama_kapal: formData.nama_kapal,
					kota_tujuan: dataMapfirst?.[0]?.kota_tujuan,
					total_volume: item.total_volume,
					total_koli: item.koli,
					vendor_pelayanan: formData.vendor_pelayanan,
					total_ttb: item.total_ttb
				}
			})

			//make loop update for data table
			for (let i = 0; i < dataTemp.length; i++) {
				await updateData(dataTemp[i])
			}

			console.log(`dataTemp`, dataTemp)

			message.success(`Data Berhasil Disimpan`)
		} catch (error) {
			console.log(error)
		}
		setLoading(false)
	}

	//filter data where nomor muat barang is same by data map first && posisi = kepala
	const dataMapatas = dataTable?.filter((item) => {
		return (
			item.nomor_muat_barang === dataMapfirst[0]?.nomor_muat_barang &&
			item.posisi === `Kepala`
		)
	})

	const dataMaptengah = dataTable?.filter((item) => {
		return (
			item.nomor_muat_barang === dataMapfirst[0]?.nomor_muat_barang &&
			item.posisi === `Tengah`
		)
	})

	const dataMapbawah = dataTable?.filter((item) => {
		return (
			item.nomor_muat_barang === dataMapfirst[0]?.nomor_muat_barang &&
			item.posisi === `Bawah`
		)
	})
	const dataMapNone = dataTable?.filter((item) => {
		return (
			item.nomor_muat_barang === dataMapfirst[0]?.nomor_muat_barang &&
			item.posisi === `none`
		)
	})

	const dataSource = dataMapatas
	const dataSourceT = dataMaptengah
	const dataSourceB = dataMapbawah
	const date = moment(dataMapfirst?.[0]?.estimated_date).format(`YYYY-MM-DD`)
	const tanggal_muat_barang = moment(
		dataTable?.[0]?.tanggal_muat_barang
	).format(`YYYY-MM-DD`)

	console.log(`dataMapfirst`, dataSource)

	return (
		<AdminPage
			parent={
				<Link href="/pengiriman/daftar-muat-barang">
					<a>Daftar Muat Barang</a>
				</Link>
			}
			authId=""
			title="Edit Muat Barang"
			setForm={setForm}
			action={
				<Access
					auth="write:settings-users"
					yes={
						<ul className="actions">
							<li className="action">
								<Popconfirm
									title="Are you sure delete this task?"
									className="button is-primary"
									onConfirm={() => deleteAll()}
								>
									<Button
										type="primary"
										style={{
											backgroundColor: `white`,
											borderColor: `black`,
											color: `black`,
											marginLeft: `1%`
										}}
									>
										Delete
									</Button>
								</Popconfirm>
							</li>
							<li className="action">
								<button
									className="button button-small button-white button-icon"
									style={{
										backgroundColor: `white`
									}}
									//dispatch
									onClick={() => {
										window.open(
											`/pengiriman/daftar-muat-barang/print/${id}`,
											`_blank`
										)
									}}
								>
									<i
										className="icon"
										role="img"
										style={{
											marginTop: `-5px`,
											height: `33px`,
											width: `100px`
										}}
									>
										<IconPrint className="svg" />
									</i>
								</button>
							</li>
							<li className="action">
								<Button
									key="submit"
									htmlType="submit"
									className="submit"
									form="formMB"
									style={{
										backgroundColor: `black`,
										borderColor: `black`
									}}
									type="primary"
								>
									Simpan
								</Button>
							</li>
						</ul>
					}
				/>
			}
		>
			<section className="section">
				<div className="container">
					<form className="form" id="formMB" onSubmit={handleSubmit(onSubmit)}>
						<div className="admin-section" style={{ paddingTop: `4%` }}>
							<div style={{ overflowX: `scroll` }}>
								<Table
									style={{ marginBottom: `-50px` }}
									rowKey="id"
									columns={columns}
									dataSource={dataMapNone}
									pagination={false}
									loading={loading}
									locale={{
										emptyText: (
											<div
												style={{
													justifyContent: `center`,
													alignItems: `center`,
													height: `100%`
												}}
											></div>
										)
									}}
								/>
								<Table
									title={() => (
										<div
											style={{
												display: `flex`,
												justifyContent: `space-between`,
												alignItems: `center`
											}}
										>
											<h6 style={{ marginLeft: `480px`, width: `100%` }}>
												Depan (Kepala)
											</h6>
										</div>
									)}
									rowKey="id"
									columns={columns}
									dataSource={dataSource}
									pagination={false}
									showHeader={false}
									loading={loading}
									locale={{
										emptyText: (
											<div
												style={{
													display: `flex`,
													justifyContent: `center`,
													alignItems: `center`,
													height: `100%`
												}}
											></div>
										)
									}}
								/>
								<Table
									title={() => (
										<div
											style={{
												display: `flex`,
												justifyContent: `space-between`,
												alignItems: `center`
											}}
										>
											<h6 style={{ marginLeft: `500px` }}>Tengah</h6>
										</div>
									)}
									rowKey="id"
									columns={columns}
									dataSource={dataSourceT}
									loading={loading}
									pagination={false}
									showHeader={false}
									locale={{
										emptyText: (
											<div
												style={{
													display: `flex`,
													justifyContent: `center`,
													alignItems: `center`,
													height: `100%`
												}}
											></div>
										)
									}}
								/>
								<Table
									title={() => (
										<div
											style={{
												display: `flex`,
												justifyContent: `space-between`,
												alignItems: `center`
											}}
										>
											<h6 style={{ marginLeft: `500px` }}>Belakang (Pintu)</h6>
										</div>
									)}
									rowKey="id"
									columns={columns}
									dataSource={dataSourceB}
									pagination={false}
									loading={loading}
									showHeader={false}
									//outline border
									locale={{
										emptyText: (
											<div
												style={{
													display: `flex`,
													justifyContent: `center`,
													alignItems: `center`,
													height: `100%`
												}}
											></div>
										)
									}}
								/>
							</div>
						</div>
						<div
							className="field"
							style={{
								display: `inline-block`,
								marginTop: `2%`,
								width: `calc(50% - 8px)`
							}}
						>
							<label
								style={{ fontWeight: `bolder`, marginTop: `30%` }}
								className="label"
							>
								Tanggal Muat Barang
							</label>
							<div className="control">
								<input
									style={{
										width: `100%`
									}}
									className="input"
									type="date"
									defaultValue={tanggal_muat_barang}
									placeholder="tanggal muat barang"
									{...register(`tanggal_muat_barang`)}
									required
								/>
							</div>
						</div>
						<div
							className="field"
							style={{ display: `inline-block`, width: `calc(50% - 8px)` }}
						>
							<label
								style={{
									fontWeight: `bolder`,
									marginTop: `30%`,
									marginLeft: `2%`
								}}
								className="label"
							>
								Nama Kapal
							</label>
							<div className="control">
								<input
									style={{
										display: `inline-block`,
										width: `calc(120% - 8px)`,
										margin: `0 8px`
									}}
									className="input"
									type="text"
									defaultValue={dataMapfirst?.[0]?.nama_kapal}
									placeholder="Nama Kapal"
									{...register(`nama_kapal`)}
								/>
							</div>
						</div>
						<div
							className="field"
							style={{
								display: `inline-block`,
								marginTop: `2%`,
								width: `calc(50% - 8px)`
							}}
						>
							<label
								style={{ fontWeight: `bolder`, marginTop: `30%` }}
								className="label"
							>
								No Kendaraan
							</label>
							<div className="control">
								<select
									style={{
										display: `inline-block`,
										width: `100%`
									}}
									className="input"
									placeholder="Nomor kendaraan"
									{...register(`nomor_kendaraan`)}
								>
									<option value={dataMapfirst?.[0]?.nomor_kendaraan}>
										{dataMapfirst?.[0]?.nomor_kendaraan}
									</option>
									{dataMobil?.vechnicle.map((item, index) => {
										return (
											<option key={index} value={item.nomor_kendaraan}>
												{item.nomor_kendaraan}
											</option>
										)
									})}
								</select>
							</div>
						</div>

						<div
							className="field"
							style={{ display: `inline-block`, width: `calc(50% - 8px)` }}
						>
							<label
								style={{
									fontWeight: `bolder`,
									marginTop: `30%`,
									marginLeft: `2%`
								}}
								className="label"
							>
								Vendor Pelayaran
							</label>
							<div className="control">
								<select
									style={{
										display: `inline-block`,
										width: `calc(120% - 8px)`,
										margin: `0 8px`
									}}
									className="input"
									placeholder="Vendor pelayanan"
									{...register(`vendor_pelayanan`)}
								>
									<option value={dataMapfirst?.[0]?.vendor_pelayanan}>
										{dataMapfirst?.[0]?.vendor_pelayanan}
									</option>
									{dataVendor?.vendor.map((item, index) => {
										return (
											<option key={index} value={item.nama_vendor}>
												{item.nama_vendor}
											</option>
										)
									})}
								</select>
							</div>
						</div>
						<div
							className="field"
							style={{
								display: `inline-block`,
								width: `calc(50% - 8px)`,
								marginTop: `2%`
							}}
						>
							<label
								style={{ fontWeight: `bolder`, marginTop: `30%` }}
								className="label"
							>
								No container
							</label>
							<div className="control">
								<input
									style={{ width: `100%` }}
									className="input"
									type="text"
									defaultValue={dataMapfirst?.[0]?.nomor_container}
									placeholder="nomor container"
									{...register(`nomor_container`)}
								/>
							</div>
						</div>
						<div
							className="field"
							style={{ display: `inline-block`, width: `calc(50% - 8px)` }}
						>
							<label
								style={{
									fontWeight: `bolder`,
									marginTop: `30%`,
									marginLeft: `2%`
								}}
								className="label"
							>
								Nomor Seal
							</label>
							<div className="control">
								<input
									style={{
										display: `inline-block`,
										width: `calc(120% - 8px)`,
										margin: `0 8px`
									}}
									className="input"
									type="text"
									defaultValue={dataMapfirst?.[0]?.nomor_seal}
									placeholder="nomor seal"
									{...register(`nomor_seal`)}
								/>
							</div>
						</div>
						<div className="field" style={{ marginTop: `2%` }}>
							<label
								style={{ fontWeight: `bolder`, marginTop: `30%` }}
								className="label"
							>
								Tanggal Estimasi
							</label>
							<div className="control">
								<input
									style={{
										width: `100%`
									}}
									className="input"
									type="date"
									defaultValue={date}
									placeholder="tanggal estimasi"
									{...register(`estimasi_date`)}
									required
								/>
							</div>
						</div>
					</form>
				</div>
			</section>
		</AdminPage>
	)
}
Home.getLayout = function getLayout(page) {
	return <Dashboard>{page}</Dashboard>
}
