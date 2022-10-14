import { gql, useMutation, useQuery } from "@apollo/client"
import AdminPage from "@components/admin/AdminPage.component"
import Dashboard from "@components/dashboard/Dashboard.component"
import Access from "@components/util/Access.component"
import { DashboardContext } from "@contexts/DashboardContext.context"
import { Button, message, Popconfirm } from "antd"
import "antd/dist/antd.css"
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
	query Jenis_pengiriman {
		jenis_pengiriman {
			id
			nama_pengiriman
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
	fontSize: `14px`,
	fontWeight: `bold`
}

interface DataType {
	id: number
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
	const { id } = router.query
	const setForm = useForm()
	const {
		formState: { isDirty, errors }
	} = setForm

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

	//filter data by id
	const filteredData = data?.jenis_pengiriman.filter(
		(item) => item.id === parseInt(id as string)
	)
	//map fileteredData
	const mappedData = filteredData
		?.map((item) => {
			return {
				id: item.id,
				nama_pengiriman: item.nama_pengiriman,
				creator: String(dashboardState.auth.id),
				updated_by: String(dashboardState.auth.id)
			}
		})
		.pop()

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
		console.log(`data update nya ialah : `, data)
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
			title={mappedData?.nama_pengiriman}
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
					<div className="columns">
						<div className="column is-half is-offset-one-quarter">
							<div className="card">
								<div className="card-content">
									<div className="content">
										<form id="formPengiriman" onSubmit={handleSubmitEdit}>
											<div className="form-group" style={{ paddingTop: `5%` }}>
												<label style={inputStyles} htmlFor="nama_pengiriman">
													Nama Tujuan
												</label>
												<input
													type="text"
													className="form-control"
													style={inputStyle}
													id="nama_pengiriman"
													defaultValue={mappedData?.nama_pengiriman}
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

SettingUserEdit.getLayout = function getLayout(page) {
	return <Dashboard>{page}</Dashboard>
}
