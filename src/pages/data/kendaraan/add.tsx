import { gql, useMutation, useQuery } from "@apollo/client"
import AdminPage from "@components/admin/AdminPage.component"
import Dashboard from "@components/dashboard/Dashboard.component"
import { DashboardContext } from "@contexts/DashboardContext.context"
import { message } from "antd"

import Link from "next/link"
import { useRouter } from "next/router"
import { useContext } from "react"
import { useForm } from "react-hook-form"
import { CREATE_VECHNICLE } from "../../../../graphql/mobil/mutations"

//get data
const GET_DATA = gql`
	query Vechicle {
		vechnicle {
			nomor_kendaraan
			tipe_kendaraan
			nama_supir
			nama_kenek
			nomor_supir
			nomor_kenek
			status
			last_update
			creator
			updated_by
			id
		}
	}
`
//text input style
const inputStyle = {
	width: `100%`,
	marginBottom: `10px`,
	fontSize: `14px`
}

const inputStyles = {
	width: `100%`,
	marginBottom: `10px`,
	fontWeight: `bold`,
	fontSize: `14px`
}

export default function SettingUserEdit() {
	const { state: dashboardState } = useContext(DashboardContext)
	const { data } = useQuery(GET_DATA)
	const router = useRouter()
	const setForm = useForm()
	const [createVechnicle] = useMutation(CREATE_VECHNICLE, {
		refetchQueries: [{ query: GET_DATA }]
	})

	//create mutation function
	const createData = (data) => {
		createVechnicle({ variables: { input: data } })
	}

	const handleSubmit = (e) => {
		e.preventDefault()
		const dataSubmit = {
			nomor_kendaraan: e.target.nomor_kendaraan.value,
			tipe_kendaraan: e.target.tipe_kendaraan.value,
			nama_supir: e.target.nama_supir.value,
			nama_kenek: e.target.nama_kenek.value,
			nomor_supir: e.target.nomor_supir.value,
			nomor_kenek: e.target.nomor_kenek.value,
			status: e.target.status.value,
			last_update: new Date(),
			creator: String(dashboardState.auth.id),
			updated_by: String(dashboardState.auth.id)
		}
		//check if duplicate
		const duplicate = data.vechnicle.find(
			(item) => item.nomor_kendaraan === dataSubmit.nomor_kendaraan
		)
		if (duplicate) {
			message.error(`Nomor Kendaraan sudah ada`)
		} else {
			createData(dataSubmit)
			message.success(`Data berhasil ditambahkan`)
			router.push(`/data/kendaraan`)
		}
	}
	return (
		<AdminPage
			parent={
				<Link href="/data/kendaraan">
					<a>Daftar Kendaraan</a>
				</Link>
			}
			authId="Daftar-kendaraan"
			title="Tambahkan Kendaraan"
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
												<label htmlFor="nomor_kendaraan" style={inputStyles}>
													Nomor Kendaraan
												</label>
												<input
													type="text"
													className="form-control"
													style={inputStyle}
													id="nomor_kendaraan"
													required
												/>
											</div>
											<div className="form-group">
												<label htmlFor="tipe_kendaraan" style={inputStyles}>
													Tipe Kendaraan
												</label>
												<input
													type="text"
													className="form-control"
													style={inputStyle}
													id="tipe_kendaraan"
													required
												/>
											</div>
											<div className="form-group">
												<label htmlFor="nama_supir" style={inputStyles}>
													Nama Supir
												</label>
												<input
													type="text"
													className="form-control"
													style={inputStyle}
													id="nama_supir"
													required
												/>
											</div>
											<div className="form-group">
												<label htmlFor="nama_kenek" style={inputStyles}>
													Nama Kenek
												</label>
												<input
													type="text"
													className="form-control"
													style={inputStyle}
													id="nama_kenek"
													required
												/>
											</div>
											<div className="form-group">
												<label htmlFor="nomor_supir" style={inputStyles}>
													Nomor Supir
												</label>
												<input
													type="text"
													className="form-control"
													style={inputStyle}
													id="nomor_supir"
													required
												/>
											</div>
											<div className="form-group">
												<label htmlFor="nomor_kenek" style={inputStyles}>
													Nomor Kenek
												</label>
												<input
													type="text"
													className="form-control"
													style={inputStyle}
													id="nomor_kenek"
													required
												/>
											</div>
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
													<option value="Aktif">Aktif</option>
													<option value="Tidak aktif">Tidak aktif</option>
												</select>
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

SettingUserEdit.getLayout = function getLayout(page) {
	return <Dashboard>{page}</Dashboard>
}
