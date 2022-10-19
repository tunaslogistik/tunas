import { gql, useMutation, useQuery } from "@apollo/client"
import AdminPage from "@components/admin/AdminPage.component"
import Dashboard from "@components/dashboard/Dashboard.component"
import Access from "@components/util/Access.component"
import { Button, message } from "antd"
import "antd/dist/antd.css"
import { useForm } from "react-hook-form"
import { CREATE_PENGATURAN } from "../../../../../graphql/pengaturan/mutations"

//get data
const GET_DATA = gql`
	query pengaturan {
		pengaturan {
			id
			nama_pt
			alamat
			email
			telepon
			fax
			bank
			nama_rekening
			no_rekening
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

	const [createPengaturan] = useMutation(CREATE_PENGATURAN, {
		refetchQueries: [{ query: GET_DATA }]
	})

	//create mutation function
	const createData = (data) => {
		createPengaturan({ variables: { input: data } })
	}

	const handleSubmit = (e) => {
		e.preventDefault()
		const dataSubmit = {
			nama_pt: e.target.nama_pt.value,
			alamat: e.target.nama_pt.value,
			email: e.target.email.value,
			telepon: e.target.telepon.value,
			fax: e.target.fax.value,
			bank: e.target.bank.value,
			nama_rekening: e.target.nama_rekening.value,
			no_rekening: e.target.nomor_rekening.value
		}
		//check duplicate
		const duplicate = data?.pengaturan.find(
			(item) => item.no_rekening === dataSubmit.no_rekening
		)
		if (duplicate) {
			message.error(`Bank Telah Terdaftar`)
		} else {
			createData(dataSubmit)
			message.success(`Data berhasil ditambahkan`)
			console.log(`data nya ialah`, dataSubmit)
		}
	}

	return (
		<AdminPage
			authId=""
			title="Pengaturan"
			legend="pengaturan"
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
											<div className="form-group">
												<label htmlFor="nama_pt" style={inputStyles}>
													Nama PT
												</label>
												<input
													type="text"
													className="form-control"
													style={inputStyle}
													id="nama_pt"
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
											<div className="form-group">
												<label htmlFor="email" style={inputStyles}>
													Email
												</label>
												<input
													type="text"
													className="form-control"
													style={inputStyle}
													id="email"
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
													margin: `0 8px`
												}}
											>
												<label htmlFor="fax" style={inputStyles}>
													FAX
												</label>
												<input
													type="text"
													className="form-control"
													style={inputStyle}
													id="fax"
													required
												/>
											</div>
											<div className="form-group">
												<h6 style={{ fontWeight: `bold` }}>Nomor Rekening</h6>
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
													Bank
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
