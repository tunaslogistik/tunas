import { gql, useMutation, useQuery } from "@apollo/client"
import AdminPage from "@components/admin/AdminPage.component"
import Dashboard from "@components/dashboard/Dashboard.component"
import Access from "@components/util/Access.component"
import { Button, message } from "antd"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { CREATE_ACCURATE } from "../../../../../graphql/accurate/mutations"

const GET_DATA = gql`
	query accurate {
		accurate {
			id
			nama_barang
			jenis
			kode_barang
			salesDiscountGlAccountId
			salesGlAccountId
			inventoryGlAccountId
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
	const { data } = useQuery(GET_DATA)
	const setForm = useForm()

	const [createAccurate] = useMutation(CREATE_ACCURATE, {
		refetchQueries: [{ query: GET_DATA }]
	})

	//create mutation function
	const createData = (data) => {
		createAccurate({ variables: { input: data } })
	}

	//get data length
	const dataLength = data?.accurate.length

	const lastUpdate = data?.accurate[dataLength - 1]?.kode_barang

	//if last update is null, set kode barang to 100071 else last update + 1
	const kodeBarang = lastUpdate == null ? 100071 : parseInt(lastUpdate) + 1

	console.log(`kode barang`, kodeBarang)

	const handleSubmit = (e) => {
		e.preventDefault()
		const dataSubmit = {
			nama_barang: e.target.nama_barang.value,
			jenis: e.target.service.value,
			kode_barang: String(kodeBarang),
			akun_penjualan: e.target.akun.value,
			salesDiscountGlAccountId: `null`,
			salesGlAccountId: `null`,
			inventoryGlAccountId: `null`
		}
		//check duplicate
		const duplicate = data?.accurate.find(
			(item) => item.nama_barang === dataSubmit.nama_barang
		)
		if (duplicate) {
			message.error(`Nama Barang Telah Terdaftar`)
		} else {
			createData(dataSubmit)
			message.success(`Data berhasil ditambahkan`)
			console.log(`data nya ialah`, dataSubmit)
		}
	}

	//fetch api from
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
	}, []).catch((err) => console.log(err))

	console.log(`data api`, dataApi)

	return (
		<AdminPage
			parent={
				<Link href="/admin/settings/accurate/">
					<a>Daftar Barang</a>
				</Link>
			}
			title="Tambahkan Barang"
			authId=""
			legend="accurate"
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
										form="formPengaturan"
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
										<form onSubmit={handleSubmit} id="formPengaturan">
											<div
												className="form-group"
												style={{
													display: `inline-block`,
													width: `calc(50% - 8px)`,
													marginTop: `1%`
												}}
											>
												<label htmlFor="nama_barang" style={inputStyles}>
													Nama Barang
												</label>
												<input
													type="text"
													className="form-control"
													style={inputStyle}
													id="nama_barang"
													required
												/>
											</div>
											<div
												className="form-group"
												style={{
													display: `inline-block`,
													width: `calc(50% - 8px)`,
													margin: `0 8px`
												}}
											>
												<label htmlFor="fax" style={inputStyles}>
													Service
												</label>
												<input
													type="text"
													className="form-control"
													style={inputStyle}
													id="service"
													value="SERVICE"
													required
													disabled
												/>
											</div>
											<div style={{ width: `100%` }}>
												<div className="col">
													<label style={inputStyles}>Akun Penjualan</label>
													<select
														className="form-control"
														style={{
															width: `100%`
														}}
														id="akun"
													>
														<option value="229">Pendapatan FCL / LCL</option>
														<option value="384">Pendapatan Lain Lain</option>
													</select>
												</div>
											</div>
											<div style={{ width: `100%` }}>
												<div className="col">
													<label style={inputStyles}>Tax</label>
													<select
														className="form-control"
														style={{
															width: `100%`
														}}
														id="tax"
													>
														{dataApi.map((item, index) => {
															return (
																<option key={index} value={item.id}>
																	{item.taxInfo}
																</option>
															)
														})}
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
