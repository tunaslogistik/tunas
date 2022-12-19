import { gql, useMutation, useQuery } from "@apollo/client"
import AdminPage from "@components/admin/AdminPage.component"
import Dashboard from "@components/dashboard/Dashboard.component"
import Access from "@components/util/Access.component"
import { DashboardContext } from "@contexts/DashboardContext.context"
import { Button, Popconfirm, message } from "antd"

import moment from "moment"
import Link from "next/link"
import { useRouter } from "next/router"
import { useContext } from "react"
import { useForm } from "react-hook-form"
import {
	DELETE_VENDOR,
	UPDATE_VENDOR
} from "../../../../graphql/vendor/mutations"

const GET_DATA = gql`
	query Vendor {
		vendor {
			id
			kode_vendor
			nama_vendor
			alamat
			telepon
			npwp
			pic
			status
			last_update
			creator
			updated_by
			jenis
		}
	}
`

//text input style
const inputStyle = {
	width: `100%`,
	marginBottom: `10px`,
	fontSize: `12px`
}

const inputStyles = {
	width: `100%`,
	marginBottom: `10px`,
	fontSize: `12px`,
	fontWeight: `bold`
}

export default function SettingUserEdit() {
	const { state: dashboardState } = useContext(DashboardContext)
	const { data } = useQuery(GET_DATA)
	const router = useRouter()
	const { id } = router.query
	const setForm = useForm()
	const [updateVendor] = useMutation(UPDATE_VENDOR, {
		refetchQueries: [{ query: GET_DATA }]
	})

	const updateData = (data) => {
		updateVendor({ variables: { input: data } })
	}

	const [deleteVendor] = useMutation(DELETE_VENDOR, {
		refetchQueries: [{ query: GET_DATA }]
	})
	const deleteData = (id) => {
		deleteVendor({ variables: { deleteVendorId: id } })
		message.success(`Data Berhasil Dihapus`)
		router.push(`/data/vendor`)
	}

	//filter data by id
	const filteredData = data?.vendor.filter(
		(item) => item.id === parseInt(id as string)
	)
	//map fileteredData
	const mappedData = filteredData
		?.map((item) => {
			return {
				id: item.id,
				kode_vendor: item.kode_vendor,
				nama_vendor: item.nama_vendor,
				alamat: item.alamat,
				telepon: item.telepon,
				npwp: item.npwp,
				pic: item.pic,
				status: item.status,
				jenis: item.jenis,
				last_update: String(
					moment.unix(item.last_update / 1000).format(`DD MMM YYYY hh:mm a`)
				),
				creator: String(dashboardState.auth.id),
				updated_by: String(dashboardState.auth.id)
			}
		})
		.pop()
	const handleSubmitEdit = (e) => {
		e.preventDefault()
		const data = {
			id: parseInt(id as string),
			kode_vendor: e.target.kode_vendor.value,
			nama_vendor: e.target.nama_vendor.value,
			alamat: e.target.alamat.value,
			telepon: e.target.telepon.value,
			npwp: e.target.npwp.value,
			pic: e.target.pic.value,
			status: e.target.status.value,
			jenis: e.target.jenis.value,
			last_update: new Date(),
			creator: String(dashboardState.auth.id),
			updated_by: String(dashboardState.auth.id)
		}
		updateData(data)
		message.success(`Data has been updated`)
		//redirect to index
		router.push(`/data/vendor`)
	}

	return (
		<AdminPage
			parent={
				<Link href="/data/vendor">
					<a>Daftar Vendor</a>
				</Link>
			}
			title={mappedData?.kode_vendor}
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
										form="formVendor"
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
										<form id="formVendor" onSubmit={handleSubmitEdit}>
											<div className="form-group" style={{ paddingTop: `5%` }}>
												<label style={inputStyles} htmlFor="kode_vendor">
													Kode Vendor
												</label>
												<input
													type="text"
													className="form-control"
													style={inputStyle}
													id="kode_vendor"
													defaultValue={mappedData?.kode_vendor}
													required
												/>
											</div>
											<div className="form-group">
												<label style={inputStyles} htmlFor="nama_vendor">
													Nama Vendor
												</label>
												<input
													type="text"
													className="form-control"
													style={inputStyle}
													id="nama_vendor"
													defaultValue={mappedData?.nama_vendor}
													required
												/>
											</div>
											<div className="form-group">
												<label style={inputStyles} htmlFor="alamat">
													Alamat
												</label>
												<textarea
													className="form-control"
													style={inputStyle}
													id="alamat"
													defaultValue={mappedData?.alamat}
													required
												/>
											</div>
											<div className="form-group">
												<label style={inputStyles} htmlFor="telepon">
													Telepon
												</label>
												<input
													type="text"
													className="form-control"
													style={inputStyle}
													id="telepon"
													defaultValue={mappedData?.telepon}
													required
												/>
											</div>
											<div className="form-group">
												<label style={inputStyles} htmlFor="npwp">
													NPWP
												</label>
												<input
													type="text"
													className="form-control"
													style={inputStyle}
													id="npwp"
													defaultValue={mappedData?.npwp}
													required
												/>
											</div>
											<div className="form-group">
												<label style={inputStyles} htmlFor="pic">
													PIC
												</label>
												<input
													type="text"
													className="form-control"
													style={inputStyle}
													id="pic"
													defaultValue={mappedData?.pic}
													required
												/>
											</div>
											<div className="form-group">
												<div className="form-group">
													<label htmlFor="status" style={inputStyles}>
														Status
													</label>
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
											<div className="form-group">
												<label style={inputStyles} htmlFor="jenis">
													Jenis
												</label>
												<input
													type="text"
													className="form-control"
													style={inputStyle}
													id="jenis"
													defaultValue={mappedData?.jenis}
													required
												/>
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
