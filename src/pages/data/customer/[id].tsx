import { gql, useMutation, useQuery } from "@apollo/client"
import AdminPage from "@components/admin/AdminPage.component"
import Dashboard from "@components/dashboard/Dashboard.component"
import Access from "@components/util/Access.component"
import { DashboardContext } from "@contexts/DashboardContext.context"
import { Button, message, Popconfirm } from "antd"

import moment from "moment"
import Link from "next/link"
import { useRouter } from "next/router"
import { useContext } from "react"
import { useForm } from "react-hook-form"
import {
	DELETE_CUSTOMER,
	UPDATE_CUSTOMER
} from "../../../../graphql/customer/mutations"
//get data using id
const GET_DATA = gql`
	query Customer {
		customer {
			id
			kode_customer
			nama_customer
			alamat
			telepon
			npwp
			pic
			term_payment
			tipe_ppn
			status
			last_update
			creator
			updated_by
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

export default function Home() {
	const { state: dashboardState } = useContext(DashboardContext)
	const { data } = useQuery(GET_DATA)
	const router = useRouter()
	const { id } = router.query
	const setForm = useForm()

	const [updateDaftarTujuan] = useMutation(UPDATE_CUSTOMER, {
		refetchQueries: [{ query: GET_DATA }]
	})

	const updateData = (data) => {
		updateDaftarTujuan({ variables: { input: data } })
	}

	const [deleteCustomer] = useMutation(DELETE_CUSTOMER, {
		refetchQueries: [{ query: GET_DATA }]
	})
	const deleteData = (id) => {
		deleteCustomer({ variables: { deleteCustomerId: id } })
		message.success(`Data Berhasil Dihapus`)
		router.push(`/data/customer`)
	}

	//filter data by id
	const filteredData = data?.customer.filter(
		(item) => item.id === parseInt(id as string)
	)
	//map fileteredData
	const mappedData = filteredData
		?.map((item) => {
			return {
				id: item.id,
				kode_customer: item.kode_customer,
				idPelanggan: item.idPelanggan,
				nama_customer: item.nama_customer,
				alamat: item.alamat,
				telepon: item.telepon,
				npwp: item.npwp,
				term_payment: item.term_payment,
				pic: item.pic,
				status: item.status,
				tipe_ppn: item.tipe_ppn,
				last_update: moment.unix(item.last_update).format(`YYYY-MM-DD`),
				creator: String(dashboardState.auth.id),
				updated_by: String(dashboardState.auth.id)
			}
		})
		.pop()

	const handleSubmitEdit = (e) => {
		e.preventDefault()
		const data = {
			id: parseInt(id as string),
			kode_customer: e.target.kode_customer.value,
			nama_customer: e.target.nama_customer.value,
			alamat: e.target.alamat.value,
			telepon: String(e.target.telepon.value),
			npwp: e.target.npwp.value,
			pic: e.target.pic.value,
			tipe_ppn: e.target.tipe_ppn.value,
			status: e.target.status.value,
			last_update: new Date(),
			creator: String(dashboardState.auth.id),
			updated_by: String(dashboardState.auth.id),
			idPelanggan: mappedData?.idPelanggan
		}
		updateData(data)
		message.success(`Data has been updated`)
		console.log(`data update nya ialah : `, data)
		//redirect to index
		router.push(`/data/customer`)
	}

	return (
		<AdminPage
			parent={
				<Link href="/data/customer">
					<a>Daftar Customer</a>
				</Link>
			}
			title={mappedData?.kode_customer}
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
										form="formCust"
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
										<form id="formCust" onSubmit={handleSubmitEdit}>
											<div className="form-group" style={{ paddingTop: `3%` }}>
												<label style={inputStyles} htmlFor="kode_customer">
													# Customer
												</label>
												<input
													type="text"
													className="form-control"
													style={inputStyle}
													id="kode_customer"
													defaultValue={mappedData?.kode_customer}
													required
												/>
											</div>
											<div className="form-group">
												<label style={inputStyles} htmlFor="nama_customer">
													Nama Customer
												</label>
												<input
													type="text"
													className="form-control"
													style={inputStyle}
													id="nama_customer"
													defaultValue={mappedData?.nama_customer}
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
											<div
												className="form-group"
												style={{
													display: `inline-block`,
													width: `calc(50% - 8px)`,
													marginTop: `1%`
												}}
											>
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
											<div
												className="form-group"
												style={{
													display: `inline-block`,
													width: `calc(50% - 8px)`,
													marginTop: `1%`,
													margin: `0 8px`
												}}
											>
												<label style={inputStyles} htmlFor="top">
													Term of Payment (hari)
												</label>
												<input
													type="text"
													className="form-control"
													style={inputStyle}
													id="top"
													defaultValue={mappedData?.term_payment}
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
											<div
												className="form-group"
												style={{
													display: `inline-block`,
													width: `calc(50% - 8px)`,
													marginTop: `1%`,
													margin: `0 8px`
												}}
											>
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
												<label style={inputStyles} htmlFor="tipe_ppn">
													Tipe PPn
												</label>
												<input
													type="text"
													className="form-control"
													style={inputStyle}
													id="tipe_ppn"
													defaultValue={mappedData?.tipe_ppn}
													required
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

Home.getLayout = function getLayout(page) {
	return <Dashboard>{page}</Dashboard>
}
