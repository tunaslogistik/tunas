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
import { CREATE_DAFTAR_TUJUAN } from "../../../../graphql/daftar_tujuan/mutations"

//get data
const GET_DATA = gql`
	query Daftar_tujuan {
		daftar_tujuan {
			id
			kode_tujuan
			nama_tujuan
			updated_by
			creator
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
	fontWeight: `bold`,
	fontSize: `14px`
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
	const setForm = useForm()
	const {
		control,
		reset,
		formState: { isDirty, errors }
	} = setForm

	const [createDaftarTujuan] = useMutation(CREATE_DAFTAR_TUJUAN, {
		refetchQueries: [{ query: GET_DATA }]
	})

	//create mutation function
	const createData = (data) => {
		createDaftarTujuan({ variables: { input: data } })
	}

	const handleSubmit = (e) => {
		e.preventDefault()
		const dataSubmit = {
			kode_tujuan: e.target.kode_tujuan.value,
			nama_tujuan: e.target.nama_tujuan.value,
			creator: String(dashboardState.auth.id),
			updated_by: String(dashboardState.auth.id)
		}
		//check duplicate
		const duplicate = data.daftar_tujuan.find(
			(item) => item.kode_tujuan === dataSubmit.kode_tujuan
		)
		if (duplicate) {
			message.error(`Kode Tujuan sudah ada`)
		} else {
			createData(dataSubmit)
			console.log(data)
			message.success(`Data berhasil ditambahkan`)
			router.push(`/data/daftar-tujuan`)
		}
	}
	return (
		<AdminPage
			parent={
				<Link href="/data/daftar-tujuan">
					<a>Daftar Kota</a>
				</Link>
			}
			authId="daftar-tujuan"
			title="Tambahkan Kota"
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
												<label htmlFor="kode_biaya" style={inputStyles}>
													Kode Kota
												</label>
												<input
													type="text"
													className="form-control"
													style={inputStyle}
													id="kode_tujuan"
													required
												/>
											</div>
											<div className="form-group">
												<label htmlFor="nama_biaya" style={inputStyles}>
													Nama Kota
												</label>
												<input
													type="text"
													className="form-control"
													style={inputStyle}
													id="nama_tujuan"
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
