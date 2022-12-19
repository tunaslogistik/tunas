import { gql, useMutation, useQuery } from "@apollo/client"
import AdminPage from "@components/admin/AdminPage.component"
import Dashboard from "@components/dashboard/Dashboard.component"
import Access from "@components/util/Access.component"
import { DashboardContext } from "@contexts/DashboardContext.context"
import { Button, message, Popconfirm } from "antd"

import Link from "next/link"
import { useRouter } from "next/router"
import { useContext } from "react"
import { useForm } from "react-hook-form"
import {
	DELETE_DAFTAR_TUJUAN,
	UPDATE_DAFTAR_TUJUAN
} from "../../../../graphql/daftar_tujuan/mutations"
//get data using id
const GET_DATA = gql`
	query daftar_tujuan_by_id($id: Int) {
		daftar_tujuan_by_id(id: $id) {
			id
			kode_tujuan
			nama_tujuan
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
	fontSize: `14px`,
	fontWeight: `bold`
}

export default function SettingUserEdit() {
	const { state: dashboardState } = useContext(DashboardContext)
	const router = useRouter()
	const { id } = router.query
	const setForm = useForm()
	const { reset, register } = setForm

	//get data using id reset form
	const { data } = useQuery(GET_DATA, {
		variables: {
			id: parseInt(id as string)
		},
		onCompleted: (data) => {
			reset({
				kode_tujuan: data.daftar_tujuan_by_id.kode_tujuan,
				nama_tujuan: data.daftar_tujuan_by_id.nama_tujuan
			})
		}
	})

	const [updateDaftarTujuan] = useMutation(UPDATE_DAFTAR_TUJUAN, {
		refetchQueries: [{ query: GET_DATA }]
	})

	const updateData = (data) => {
		updateDaftarTujuan({ variables: { input: data } })
	}

	const [deleteDaftarTujuan] = useMutation(DELETE_DAFTAR_TUJUAN, {
		refetchQueries: [{ query: GET_DATA }]
	})
	const deleteData = (id) => {
		deleteDaftarTujuan({ variables: { deleteDaftarTujuanId: id } })
		message.success(`Data Berhasil Dihapus`)
		router.push(`/data/daftar-tujuan`)
	}

	//filter data by id
	const filteredData = data?.daftar_tujuan_by_id

	const handleSubmitEdit = (e) => {
		e.preventDefault()
		const data = {
			id: parseInt(id as string),
			kode_tujuan: e.target.kode_tujuan.value,
			nama_tujuan: e.target.nama_tujuan.value,
			creator: String(dashboardState.auth.id),
			updated_by: String(dashboardState.auth.id)
		}
		updateData(data)
		message.success(`Data has been updated`)
		console.log(`data update nya ialah : `, data)
		//redirect to index
		router.push(`/data/daftar-tujuan`)
	}

	return (
		<AdminPage
			parent={
				<Link href="/data/daftar-tujuan">
					<a>Daftar Kota</a>
				</Link>
			}
			title={filteredData?.nama_tujuan}
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
										form="formTujuan"
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
				<form id="formTujuan" onSubmit={handleSubmitEdit}>
					<div className="form-group" style={{ paddingTop: `5%` }}>
						<label style={inputStyles} htmlFor="kode_biaya">
							Kode Tujuan
						</label>
						<input
							type="text"
							className="form-control"
							style={inputStyle}
							id="kode_tujuan"
							name="kode_tujuan"
							{...register(`kode_tujuan`)}
							required
						/>
					</div>
					<div className="form-group">
						<label style={inputStyles} htmlFor="nama_biaya">
							Nama Tujuan
						</label>
						<input
							type="text"
							className="form-control"
							style={inputStyle}
							id="nama_tujuan"
							name="nama_tujuan"
							{...register(`nama_tujuan`)}
							required
						/>
					</div>
				</form>
			</section>
		</AdminPage>
	)
}

SettingUserEdit.getLayout = function getLayout(page) {
	return <Dashboard>{page}</Dashboard>
}
