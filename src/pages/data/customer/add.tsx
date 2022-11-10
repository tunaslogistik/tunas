import { gql, useMutation, useQuery } from "@apollo/client"
import AdminPage from "@components/admin/AdminPage.component"
import Dashboard from "@components/dashboard/Dashboard.component"
import { DashboardContext } from "@contexts/DashboardContext.context"
import { message } from "antd"

import Link from "next/link"
import { useRouter } from "next/router"
import { useContext } from "react"
import { useForm } from "react-hook-form"
import { CREATE_CUSTOMER } from "../../../../graphql/customer/mutations"

//get data
const GET_DATA = gql`
	query customer {
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
//button on the right style

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
	const setForm = useForm()

	const [createCustomer] = useMutation(CREATE_CUSTOMER, {
		refetchQueries: [{ query: GET_DATA }]
	})

	//create mutation function
	const createData = (data) => {
		createCustomer({ variables: { input: data } })
	}

	const handleSubmit = (e) => {
		e.preventDefault()
		const dataSubmit = {
			kode_customer: e.target.kode_customer.value,
			nama_customer: e.target.nama_customer.value,
			alamat: e.target.alamat.value,
			telepon: String(e.target.telepon.value),
			npwp: e.target.npwp.value,
			term_payment: e.target.top.value,
			pic: e.target.pic.value,
			tipe_ppn: e.target.tipe_ppn.value,
			status: e.target.status.value,
			last_update: new Date(),
			creator: String(dashboardState.auth.id),
			updated_by: String(dashboardState.auth.id)
		}
		//check duplicate
		const duplicate = data?.customer.find(
			(item) => item.kode_customer === dataSubmit.kode_customer
		)
		if (duplicate) {
			message.error(`Kode Customer sudah ada`)
		} else {
			createData(dataSubmit)
			message.success(`Data berhasil ditambahkan`)
			console.log(`data nya ialah`, data)
			router.push(`/data/customer`)
		}
	}

	return (
		<AdminPage
			parent={
				<Link href="/data/customer">
					<a>Daftar Customer</a>
				</Link>
			}
			authId="daftar-customer"
			title="Tambahkan Customer"
			legend=""
			setForm={setForm}
		>
			<section className="section">
				<div className="container">
					<div className="columns">
						<div className="column is-half is-offset-one-quarter">
							<div className="card">
								<div className="card-content">
									<div className="content">
										<form onSubmit={handleSubmit}>
											<div className="form-group">
												<label htmlFor="kode_customer" style={inputStyles}>
													Kode Customer
												</label>
												<input
													type="text"
													className="form-control"
													style={inputStyle}
													id="kode_customer"
													required
												/>
											</div>
											<div className="form-group">
												<label htmlFor="nama_customer" style={inputStyles}>
													Nama Customer
												</label>
												<input
													type="text"
													className="form-control"
													style={inputStyle}
													id="nama_customer"
													required
												/>
											</div>
											<div className="form-group">
												<label htmlFor="alamat" style={inputStyles}>
													Alamat
												</label>
												<textarea
													className="form-control"
													style={inputStyle}
													id="alamat"
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
												<label htmlFor="telepon" style={inputStyles}>
													Telepon
												</label>
												<input
													type="text"
													className="form-control"
													style={inputStyle}
													id="telepon"
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
												<label htmlFor="npwp" style={inputStyles}>
													NPWP
												</label>
												<input
													type="text"
													className="form-control"
													style={inputStyle}
													id="npwp"
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
												<label htmlFor="top" style={inputStyles}>
													Term of Payment (hari)
												</label>
												<input
													type="text"
													className="form-control"
													style={inputStyle}
													id="top"
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
												<label htmlFor="pic" style={inputStyles}>
													PIC
												</label>
												<input
													type="text"
													className="form-control"
													style={inputStyle}
													id="pic"
													required
												/>
											</div>
											<div className="form-group">
												<label htmlFor="tipe_ppn" style={inputStyles}>
													Tipe PPN
												</label>
												<input
													type="text"
													className="form-control"
													style={inputStyle}
													id="tipe_ppn"
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
														<option value="Aktif" style={inputStyles}>
															Aktif
														</option>
														<option value="Tidak aktif">Tidak aktif</option>
													</select>
												</div>
											</div>
											<div className="form-group" style={{ marginLeft: `91%` }}>
												<button type="submit" className="button is-primary">
													Tambah
												</button>
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
