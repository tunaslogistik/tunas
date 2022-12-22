import { gql, useMutation, useQuery } from "@apollo/client"
import IconPrint from "@assets/icons/icon-print.svg"
import AdminPage from "@components/admin/AdminPage.component"
import Dashboard from "@components/dashboard/Dashboard.component"
import FormRepeater from "@components/form/FormRepeater.component"
import Access from "@components/util/Access.component"
import { DashboardContext } from "@contexts/DashboardContext.context"
import { yupResolver } from "@hookform/resolvers/yup"
import useLoading from "@hooks/useLoading.hook"
import { Button, Popconfirm, message } from "antd"
import { GET_CUSTOMER } from "graphql/customer/queries"
import { GET_DAFTAR_TUJUAN } from "graphql/daftar_tujuan/queries"
import { GET_JENIS_PENGIRIMAN } from "graphql/jenis_pengiriman/queries"
import moment from "moment"
import Link from "next/link"
import { useRouter } from "next/router"
import { useContext } from "react"
import { useForm } from "react-hook-form"
import * as yup from "yup"
import {
	CREATE_DAFTAR_TTB,
	DELETE_DAFTAR_TTB
} from "../../../../graphql/daftar_ttb/mutations"
import { jenis_pengiriman } from "../../../../graphql/jenis_pengiriman/index"

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
			nama_barang
			container_size
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

const schema = yup.object({})
export default function Home() {
	const { dispatch } = useContext(DashboardContext)

	const { state: dashboardState } = useContext(DashboardContext)

	const username = dashboardState.auth.username

	const role = dashboardState.auth.userRole?.name

	console.log(`role: `, role)

	console.log(`username: `, username)

	const { setLoading } = useLoading()
	const setForm = useForm({
		resolver: yupResolver(schema)
	})
	const { control, reset, handleSubmit, register } = setForm

	const router = useRouter()
	const id = router.query.id
	const { data } = useQuery(GET_DATA, {
		onCompleted({ daftar_ttb }) {
			const data = daftar_ttb
			const filteredData = daftar_ttb?.filter(
				(item) => item.id === parseInt(id as string)
			)
			const ttb_number = filteredData[0]?.ttb_number
			const pengirim = filteredData[0]?.pengirim
			//filter by kode_t
			var newArray = data.filter(function (el) {
				return el.ttb_number === ttb_number && el.pengirim === pengirim
			})

			reset({ newArray })
		}
	})
	//GET DATA JENIS PENGIRIMAN
	const { data: dataJenisPengiriman } = useQuery(GET_JENIS_PENGIRIMAN)
	//GET DATA DAFTAR TUJUAN
	const { data: dataDaftarTujuan } = useQuery(GET_DAFTAR_TUJUAN)
	//GET DATA CUSTOMER
	const { data: dataCustomer } = useQuery(GET_CUSTOMER)

	const [createDaftar_ttb] = useMutation(CREATE_DAFTAR_TTB, {
		refetchQueries: [{ query: GET_DATA }]
	})

	//create mutation function
	const createData = (data) => {
		createDaftar_ttb({ variables: { input: data } })
	}

	const [deleteDaftar_ttb] = useMutation(DELETE_DAFTAR_TTB, {
		refetchQueries: [{ query: GET_DATA }]
	})
	const deleteData = (id) => {
		deleteDaftar_ttb({ variables: { deleteDaftar_ttbId: id } })
		router.push(`/order/daftar-ttb`)
	}

	//GET DATA ttb number where id eqaul to id
	const dataTTB = data?.daftar_ttb?.filter(
		(item) => item.id === parseInt(id as string)
	)

	//get ttb number
	const ttbNumber = dataTTB?.[0]?.ttb_number

	//filter data by ttb number
	const dataFilter = data?.daftar_ttb?.filter(
		(item) => item.ttb_number === ttbNumber
	)

	//store all data filter id
	const dataFilterId = dataFilter?.map((item) => item.id)

	//delete all
	const deleteAll = () => {
		// eslint-disable-next-line array-callback-return
		dataFilterId.map((item) => {
			deleteData(item)
		})
		//mesage
		message.success(`Data berhasil dihapus`)
	}

	async function onSubmit(formData) {
		setLoading(true)
		try {
			const objArray = Object.keys(formData).map((i) => formData[i])

			const myChildren = objArray

			const datas = myChildren.shift()
			const temp = datas.map((datum) => {
				return {
					ttb_number: dataTTB?.[0]?.ttb_number,
					pengirim: formData.pengirim,
					kota_tujuan: formData.kota_tujuan,
					tanggal_diterima: String(formData.tanggal_keberangkatan),
					nama_penerima: formData.nama_penerima,
					jenis_pengiriman: formData.jenis_pengiriman,
					nomor_telepon: formData.nomor_telepon,
					nama_barang: datum.nama_barang,
					container_size: String(formData.container_size),
					panjang: parseInt(datum.panjang),
					lebar: parseInt(datum.lebar),
					tinggi: parseInt(datum.tinggi),
					koli: parseInt(datum.koli),
					total_volume: sum,
					alamat_tujuan: formData.alamat_tujuan,
					status: `TTB`,
					kategori: String(formData.kategori),
					full_container: String(formData.full_container)
				}
			})

			const sum = temp.reduce((accumulator, object) => {
				return (
					accumulator +
					object.panjang * object.lebar * object.tinggi * object.koli
				)
			}, 0)
			for (let i = 0; i < temp.length; i++) {
				if (temp[i].full_container === `true`) {
					temp[i].full_container = `Full Container`
				}
				if (
					temp[i].full_container === `false` ||
					temp[i].full_container === undefined ||
					temp[i].full_container === ``
				) {
					temp[i].full_container = `Kontainer Tidak Penuh`
				}

				if (temp[i].kategori === `true`) {
					temp[i].kategori = `Barang Berbahaya`
				}
				if (
					temp[i].kategori === `false` ||
					temp[i].kategori === undefined ||
					temp[i].kategori === ``
				) {
					temp[i].kategori = `Barang Tidak Berbahaya`
				}
				temp[i].total_volume = sum
			}

			//create new data
			for (let i = 0; i < temp.length; i++) {
				createData(temp[i])
			}
			//delete datafilterid
			// eslint-disable-next-line array-callback-return
			dataFilterId.map((item) => {
				deleteData(item)
			})
			message.success(`Data Berhasil Disimpan`)
			router.push(`/order/daftar-ttb`)
		} catch (error) {
			console.log(error)
		}
		setLoading(false)
	}

	//map data jenis pengiriman
	const mapJenisPengiriman = dataJenisPengiriman?.jenis_pengiriman?.map(
		(jenis_pengiriman) => {
			return {
				label: jenis_pengiriman.nama_pengiriman
			}
		}
	)

	//map data filter
	// const mapDataFilter = dataFilter
	// 	?.map((item) => {
	// 		return {
	// 			ttb_number: dataTTB?.[0]?.ttb_number,
	// 			pengirim: item.pengirim,
	// 			kota_tujuan: item.kota_tujuan,
	// 			tanggal_diterima: item.tanggal_diterima,
	// 			nama_penerima: item.nama_penerima,
	// 			jenis_pengiriman: item.jenis_pengiriman,
	// 			nomor_telepon: item.nomor_telepon,
	// 			nama_barang: item.nama_barang,
	// 			panjang: item.panjang,
	// 			lebar: item.lebar,
	// 			tinggi: item.tinggi,
	// 			koli: item.koli,
	// 			alamat_tujuan: item.alamat_tujuan,
	// 			status: `TTB`,
	// 			kategori: item.kategori,
	// 			full_container: item.full_container
	// 		}
	// 	})
	// 	.reverse()

	//map data tujuan
	const mapTujuan = dataDaftarTujuan?.daftar_tujuan?.map((tujuan) => {
		return {
			label: tujuan.kode_tujuan
		}
	})

	//map data customer
	const mapCustomer = dataCustomer?.customer?.map((customer) => {
		return {
			label: customer.nama_customer
		}
	})

	const date = moment(dataTTB?.[0]?.tanggal_diterima).format(`YYYY-MM-DD`)

	return (
		<AdminPage
			parent={
				<Link href="/order/daftar-ttb">
					<a>Daftar TTB</a>
				</Link>
			}
			authId=""
			title="Edit TTB"
			legend=""
			setForm={setForm}
			action={
				<Access
					auth="write:settings-users"
					yes={
						<ul className="actions">
							{role === `superadmin` || role === `Super Admin` ? (
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
							) : null}
							<li className="action">
								<button
									className="button button-small button-white button-icon"
									style={{
										backgroundColor: `white`
									}}
									//dispatch
									onClick={() => {
										dispatch({ type: `set_idInvoice`, payload: id as string })
										window.open(`/order/daftar-ttb/print/${id}`, `_blank`)
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
							{role === `superadmin` || role === `Super Admin` ? (
								<li className="action">
									<Button
										key="submit"
										htmlType="submit"
										className="submit"
										form="formTTB"
										style={{
											backgroundColor: `black`,
											borderColor: `black`
										}}
										type="primary"
									>
										Simpan
									</Button>
								</li>
							) : null}
						</ul>
					}
				/>
			}
		>
			<section className="section">
				<div className="card-content">
					<form id="formTTB" onSubmit={handleSubmit(onSubmit)}>
						<div className="control">
							<label style={{ fontWeight: `bold` }} className="label">
								Tanggal Diterima
							</label>
							<div className="control">
								<input
									style={{
										width: `100%`,
										height: `38px`
									}}
									className="input"
									defaultValue={date}
									placeholder="Tanggal Keberangkatan"
									type="date"
									{...register(`tanggal_keberangkatan`)}
									required
								/>
							</div>
						</div>
						<div className="form-group" style={{ paddingTop: `1%` }}>
							<label style={{ fontWeight: `bold` }} className="label">
								Pengirim
							</label>
							<select
								className="form-control"
								name="pengirim"
								{...register(`pengirim`)}
								style={{ width: `100%` }}
								required
							>
								<option
									key={dataTTB?.[0]?.pengirim}
									value={dataTTB?.[0]?.pengirim}
								>
									{dataTTB?.[0]?.pengirim}
								</option>
								{mapCustomer?.map((customer) => (
									<option key={customer.label} value={customer.label}>
										{customer.label}
									</option>
								))}
							</select>
						</div>
						<div
							className="form-group"
							style={{
								display: `inline-block`,
								width: `calc(50% - 8px)`,
								marginTop: `1%`
							}}
						>
							<label style={{ fontWeight: `bold` }} className="label">
								Nama Penerima
							</label>
							<input
								type="text"
								style={{ width: `100%` }}
								defaultValue={dataTTB?.[0]?.nama_penerima}
								id="nama_penerima"
								{...register(`nama_penerima`)}
								required
							/>
						</div>
						<div
							className="form-group"
							style={{
								display: `inline-block`,
								width: `calc(50% - 8px)`,
								marginTop: `1%`,
								marginLeft: `15px`
							}}
						>
							<label style={{ fontWeight: `bold` }} className="label">
								Nomor Telepon
							</label>
							<input
								type="text"
								style={{ width: `100%` }}
								defaultValue={dataTTB?.[0]?.nomor_telepon}
								id="nomor_telepon"
								{...register(`nomor_telepon`)}
								required
							/>
						</div>
						<div
							className="form-group"
							style={{
								display: `inline-block`,
								width: `calc(50% - 8px)`,
								marginTop: `1%`
							}}
						>
							<label style={{ fontWeight: `bold` }} className="label">
								Kota Tujuan
							</label>
							<select
								{...register(`kota_tujuan`)}
								style={{ width: `100%` }}
								required
							>
								<option value={dataTTB?.[0]?.kota_tujuan}>
									{dataTTB?.[0]?.kota_tujuan}
								</option>
								{mapTujuan?.map((tujuan) => {
									return (
										<option key={tujuan.label} value={tujuan.label}>
											{tujuan.label}
										</option>
									)
								})}
							</select>
						</div>
						<div
							className="form-group"
							style={{
								display: `inline-block`,
								width: `calc(50% - 8px)`,
								marginTop: `1%`,
								marginLeft: `15px`
							}}
						>
							<label style={{ fontWeight: `bold` }} className="label">
								Jenis Pengiriman
							</label>
							<select
								{...register(`jenis_pengiriman`)}
								style={{ width: `100%` }}
								required
							>
								<option value={dataTTB?.[0]?.jenis_pengiriman}>
									{dataTTB?.[0]?.jenis_pengiriman}
								</option>
								{mapJenisPengiriman?.map((jenisPengiriman) => {
									return (
										<option
											key={jenisPengiriman.label}
											value={jenisPengiriman.label}
										>
											{jenis_pengiriman ? jenisPengiriman.label : ``}
										</option>
									)
								})}
							</select>
						</div>
						<div className="form-group" style={{ paddingTop: `1%` }}>
							<label style={{ fontWeight: `bold` }} className="label">
								Alamat Tujuan
							</label>
							<textarea
								style={{ width: `100%` }}
								defaultValue={dataTTB?.[0]?.alamat_tujuan}
								id="alamat_tujuan"
								{...register(`alamat_tujuan`)}
								required
							/>
						</div>
						<div className="form-group" style={{ paddingTop: `1%` }}>
							<label style={{ fontWeight: `bold` }} className="label">
								Container Size
							</label>
							<input
								type="text"
								style={{ width: `100%` }}
								defaultValue={dataTTB?.[0]?.container_size}
								id="container_size"
								{...register(`container_size`)}
								required
							/>
						</div>
						<div
							style={{ marginTop: `10px`, marginLeft: `-5px` }}
							className="content"
						>
							<label
								style={{ fontWeight: `bold`, paddingLeft: `5px` }}
								className="label"
							>
								List Barang
							</label>
							<FormRepeater
								setForm={setForm}
								control={control}
								register={register}
								name="newArray"
								inputNames={[
									`nama_barang`,
									`panjang`,
									`lebar`,
									`tinggi`,
									`koli`
								]}
								inputLabels={[
									`Nama Barang`,
									`Panjang`,
									`Lebar`,
									`Tinggi`,
									`Koli`
								]}
								inputProps={[
									{
										type: `text`,
										placeholder: `Nama Barang`,
										style: { width: `400px`, marginLeft: `0px` }
									},
									{
										type: `text`,
										placeholder: `panjang`,
										style: { width: `100%`, marginLeft: `0px` }
									},
									{
										type: `text`,
										placeholder: `lebar`,
										style: { width: `100%`, marginLeft: `0px` }
									},
									{
										type: `text`,
										placeholder: `tinggi`,
										style: { width: `100%` }
									},
									{
										type: `text`,
										placeholder: `koli`,
										style: { width: `100%`, marginLeft: `0px` }
									}
								]}
							/>
						</div>
						<div
							className="form-group"
							style={{ paddingTop: `1%`, display: `flex`, width: `100%` }}
						>
							<div className="form-group">
								<input
									type="checkbox"
									{...register(`kategori`)}
									style={{ height: `20px`, width: `20px` }}
								/>
							</div>
							<div style={{ fontWeight: `bold`, marginLeft: `1%` }}>
								<h6>Barang Berbahaya</h6>
							</div>
						</div>
						<div
							className="form-group"
							style={{ paddingTop: `1%`, display: `flex`, width: `100%` }}
						>
							<div className="form-group">
								<input
									type="checkbox"
									{...register(`full_container`)}
									style={{ height: `20px`, width: `20px` }}
								/>
							</div>
							<div style={{ fontWeight: `bold`, marginLeft: `1%` }}>
								<h6>Full Container</h6>
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
