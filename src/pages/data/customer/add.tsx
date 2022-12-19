import { gql, useMutation, useQuery } from "@apollo/client"
import AdminPage from "@components/admin/AdminPage.component"
import Dashboard from "@components/dashboard/Dashboard.component"
import { DashboardContext } from "@contexts/DashboardContext.context"
import { message } from "antd"

import Link from "next/link"
import { useRouter } from "next/router"
import { useContext, useEffect, useState } from "react"
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
			idPelanggan
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

	//get last update idPelanggan start from 0
	const lastUpdate =
		data?.customer[parseInt(data?.customer.length) - 1]?.idPelanggan

	//if last update is null, set idPelanggan to C.00188 else last update
	const idp = lastUpdate == null ? `C.00188` : lastUpdate
	//seperate number and string and + 1
	const idpNumber = idp.match(/\d+/g).map(Number)
	const idpString = idp.match(/[a-zA-Z]+/g)
	const idpNumberPlus = parseInt(idpNumber[0]) + 1

	//back to normal
	const idpNumberPlusString = idpNumberPlus.toString()
	const idpNumberPlusStringPad = idpNumberPlusString.padStart(5, `0`)
	const idpNumberPlusStringPadFinal =
		idpString[0] + `.` + idpNumberPlusStringPad

	const fetchApi = async () => {
		const res = await fetch(`/api/tax`)
		const data = await res.json()
		//return data
		return data
	}

	//seperate data and promise using setState and useEffect
	const [dataApi, setDataApi] = useState([])
	useEffect(() => {
		fetchApi().then((data) => setDataApi(data))
	}, [])

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
			updated_by: String(dashboardState.auth.id),
			idPelanggan: String(idpNumberPlusStringPadFinal)
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
											<div style={{ width: `100%` }}>
												<div className="col">
													<label style={inputStyles}>Tax</label>
													<select
														className="form-control"
														style={{
															width: `100%`
														}}
														id="tipe_ppn"
													>
														{dataApi.map((item, index) => {
															return (
																<option key={index} value={item.taxInfo}>
																	{item.taxInfo}
																</option>
															)
														})}
													</select>
												</div>
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
