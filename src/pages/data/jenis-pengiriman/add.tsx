import { gql, useMutation, useQuery } from "@apollo/client"
import AdminPage from "@components/admin/AdminPage.component"
import Dashboard from "@components/dashboard/Dashboard.component"
import { DashboardContext } from "@contexts/DashboardContext.context"
import { message } from "antd"

import Link from "next/link"
import { useRouter } from "next/router"
import { useContext } from "react"
import { useForm } from "react-hook-form"
import { CREATE_JENIS_PENGIRIMAN } from "../../../../graphql/jenis_pengiriman/mutations"

//get data
const GET_DATA = gql`
	query Jenis_pengiriman {
		jenis_pengiriman {
			id
			nama_pengiriman
			updated_by
			creator
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
	const [createJenisPengiriman] = useMutation(CREATE_JENIS_PENGIRIMAN, {
		refetchQueries: [{ query: GET_DATA }]
	})

	//create mutation function
	const createData = (data) => {
		createJenisPengiriman({ variables: { input: data } })
	}

	const handleSubmit = (e) => {
		e.preventDefault()
		const dataSubmit = {
			nama_pengiriman: e.target.nama_pengiriman.value,
			creator: String(dashboardState.auth.id),
			updated_by: String(dashboardState.auth.id)
		}

		const duplicate = data.jenis_pengiriman.find(
			(item) => item.nama_pengiriman === dataSubmit.nama_pengiriman
		)
		if (duplicate) {
			message.error(`Nama pengiriman sudah ada`)
		} else {
			createData(dataSubmit)
			message.success(`Data berhasil ditambahkan`)
			router.push(`/data/jenis-pengiriman`)
		}
	}
	return (
		<AdminPage
			parent={
				<Link href="/data/jenis-pengiriman">
					<a>Daftar Pengiriman</a>
				</Link>
			}
			authId=""
			title="Tambahkan Jenis Pengiriman"
			legend=""
			setForm={setForm}
		>
			<section className="section">
				<div className="container">
					<form onSubmit={handleSubmit}>
						<div className="form-group">
							<label htmlFor="nama_pengiriman" style={inputStyles}>
								Nama Pengiriman
							</label>
							<input
								type="text"
								className="form-control"
								style={inputStyle}
								id="nama_pengiriman"
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
			</section>
		</AdminPage>
	)
}

SettingUserEdit.getLayout = function getLayout(page) {
	return <Dashboard>{page}</Dashboard>
}
