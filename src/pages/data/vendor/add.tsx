import { gql, useMutation, useQuery } from "@apollo/client"
import AdminPage from "@components/admin/AdminPage.component"
import Dashboard from "@components/dashboard/Dashboard.component"
import { DashboardContext } from "@contexts/DashboardContext.context"
import { message } from "antd"
import "antd/dist/antd.css"
import Link from "next/link"
import { useRouter } from "next/router"
import { useContext } from "react"
import { useForm } from "react-hook-form"
import { CREATE_VENDOR } from "../../../../graphql/vendor/mutations"

//get data
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
	fontWeight: `bold`,
	fontSize: `12px`
}

export default function SettingUserEdit() {
	const { state: dashboardState } = useContext(DashboardContext)
	const { data } = useQuery(GET_DATA)
	const router = useRouter()
	const setForm = useForm()
	const [createVendor] = useMutation(CREATE_VENDOR, {
		refetchQueries: [{ query: GET_DATA }]
	})

	//create mutation function
	const createData = (data) => {
		createVendor({ variables: { input: data } })
	}

	const handleSubmit = (e) => {
		e.preventDefault()
		const dataSubmit = {
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
		//check duplicate
		const duplicate = data.vendor.find(
			(item) => item.kode_vendor === dataSubmit.kode_vendor
		)
		if (duplicate) {
			message.error(`Kode Vendor sudah ada`)
		} else {
			createData(dataSubmit)
			message.success(`Data berhasil ditambahkan`)
			console.log(`data nya ialah`, data)
			router.push(`/data/vendor`)
		}
	}
	return (
		<AdminPage
			parent={
				<Link href="/data/vendor">
					<a>Daftar Vendor</a>
				</Link>
			}
			authId=""
			title="Tambahkan Vendor"
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
												<label htmlFor="kode_vendor" style={inputStyles}>
													Kode Vendor
												</label>
												<input
													type="text"
													className="form-control"
													style={inputStyle}
													id="kode_vendor"
													required
												/>
											</div>
											<div className="form-group">
												<label htmlFor="nama_vendor" style={inputStyles}>
													Nama Vendor
												</label>
												<input
													type="text"
													className="form-control"
													style={inputStyle}
													id="nama_vendor"
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
											<div className="form-group">
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
											<div className="form-group">
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
											</div>
											<div className="form-group">
												<label htmlFor="jenis" style={inputStyles}>
													Jenis
												</label>
												<input
													type="text"
													className="form-control"
													style={inputStyle}
													id="jenis"
													required
												/>
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
