import { gql, useMutation, useQuery } from "@apollo/client"
import AdminPage from "@components/admin/AdminPage.component"
import Dashboard from "@components/dashboard/Dashboard.component"
import Access from "@components/util/Access.component"
import { DashboardContext } from "@contexts/DashboardContext.context"
import { Button, Popconfirm, message } from "antd"

import Link from "next/link"
import { useRouter } from "next/router"
import { useContext } from "react"
import { useForm } from "react-hook-form"
import {
	DELETE_JENIS_PENGIRIMAN,
	UPDATE_JENIS_PENGIRIMAN
} from "../../../../graphql/jenis_pengiriman/mutations"
//get data using id
const GET_DATA = gql`
	query jenis_pengiriman_by_id($id: Int) {
		jenis_pengiriman_by_id(id: $id) {
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
	fontSize: `14px`,
	fontWeight: `bold`
}

export default function SettingUserEdit() {
	const { state: dashboardState } = useContext(DashboardContext)
	const router = useRouter()
	const { id } = router.query

	const setForm = useForm()
	const { reset, register } = setForm

	const { data } = useQuery(GET_DATA, {
		variables: {
			id: parseInt(id as string)
		},
		onCompleted: (data) => {
			reset({
				nama_pengiriman: data.jenis_pengiriman_by_id.nama_pengiriman
			})
		}
	})

	const [updateJenisPengiriman] = useMutation(UPDATE_JENIS_PENGIRIMAN, {
		refetchQueries: [{ query: GET_DATA }]
	})

	const updateData = (data) => {
		updateJenisPengiriman({ variables: { input: data } })
	}

	const [deleteJenisPengiriman] = useMutation(DELETE_JENIS_PENGIRIMAN, {
		refetchQueries: [{ query: GET_DATA }]
	})
	const deleteData = (id) => {
		deleteJenisPengiriman({ variables: { deleteJenisPengirimanId: id } })
		message.success(`Data Berhasil Dihapus`)
		router.push(`/data/jenis-pengiriman`)
	}

	const handleSubmitEdit = (e) => {
		e.preventDefault()
		const data = {
			id: parseInt(id as string),
			nama_pengiriman: e.target.nama_pengiriman.value,
			creator: String(dashboardState.auth.id),
			updated_by: String(dashboardState.auth.id)
		}
		updateData(data)
		message.success(`Data has been updated`)
		//redirect to index
		router.push(`/data/jenis-pengiriman`)
	}

	return (
		<AdminPage
			parent={
				<Link href="/data/jenis-pengiriman">
					<a>Jenis Pengiriman</a>
				</Link>
			}
			title={data?.jenis_pengiriman_by_id?.nama_pengiriman}
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
										form="formPengiriman"
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
				<div className="container">
					<form id="formPengiriman" onSubmit={handleSubmitEdit}>
						<div className="form-group" style={{ paddingTop: `5%` }}>
							<label style={inputStyles} htmlFor="nama_pengiriman">
								Jenis Pengiriman
							</label>
							<input
								type="text"
								className="form-control"
								style={inputStyle}
								name="nama_pengiriman"
								{...register(`nama_pengiriman`)}
								id="nama_pengiriman"
								required
							/>
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
