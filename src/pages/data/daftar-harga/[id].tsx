import { gql, useMutation, useQuery } from "@apollo/client"
import AdminPage from "@components/admin/AdminPage.component"
import Dashboard from "@components/dashboard/Dashboard.component"
import Access from "@components/util/Access.component"
import { DashboardContext } from "@contexts/DashboardContext.context"
import useLoading from "@hooks/useLoading.hook"
import { Button, message, Popconfirm } from "antd"
import "antd/dist/antd.css"
import {
	CREATE_DAFTAR_HARGA,
	DELETE_DAFTAR_HARGA
} from "graphql/daftar_harga/mutations"
import Link from "next/link"
import { useRouter } from "next/router"
import { useContext } from "react"
import { useForm } from "react-hook-form"
import FormRepeater from "../../../components/form/FormRepeater.component"
//get data
const GET_DATA = gql`
	query DaftarHarga {
		daftar_harga {
			id
			kode_asal
			kode_tujuan
			jenis_pengiriman
			harga
			minimal_kubik
			creator
			updated_by
		}
	}
`

//text input style
const inputStyle = {
	width: `100%`,
	fontWeight: `bold`,
	marginBottom: `10px`
}
const inputStyles = {
	width: `100%`,
	marginBottom: `10px`
}

export default function SettingUserEdit() {
	const { state: dashboardState } = useContext(DashboardContext)
	const setForm = useForm()
	const { setLoading } = useLoading()
	const { control, reset, handleSubmit, register } = setForm
	const router = useRouter()
	const { id } = router.query
	const { data } = useQuery(GET_DATA, {
		onCompleted({ daftar_harga }) {
			const data = daftar_harga
			const filteredData = daftar_harga?.filter(
				(item) => item.id === parseInt(id as string)
			)

			const kode_asal = filteredData[0].kode_asal
			const kode_tujuan = filteredData[0].kode_tujuan
			//filter by kode_t
			var newArray = data.filter(function (el) {
				return el.kode_asal === kode_asal && el.kode_tujuan === kode_tujuan
			})
			reset({ newArray })
		}
	})

	const [createDaftar_harga] = useMutation(CREATE_DAFTAR_HARGA, {
		refetchQueries: [{ query: GET_DATA }]
	})

	//create mutation function
	const createData = (data) => {
		createDaftar_harga({ variables: { input: data } })
	}

	const [deleteDaftar_harga] = useMutation(DELETE_DAFTAR_HARGA, {
		refetchQueries: [{ query: GET_DATA }]
	})
	const deleteData = (id) => {
		deleteDaftar_harga({ variables: { deleteDaftar_hargaId: id } })
		router.push(`/data/daftar-harga`)
	}

	const filteredData = data?.daftar_harga.filter(
		(item) => item.id === parseInt(id as string)
	)
	//map fileteredData
	const mappedData = filteredData
		?.map((item) => {
			return {
				id: item.id,
				kode_tujuan: item.kode_tujuan,
				kode_asal: item.kode_asal,
				jenis_pengiriman: item.jenis_pengiriman,
				harga: item.harga,
				minimal_kubik: item.minimal_kubik,
				creator: String(dashboardState.auth.id),
				updated_by: String(dashboardState.auth.id)
			}
		})
		.pop()
	const nofilteredData = data?.daftar_harga.filter(
		(item) =>
			item.kode_asal === mappedData?.kode_asal &&
			item.kode_tujuan === mappedData?.kode_tujuan
	)
	const mappedDataall = nofilteredData
		?.map((item) => {
			return {
				id: item.id,
				kode_tujuan: item.kode_tujuan,
				kode_asal: item.kode_asal,
				jenis_pengiriman: item.jenis_pengiriman,
				harga: item.harga,
				minimal_kubik: item.minimal_kubik,
				creator: String(dashboardState.auth.id),
				updated_by: String(dashboardState.auth.id)
			}
		})
		.pop()

	const kota_asal = mappedDataall?.kode_asal

	const kota_tujuan = mappedDataall?.kode_tujuan

	async function onSubmit(formData) {
		setLoading(true)
		try {
			const objArray = Object.keys(formData).map((i) => formData[i])

			const myChildren = objArray

			const datas = myChildren.shift()
			const temp = datas.map((datum) => {
				return {
					id: datum.id,
					kode_asal: kota_asal,
					kode_tujuan: kota_tujuan,
					kode: kota_asal + kota_tujuan,
					jenis_pengiriman: datum.jenis_pengiriman,
					harga: parseInt(datum.harga),
					minimal_kubik: datum.minimal_kubik,
					creator: String(dashboardState.auth.id),
					updated_by: String(dashboardState.auth.id)
				}
			})

			//delete all no filtered data
			// eslint-disable-next-line array-callback-return
			nofilteredData?.map((item) => {
				deleteData(item.id)
			})

			//create new data
			for (let i = 0; i < temp.length; i++) {
				createData(temp[i])
			}
			message.success(`Data Berhasil Disimpan`)
			router.push(`/data/daftar-harga`)
		} catch (error) {
			console.log(error)
		}
		setLoading(false)
	}
	return (
		<AdminPage
			parent={
				<Link href="/data/daftar-harga">
					<a>Daftar Harga</a>
				</Link>
			}
			title={mappedData?.kode_asal}
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
										form="formHarga"
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
									<form id="formHarga" onSubmit={handleSubmit(onSubmit)}>
										<div className="form-group" style={{ paddingTop: `5%` }}>
											<label style={inputStyle} htmlFor="kode_asal">
												Kode asal
											</label>
											<input
												type="text"
												className="form-control"
												style={inputStyles}
												id="kode_asal"
												defaultValue={mappedDataall?.kode_asal}
												disabled
											/>
										</div>
										<div className="form-group">
											<label style={inputStyle} htmlFor="kode_tujuan">
												Kode tujuan
											</label>
											<input
												type="text"
												className="form-control"
												style={inputStyles}
												id="kode_tujuan"
												defaultValue={mappedDataall?.kode_tujuan}
												disabled
											/>
										</div>
										<div className="content">
											<FormRepeater
												setForm={setForm}
												control={control}
												register={register}
												name="newArray"
												inputNames={[
													`jenis_pengiriman`,
													`harga`,
													`minimal_kubik`
												]}
												inputLabels={[
													`Jenis Pengiriman`,
													`Harga`,
													`Minimal Kubik`
												]}
												inputProps={[
													{
														type: `text`,
														placeholder: `Jenis Pengiriman`,
														style: { width: `400px`, marginLeft: `0px` }
													},
													{
														type: `text`,
														placeholder: `Harga`,
														style: { width: `100%`, marginLeft: `0px` }
													},
													{
														type: `text`,
														placeholder: `Minimal Kubik`,
														style: { width: `100%` }
													}
												]}
											/>
										</div>
									</form>
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
