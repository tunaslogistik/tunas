import { gql, useMutation, useQuery } from "@apollo/client"
import AdminPage from "@components/admin/AdminPage.component"
import Dashboard from "@components/dashboard/Dashboard.component"
import Access from "@components/util/Access.component"
import { DashboardContext } from "@contexts/DashboardContext.context"
import { Button, message, Popconfirm } from "antd"
import "antd/dist/antd.css"
import moment from "moment"
import Link from "next/link"
import { useRouter } from "next/router"
import { useContext } from "react"
import { useForm } from "react-hook-form"
import {
	DELETE_VECHNICLE,
	UPDATE_VECHNICLE
} from "../../../../graphql/mobil/mutations"
//get data using id
const GET_DATA = gql`
	query Vechicle {
		vechnicle {
			id
			nomor_kendaraan
			tipe_kendaraan
			nama_supir
			nama_kenek
			status
			last_update
			creator
			updated_by
		}
	}
`

//button on the right style
const buttonStyle = {
	color: `black`,
	backgroundColor: `transparent`,
	border: `1px solid black`,
	marginLeft: `900px`,
	marginBottom: `30px`
}

//text input style
const inputStyle = {
	width: `100%`,
	marginBottom: `10px`,
	fontSize: `14px`
}

const inputStyles = {
	width: `100%`,
	marginBottom: `10px`,
	fontSize: `14px`,
	fontWeight: `bold`
}

interface DataType {
	id: number
}

//const form style
const buttonStylee = {
	color: `white`,
	backgroundColor: `#1890ff`,
	//no outline
	border: `none`,
	//size
	width: `100px`,
	height: `30px`
}

export default function SettingUserEdit() {
	const { state: dashboardState } = useContext(DashboardContext)
	const { data, loading, error } = useQuery(GET_DATA)
	const router = useRouter()
	const { id } = router.query
	const setForm = useForm()
	const {
		formState: { isDirty, errors }
	} = setForm

	const [updateVechnicle] = useMutation(UPDATE_VECHNICLE, {
		refetchQueries: [{ query: GET_DATA }]
	})

	const updateData = (data) => {
		updateVechnicle({ variables: { input: data } })
	}

	const [deleteVechnicle] = useMutation(DELETE_VECHNICLE, {
		refetchQueries: [{ query: GET_DATA }]
	})
	const deleteData = (id) => {
		deleteVechnicle({ variables: { deleteVechnicleId: id } })
		message.success(`Data Berhasil Dihapus`)
		router.push(`/data/kendaraan`)
	}

	//filter data by id
	const filteredData = data?.vechnicle.filter(
		(item) => item.id === parseInt(id as string)
	)
	//map fileteredData
	const mappedData = filteredData
		?.map((item) => {
			return {
				id: item.id,
				nomor_kendaraan: item.nomor_kendaraan,
				tipe_kendaraan: item.tipe_kendaraan,
				nama_supir: item.nama_supir,
				nama_kenek: item.nama_kenek,
				status: item.status,
				last_update: moment
					.unix(item.last_update / 1000)
					.format(`DD MMM YYYY hh:mm a`),
				creator: String(dashboardState.auth.id),
				updated_by: String(dashboardState.auth.id)
			}
		})
		.pop()

	const handleSubmitEdit = (e) => {
		e.preventDefault()
		const data = {
			id: parseInt(id[0]),
			nomor_kendaraan: e.target.nomor_kendaraan.value,
			tipe_kendaraan: e.target.tipe_kendaraan.value,
			nama_supir: e.target.nama_supir.value,
			nama_kenek: e.target.nama_kenek.value,
			status: e.target.status.value,
			last_update: new Date(),
			creator: String(dashboardState.auth.id),
			updated_by: String(dashboardState.auth.id)
		}
		updateData(data)
		message.success(`Data has been updated`)
		console.log(`data update nya ialah : `, data)
		//redirect to index
		router.push(`/data/kendaraan`)
	}

	return (
		<AdminPage
			parent={
				<Link href="/data/kendaraan">
					<a>Daftar Kendaraan</a>
				</Link>
			}
			title={mappedData?.nomor_kendaraan}
			authId=""
			legend=""
			setForm={setForm}
			action={
				<Access
					auth="write:settings-users"
					yes={
						<ul className="actions">
							<li className="action">
								<div className="form-group">
									<Button
										key="submit"
										form="formKendaraan"
										htmlType="submit"
										className="submit"
										style={{
											backgroundColor: `black`,
											borderColor: `black`
										}}
										type="primary"
									>
										Simpan
									</Button>
								</div>
							</li>
							<li className="action">
								<Popconfirm
									title="Are you sure delete this task?"
									className="button is-primary"
									onConfirm={() => deleteData(parseInt(id as string))}
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
						</ul>
					}
				/>
			}
		>
			<section className="section">
				<div className="container">
					<div className="columns">
						<div className="column is-half is-offset-one-quarter">
							<div className="card">
								<div className="card-content">
									<div className="content">
										<form id="formKendaraan" onSubmit={handleSubmitEdit}>
											<div className="form-group" style={{ paddingTop: `5%` }}>
												<label className="label" style={inputStyles}>
													Nomor Kendaraan
												</label>
												<input
													className="input"
													type="text"
													name="nomor_kendaraan"
													defaultValue={mappedData?.nomor_kendaraan}
													style={inputStyle}
												/>
											</div>
											<div className="form-group">
												<label className="label" style={inputStyles}>
													Tipe Kendaraan
												</label>
												<input
													className="input"
													type="text"
													name="tipe_kendaraan"
													defaultValue={mappedData?.tipe_kendaraan}
													style={inputStyle}
												/>
											</div>
											<div className="form-group">
												<label className="label" style={inputStyles}>
													Nama Supir
												</label>
												<input
													className="input"
													type="text"
													name="nama_supir"
													defaultValue={mappedData?.nama_supir}
													style={inputStyle}
												/>
											</div>
											<div className="form-group">
												<label className="label" style={inputStyles}>
													Nama Kenek
												</label>
												<input
													className="input"
													type="text"
													name="nama_kenek"
													defaultValue={mappedData?.nama_kenek}
													style={inputStyle}
												/>
											</div>
											<div className="form-group">
												<div className="form-group">
													<label htmlFor="status">Status</label>
													<select
														className="form-control"
														style={inputStyle}
														id="status"
														required
													>
														<option value={mappedData?.status}>
															{mappedData?.status}
														</option>
														<option value="Aktif">Aktif</option>
														<option value="Tidak aktif">Tidak aktif</option>
													</select>
												</div>
											</div>
										</form>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>
		</AdminPage>
	)
}

SettingUserEdit.getLayout = function getLayout(page) {
	return <Dashboard>{page}</Dashboard>
}
