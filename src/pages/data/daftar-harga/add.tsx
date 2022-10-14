import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons"
import { gql, useMutation, useQuery } from "@apollo/client"
import AdminPage from "@components/admin/AdminPage.component"
import Dashboard from "@components/dashboard/Dashboard.component"
import { DashboardContext } from "@contexts/DashboardContext.context"
import { Button, Form, Input, message, Select, Space } from "antd"
import "antd/dist/antd.css"
import { GET_DAFTAR_TUJUAN } from "graphql/daftar_tujuan/queries"
import { GET_JENIS_PENGIRIMAN } from "graphql/jenis_pengiriman/queries"
import Link from "next/link"
import { useRouter } from "next/router"
import { useContext, useState } from "react"
import { useForm } from "react-hook-form"
import { CREATE_DAFTAR_HARGA } from "../../../../graphql/daftar_harga/mutations"

//get data
const GET_DATA = gql`
	query DaftarHarga {
		daftar_harga {
			id
			kode_asal
			kode_tujuan
			kode
			jenis_pengiriman
			harga
			minimal_kubik
			creator
			updated_by
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
	marginBottom: `10px`
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
	//GET DATA JENIS PENGIRIMAN
	const { data: dataJenisPengiriman } = useQuery(GET_JENIS_PENGIRIMAN)
	//GET DATA DAFTAR TUJUAN
	const { data: dataDaftarTujuan } = useQuery(GET_DAFTAR_TUJUAN)
	const router = useRouter()
	const setForm = useForm()
	const {
		control,
		reset,
		register,
		formState: { isDirty, errors }
	} = setForm

	//use state selected
	const [selectedTujuan, setSelectedTujuan] = useState()
	const [selectedAsal, setSelectedAsal] = useState()
	const [createDaftar_harga] = useMutation(CREATE_DAFTAR_HARGA, {
		refetchQueries: [{ query: GET_DATA }]
	})

	//create mutation function
	const createData = (data) => {
		createDaftar_harga({ variables: { input: data } })
	}

	const { Option } = Select

	const handleChangeTujuan = (value) => {
		setSelectedTujuan(value)
	}
	const handleChangeAsal = (value) => {
		setSelectedAsal(value)
	}

	const onFinish = (values: any) => {
		console.log(`Received values of form:`, values)
		//access only array of object inside values
		const dataSubmit = values.daftar_harga.map((item: any) => {
			return {
				kode: `${selectedAsal}${selectedAsal}`,
				kode_asal: selectedAsal,
				kode_tujuan: selectedTujuan,
				jenis_pengiriman: item.jenis_pengiriman,
				harga: parseInt(item.harga),
				minimal_kubik: item.minimal_kubik,
				creator: String(dashboardState.auth.id),
				updated_by: String(dashboardState.auth.id)
			}
		})
		//count array of object length
		const count = dataSubmit.length

		//for loop to create data
		for (let i = 0; i < count; i++) {
			createData(dataSubmit[i])
		}
		message.success(`Data berhasil ditambahkan`)
		router.push(`/data/daftar-harga`)
	}

	// const handleSubmit = (e) => {
	// 	e.preventDefault()
	// 	const data = {
	// 		kode_asal: e.target.kode_asal.value,
	// 		kode_tujuan: e.target.kode_tujuan.value,
	// 		jenis_pengiriman: e.target.jenis_pengiriman.value,
	// 		//parse string to int harga
	// 		harga: parseInt(e.target.harga.value),
	// 		minimal_kubik: e.target.minimal_kubik.value,
	// 		creator: String(dashboardState.auth.id),
	// 		updated_by: String(dashboardState.auth.id)
	// 	}
	// 	createData(data)
	// 	message.success(`Data berhasil ditambahkan`)
	// 	console.log(`data nya ialah`, data)
	// 	router.push(`/data/daftar-harga`)
	// }

	//map data jenis pengiriman
	const mapJenisPengiriman = dataJenisPengiriman?.jenis_pengiriman?.map(
		(jenis_pengiriman) => {
			return {
				label: jenis_pengiriman.nama_pengiriman
			}
		}
	)

	//map data tujuan
	const mapTujuan = dataDaftarTujuan?.daftar_tujuan?.map((tujuan) => {
		return {
			label: tujuan.kode_tujuan
		}
	})
	return (
		<AdminPage
			parent={
				<Link href="/data/daftar-harga">
					<a>Daftar Harga</a>
				</Link>
			}
			authId=""
			title="Tambahkan Harga"
			legend=""
			setForm={setForm}
		>
			<section className="section">
				<div className="container">
					<Form
						name="dynamic_form_nest_item"
						onFinish={onFinish}
						autoComplete="off"
					>
						<Form.Item>
							<Button
								key="submit"
								htmlType="submit"
								className="submit"
								style={{
									marginLeft: `92%`,
									backgroundColor: `black`,
									borderColor: `black`
								}}
								type="primary"
							>
								Tambah
							</Button>
						</Form.Item>
						<Form.Item name="kode_asal">
							<label style={{ fontWeight: `bold` }}> Kota Asal</label>
							<Select
								placeholder="Pilih kode asal"
								onChange={handleChangeTujuan}
							>
								{mapTujuan?.map((tujuan) => {
									return (
										<Option key={tujuan.label} value={tujuan.label}>
											{tujuan.label}
										</Option>
									)
								})}
							</Select>
						</Form.Item>
						<Form.Item name="kode_tujuan">
							<label style={{ fontWeight: `bold` }}> Kota Tujuan</label>
							<Select
								placeholder="Pilih kode tujuan"
								onChange={handleChangeAsal}
							>
								{mapTujuan?.map((tujuan) => {
									return (
										<Option key={tujuan.label} value={tujuan.label}>
											{tujuan.label}
										</Option>
									)
								})}
							</Select>
						</Form.Item>
						<Form.List name="daftar_harga">
							{(fields, { add, remove }) => (
								<>
									{fields.map(({ key, name, ...restField }) => (
										<Space
											key={key}
											style={{
												display: `flex`,
												width: `100%`,
												marginBottom: 8
											}}
											align="baseline"
										>
											<Form.Item name={[name, `jenis_pengiriman`]}>
												<Select
													placeholder="Pilih Jenis Pengiriman"
													style={{ width: `175%` }}
													key="jenis_pengiriman"
												>
													{mapJenisPengiriman?.map((jenis_pengiriman) => {
														return (
															<Option
																key={jenis_pengiriman.label}
																value={jenis_pengiriman.label}
															>
																{jenis_pengiriman.label}
															</Option>
														)
													})}
												</Select>
											</Form.Item>
											<Form.Item
												{...restField}
												name={[name, `harga`]}
												rules={[{ required: true, message: `Missing ` }]}
												style={{ marginLeft: `100%`, width: `175%` }}
												key="harga"
											>
												<Input placeholder="harga" />
											</Form.Item>
											<Form.Item
												{...restField}
												style={{ marginLeft: `200%`, width: `175%` }}
												name={[name, `minimal_kubik`]}
												rules={[{ required: true, message: `Missing` }]}
												key={key}
											>
												<Input placeholder="minimal_kubik" />
											</Form.Item>
											<Form.Item style={{ marginLeft: `3500%`, width: `175%` }}>
												<MinusCircleOutlined onClick={() => remove(name)} />
											</Form.Item>
										</Space>
									))}
									<Form.Item>
										<Button
											type="dashed"
											style={{ marginTop: `5%` }}
											onClick={() => add()}
											block
											icon={<PlusOutlined />}
										>
											Add field
										</Button>
									</Form.Item>
								</>
							)}
						</Form.List>
					</Form>
				</div>
			</section>
		</AdminPage>
	)
}

SettingUserEdit.getLayout = function getLayout(page) {
	return <Dashboard>{page}</Dashboard>
}
