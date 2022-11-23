import { gql, useMutation, useQuery } from "@apollo/client"
import AdminPage from "@components/admin/AdminPage.component"
import Dashboard from "@components/dashboard/Dashboard.component"
import Access from "@components/util/Access.component"
import { Button, message } from "antd"
import Link from "next/link"

import { useForm } from "react-hook-form"
import { CREATE_ACCURATE } from "../../../../../graphql/accurate/mutations"
//get data
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
											{/* <div className="form-group">
												<h6 style={{ fontWeight: `bold` }}>Akun</h6>
											</div>
											<div
												className="form-group"
												style={{
													display: `inline-block`,
													width: `calc(33% - 8px)`,
													marginTop: `1%`
												}}
											>
												<label htmlFor="bank" style={inputStyles}>
													Beban
												</label>
												<input
													type="text"
													className="form-control"
													style={inputStyle}
													id="bank"
													required
												/>
											</div>
											<div
												className="form-group"
												style={{
													display: `inline-block`,
													width: `calc(33% - 8px)`,
													margin: `0 8px`
												}}
											>
												<label htmlFor="nama_rekening" style={inputStyles}>
													Nama rekening
												</label>
												<input
													type="text"
													className="form-control"
													style={inputStyle}
													id="nama_rekening"
													required
												/>
											</div>
											<div
												className="form-group"
												style={{
													display: `inline-block`,
													width: `calc(34% - 8px)`,
													margin: `0 1px`
												}}
											>
												<label htmlFor="nomor_rekening" style={inputStyles}>
													Nomor Rekening
												</label>
												<input
													type="text"
													className="form-control"
													style={inputStyle}
													id="nomor_rekening"
													required
												/>
											</div> */}
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
