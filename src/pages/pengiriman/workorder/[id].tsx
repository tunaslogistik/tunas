/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/img-redundant-alt */
import { gql, useMutation, useQuery } from "@apollo/client"
import AdminPage from "@components/admin/AdminPage.component"
import Dashboard from "@components/dashboard/Dashboard.component"
import Access from "@components/util/Access.component"
import { DashboardContext } from "@contexts/DashboardContext.context"
import { supabase } from "@utils/supabase"
import { Button, message, Modal, Table } from "antd"
import TextArea from "antd/lib/input/TextArea"
import moment from "moment"
import Link from "next/link"
import { useRouter } from "next/router"
import { ChangeEvent, useContext, useState } from "react"
import { useForm } from "react-hook-form"
import { UPDATE_DAFTAR_WORKORDER } from "../../../../graphql/daftar_workorder/mutations"
//get data using id
const GET_DATA = gql`
	query daftar_workorder {
		daftar_workorder {
			id
			nomor_workorder
			kendaraan
			nomor_container
			nomor_seal
			kota_tujuan
			komentar_container
			komentar_muat_barang
			komentar_menuju_pelabuhan
			komentar_tiba_pelabuhan
			komentar_muatan
			komentar_destinasi
			tanggal_wo
			tanggal_container
			tanggal_muat_barang
			tanggal_menuju_pelabuhan
			tanggal_tiba_pelabuhan
			tanggal_muatan
			tanggal_destinasi
			nomor_kendaraan
			nama_supir
			nama_kenek
			wa_supir
			wa_kenek
			photo_container
			photo_seal_pelabuhan
			photo_surat_jalan
			photo_muat_barang
			photo_seal_muatan
			photo_seal_destinasi
			status
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
	const { register } = setForm

	const { data } = useQuery(GET_DATA, {
		variables: { id: parseInt(id as string) }
	})

	const [updateDaftrWorkorder] = useMutation(UPDATE_DAFTAR_WORKORDER, {
		refetchQueries: [{ query: GET_DATA }]
	})

	const updateData = (data) => {
		updateDaftrWorkorder({ variables: { input: data } })
	}

	//usestate for preview image
	const [file, setFile] = useState<File | null>(null)

	const [file2, setFile2] = useState<File | null>(null)
	//set url
	const [url, setUrl] = useState(``)

	//set komentar
	const [komentar, setKomentar] = useState(``)
	//set komentar muat barang
	const [komentarMuatBarang, setKomentarMuatBarang] = useState(``)
	//set komentar menuju pelabuhan
	const [komentarMenujuPelabuhan, setKomentarMenujuPelabuhan] = useState(``)
	//set komentar tiba pelabuhan
	const [komentarTibaPelabuhan, setKomentarTibaPelabuhan] = useState(``)
	//set komentar muatan
	const [komentarMuatan, setKomentarMuatan] = useState(``)
	//set komentar destinasi
	const [komentarDestinasi, setKomentarDestinasi] = useState(``)

	//handle upload image
	const handleUpload = async (e: ChangeEvent<HTMLInputElement>) => {
		setFile(setForm.getValues(`photo_container`))

		const { data, error } = await supabase.storage
			.from(`workorder-bucket`)
			.upload(`workorder/${file.name}`, file as File)

		if (data) {
			console.log(data)
		} else if (error) {
			console.log(error)
		}

		const { data: urlData } = await supabase.storage
			.from(`workorder-bucket`)
			.getPublicUrl(`workorder/${file.name}`)
		if (urlData) {
			console.log(urlData)
			setUrl(urlData.publicUrl)
		} else if (error) {
			console.log(error)
		}

		const datas = {
			id: parseInt(id as string),
			photo_container: urlData.publicUrl,
			komentar_container: komentar,
			tanggal_container: moment().format(`YYYY-MM-DD HH:mm:ss`),
			status: `container`
		}

		updateData(datas)

		message.success(`Upload berhasil`)
	}

	const handleUploadMuatBarang = async (e: ChangeEvent<HTMLInputElement>) => {
		setFile(setForm.getValues(`photo_muat_barang`))

		const { data, error } = await supabase.storage
			.from(`workorder-bucket`)
			.upload(`workorder/${file.name}`, file as File)

		if (data) {
			console.log(data)
		} else if (error) {
			console.log(error)
		}

		const { data: urlData } = await supabase.storage
			.from(`workorder-bucket`)
			.getPublicUrl(`workorder/${file.name}`)
		if (urlData) {
			console.log(urlData)
			setUrl(urlData.publicUrl)
		} else if (error) {
			console.log(error)
		}

		const datas = {
			id: parseInt(id as string),
			photo_muat_barang: urlData.publicUrl,
			//new date
			tanggal_muat_barang: moment().format(`YYYY-MM-DD HH:mm:ss`),
			komentar_muat_barang: komentarMuatBarang,
			status: `muat_barang`
		}

		updateData(datas)

		message.success(`Upload berhasil`)
	}

	const handleUploadMenujuPelabuhan = async (
		e: ChangeEvent<HTMLInputElement>
	) => {
		setFile(setForm.getValues(`photo_menuju_pelabuhan`))

		const { data, error } = await supabase.storage
			.from(`workorder-bucket`)
			.upload(`workorder/${file.name}`, file as File)

		if (data) {
			console.log(data)
		} else if (error) {
			console.log(error)
		}

		const { data: data2 } = await supabase.storage
			.from(`workorder-bucket`)
			.upload(`workorder/${file2.name}`, file2 as File)

		if (data) {
			console.log(data2)
		} else if (error) {
			console.log(error)
		}

		const { data: urlData } = await supabase.storage
			.from(`workorder-bucket`)
			.getPublicUrl(`workorder/${file.name}`)
		if (urlData) {
			console.log(urlData)
			setUrl(urlData.publicUrl)
		} else if (error) {
			console.log(error)
		}

		const { data: urlData2 } = await supabase.storage
			.from(`workorder-bucket`)
			.getPublicUrl(`workorder/${file2.name}`)
		if (urlData2) {
			console.log(urlData2)
			setUrl(urlData2.publicUrl)
		} else if (error) {
			console.log(error)
		}

		const datas = {
			id: parseInt(id as string),
			photo_seal_pelabuhan: urlData.publicUrl,
			photo_surat_jalan: urlData2.publicUrl,
			//new date
			tanggal_menuju_pelabuhan: moment().format(`YYYY-MM-DD HH:mm:ss`),
			komentar_menuju_pelabuhan: komentarMenujuPelabuhan,
			status: `menuju_pelabuhan`
		}

		updateData(datas)

		message.success(`Upload berhasil`)
	}

	const handleUploadTibaPelabuhan = async (
		e: ChangeEvent<HTMLInputElement>
	) => {
		setFile(setForm.getValues(`photo_tiba_pelabuhan`))

		const datas = {
			id: parseInt(id as string),
			komentar_tiba_pelabuhan: komentarTibaPelabuhan,
			//new date
			tanggal_tiba_pelabuhan: moment().format(`YYYY-MM-DD HH:mm:ss`),
			status: `tiba_pelabuhan`
		}

		updateData(datas)

		message.success(`Upload berhasil`)
	}

	const handleUploadMuatan = async (e: ChangeEvent<HTMLInputElement>) => {
		setFile(setForm.getValues(`photo_muatan`))

		const { data, error } = await supabase.storage
			.from(`workorder-bucket`)
			.upload(`workorder/${file.name}`, file as File)

		if (data) {
			console.log(data)
		} else if (error) {
			console.log(error)
		}

		const { data: urlData } = await supabase.storage
			.from(`workorder-bucket`)
			.getPublicUrl(`workorder/${file.name}`)
		if (urlData) {
			console.log(urlData)
			setUrl(urlData.publicUrl)
		} else if (error) {
			console.log(error)
		}

		const datas = {
			id: parseInt(id as string),
			photo_seal_muatan: urlData.publicUrl,
			komentar_muatan: komentarMuatan,
			status: `muatan`
		}

		updateData(datas)

		message.success(`Upload berhasil`)
	}

	const handleUploadDestinasi = async (e: ChangeEvent<HTMLInputElement>) => {
		setFile(setForm.getValues(`photo_destinasi`))

		const { data, error } = await supabase.storage
			.from(`workorder-bucket`)
			.upload(`workorder/${file.name}`, file as File)

		if (data) {
			console.log(data)
		} else if (error) {
			console.log(error)
		}

		const { data: urlData } = await supabase.storage
			.from(`workorder-bucket`)
			.getPublicUrl(`workorder/${file.name}`)
		if (urlData) {
			console.log(urlData)
			setUrl(urlData.publicUrl)
		} else if (error) {
			console.log(error)
		}

		const datas = {
			id: parseInt(id as string),
			photo_seal_destinasi: urlData.publicUrl,
			komentar_destinasi: komentarDestinasi,
			//new date
			tanggal_destinasi: moment().format(`YYYY-MM-DD HH:mm:ss`),
			status: `destinasi`
		}

		updateData(datas)

		message.success(`Upload berhasil`)
	}

	// photo_container
	// photo_seal_pelabuhan
	// photo_surat_jalan
	// 	photo_muat_barang
	// 	photo_seal_muatan
	// 	photo_seal_destinasi

	//pop up modal
	const [visibleContainer, setVisibleContainer] = useState(false)
	//visible muat barang
	const [visibleMuatBarang, setVisibleMuatBarang] = useState(false)
	//visible menuju pelabuhan
	const [visibleMenujuPelabuhan, setVisibleMenujuPelabuhan] = useState(false)
	//visible tiba pelabuhan
	const [visibleTibaPelabuhan, setVisibleTibaPelabuhan] = useState(false)
	//visible muatan
	const [visibleMuatan, setVisibleMuatan] = useState(false)
	//visible destinasi
	const [visibleDestinasi, setVisibleDestinasi] = useState(false)

	//handle okContainer
	const handleOkContainer = () => {
		//handle upload image
		let e
		handleUpload(e)
		setVisibleContainer(false)
	}

	const handleCancel = () => {
		setVisibleContainer(false)
		setVisibleMuatBarang(false)
		setVisibleMenujuPelabuhan(false)
		setVisibleTibaPelabuhan(false)
		setVisibleMuatan(false)
		setVisibleDestinasi(false)
	}

	const handleOkMuatBarang = () => {
		//handle upload image
		let e
		handleUploadMuatBarang(e)
		setVisibleMuatBarang(false)
	}

	const handleOkMenujuPelabuhan = () => {
		//handle upload image
		let e
		handleUploadMenujuPelabuhan(e)
		setVisibleMenujuPelabuhan(false)
	}

	const handleOkTibaPelabuhan = () => {
		//handle upload image
		let e
		handleUploadTibaPelabuhan(e)
		setVisibleTibaPelabuhan(false)
	}

	const handleOkMuatan = () => {
		//handle upload image
		let e
		handleUploadMuatan(e)
		setVisibleMuatan(false)
	}

	const handleOkDestinasi = () => {
		//handle upload image
		let e
		handleUploadDestinasi(e)
		setVisibleDestinasi(false)
	}

	//make antd table for status, tanggal, photo and komentar
	const columns = [
		{
			title: `Status`,
			//data index status and tanggal
			dataIndex: [`status`, `tanggal`],
			key: `status`,
			render: (text, record) => (
				<span
					style={{
						color: record.tanggal ? `green` : `black`
					}}
				>
					{record.status}
				</span>
			)
		},
		{
			title: `Tanggal`,
			dataIndex: `tanggal`,
			key: `tanggal`
		},

		{
			title: `Photo`,
			dataIndex: `photo`,
			key: `photo`,
			//make photo from dataindex if dataindex is null then show text "Belum ada foto"
			render: (photo) => (
				<>
					{photo ? (
						<img src={photo} alt="photo" style={{ width: 100, height: 100 }} />
					) : (
						<p></p>
					)}
				</>
			)
		},
		{
			title: `Komentar`,
			dataIndex: `komentar`,
			key: `komentar`
		}
	]

	const columnsSuratJalan = [
		{
			title: `Status`,
			//data index status and tanggal
			dataIndex: [`status`, `tanggal`],
			key: `status`,
			render: (text, record) => (
				<span
					style={{
						color: record.tanggal ? `green` : `black`
					}}
				>
					{record.status}
				</span>
			)
		},
		{
			title: `Tanggal`,
			dataIndex: `tanggal`,
			key: `tanggal`
		},
		{
			title: `Photo`,
			dataIndex: [`photo`, `phot_surat_jalan`],
			key: `photo`,
			//photo above photo_surat_jalan
			render: (text, record) => (
				<>
					{record.photo ? (
						<img
							src={record.photo}
							alt="photo"
							style={{
								width: 100
							}}
						/>
					) : null}
					{record.photo_surat_jalan ? (
						<img
							src={record.photo_surat_jalan}
							alt="photo"
							style={{
								width: 100
							}}
						/>
					) : null}
				</>
			)
		},
		{
			title: `Komentar`,
			dataIndex: `komentar`,
			key: `komentar`
		}
	]

	//map data container from data
	const dataContainer = data?.daftar_workorder?.map((item) => {
		return {
			key: item.id,
			status: `AMBIL CONTAINER`,
			tanggal: item.tanggal_container,
			photo: item.photo_container,
			komentar: item.komentar_container
		}
	})

	//map data muat barang from data
	const dataMuatBarang = data?.daftar_workorder?.map((item) => {
		return {
			key: item.id,
			status: `MUAT BARANG`,
			tanggal: item.tanggal_muat_barang,
			photo: item.photo_muat_barang,
			komentar: item.komentar_muat_barang
		}
	})

	//map data menuju pelabuhan from data
	const dataMenujuPelabuhan = data?.daftar_workorder?.map((item) => {
		return {
			key: item.id,
			status: `MENUJU PELABUHAN`,
			tanggal: item.tanggal_menuju_pelabuhan,
			photo: item.photo_seal_pelabuhan,
			photo_surat_jalan: item.photo_surat_jalan,
			komentar: item.komentar_menuju_pelabuhan
		}
	})

	//map data tiba pelabuhan from data
	const dataTibaPelabuhan = data?.daftar_workorder?.map((item) => {
		return {
			key: item.id,
			status: `TIBA PELABUHAN`,
			tanggal: item.tanggal_tiba_pelabuhan,
			komentar: item.komentar_tiba_pelabuhan
		}
	})

	//map data muatan from data
	const dataMuatan = data?.daftar_workorder?.map((item) => {
		return {
			key: item.id,
			status: `PINDAH MUATAN`,
			tanggal: item.tanggal_muatan,
			photo: item.photo_seal_muatan,
			komentar: item.komentar_muatan
		}
	})

	//map data destinasi from data
	const dataDestinasi = data?.daftar_workorder?.map((item) => {
		return {
			key: item.id,
			status: `MENUJU DESTINASI`,
			tanggal: item.tanggal_destinasi,
			photo: item.photo_seal_destinasi,
			komentar: item.komentar_destinasi
		}
	})
	return (
		<AdminPage
			parent={
				<Link href="/pengiriman/workorder">
					<a>Work Order</a>
				</Link>
			}
			authId=""
			title="Tambah Work Order"
			legend=""
			setForm={setForm}
			action={
				<Access
					auth="write:settings-users"
					yes={
						<ul className="actions">
							<li className="action">
								<Button
									type="primary"
									style={{
										backgroundColor: `black`,
										borderColor: `black`
									}}
									onClick={() => {
										if (data?.daftar_workorder[0]?.status === ``) {
											setVisibleContainer(true)
										} else if (
											data?.daftar_workorder[0]?.status === `container`
										) {
											setVisibleMuatBarang(true)
										} else if (
											data?.daftar_workorder[0]?.status === `muat_barang`
										) {
											setVisibleMenujuPelabuhan(true)
										} else if (
											data?.daftar_workorder[0]?.status === `menuju_pelabuhan`
										) {
											setVisibleTibaPelabuhan(true)
										} else if (
											data?.daftar_workorder[0]?.status === `tiba_pelabuhan`
										) {
											setVisibleMuatan(true)
										} else if (
											data?.daftar_workorder[0]?.status === `pindah_muatan`
										) {
											setVisibleDestinasi(true)
										}
									}}
								>
									Update
								</Button>
							</li>
						</ul>
					}
				/>
			}
		>
			<section className="section">
				<div className="container">
					<div
						className="form-group"
						style={{
							display: `inline-block`,
							width: `calc(60% - 8px)`,
							marginTop: `1%`
						}}
					>
						<p>
							<p style={{ display: `inline-block` }}>
								Tanggal Workorder :{` `}
								<p style={{ fontWeight: `bold`, display: `inline-block` }}>
									{moment(data?.daftar_workorder[0]?.tanggal_wo).format(
										`DD/MM/YYYY`
									)}
								</p>
							</p>
						</p>
						<p>
							<p style={{ display: `inline-block` }}>
								Kota Tujuan :{` `}
								<p style={{ fontWeight: `bold`, display: `inline-block` }}>
									{data?.daftar_workorder[0]?.kota_tujuan}
								</p>
							</p>
						</p>
						<p>
							<p style={{ display: `inline-block` }}>
								No. Container :{` `}
								<p style={{ fontWeight: `bold`, display: `inline-block` }}>
									{data?.daftar_workorder[0]?.nomor_container}
								</p>
							</p>
						</p>
						<p>
							<p style={{ display: `inline-block` }}>
								No. Seal :{` `}
								<p style={{ fontWeight: `bold`, display: `inline-block` }}>
									{data?.daftar_workorder[0]?.nomor_seal}
								</p>
							</p>
						</p>
					</div>
					<div
						className="form-group"
						style={{
							display: `inline-block`,
							width: `calc(40% - 8px)`,
							textAlign: `left`,
							float: `right`,

							marginTop: `1%`
						}}
					>
						<p>
							<p style={{ display: `inline-block` }}>
								Nomor Kendaraan :{` `}
								<p style={{ fontWeight: `bold`, display: `inline-block` }}>
									{data?.daftar_workorder[0]?.nomor_kendaraan}
								</p>
							</p>
						</p>
						<p>
							<p style={{ display: `inline-block` }}>
								Tipe Kendaraan :{` `}
								<p style={{ fontWeight: `bold`, display: `inline-block` }}>
									{data?.daftar_workorder[0]?.kendaraan}
								</p>
							</p>
						</p>
						<p>
							<p style={{ display: `inline-block` }}>
								Supir :{` `}
								<p style={{ fontWeight: `bold`, display: `inline-block` }}>
									{data?.daftar_workorder[0]?.nama_supir} /{` `}
									{data?.daftar_workorder[0]?.wa_supir}
								</p>
							</p>
						</p>
						<p>
							<p style={{ display: `inline-block` }}>
								Kenek :{` `}
								<p style={{ fontWeight: `bold`, display: `inline-block` }}>
									{data?.daftar_workorder[0]?.nama_kenek} / {` `}
									{data?.daftar_workorder[0]?.wa_kenek}
								</p>
							</p>
						</p>
					</div>
					<Table
						style={{ marginTop: `5%` }}
						rowKey={(record) => record.id}
						columns={columns}
						dataSource={dataContainer}
						pagination={false}
					/>
					<Table
						rowKey={(record) => record.id}
						showHeader={false}
						columns={columns}
						dataSource={dataMuatBarang}
						pagination={false}
					/>
					<Table
						rowKey={(record) => record.id}
						showHeader={false}
						columns={columnsSuratJalan}
						dataSource={dataMenujuPelabuhan}
						pagination={false}
					/>
					<Table
						rowKey={(record) => record.id}
						showHeader={false}
						columns={columns}
						dataSource={dataTibaPelabuhan}
						pagination={false}
					/>
					<Table
						rowKey={(record) => record.id}
						showHeader={false}
						columns={columns}
						dataSource={dataMuatan}
						pagination={false}
					/>
					<Table
						rowKey={(record) => record.id}
						showHeader={false}
						columns={columns}
						dataSource={dataDestinasi}
						pagination={false}
					/>
					<form id="formWorkorder">
						<Modal
							title="Upload Photo Container"
							visible={visibleContainer}
							onOk={handleOkContainer}
							onCancel={handleCancel}
						>
							<input
								type="file"
								name="photo_container"
								onChange={(e) => {
									setFile(e.target.files[0])
								}}
							/>
							<TextArea
								name="photo_container"
								placeholder="Photo Container"
								style={{ marginTop: `10px` }}
								{...register(`komentar_container`)}
								onChange={(e) => {
									setKomentar(e.target.value)
								}}
							/>
						</Modal>
						<Modal
							title="Upload Photo Muat Barang"
							visible={visibleMuatBarang}
							onOk={handleOkMuatBarang}
							onCancel={handleCancel}
						>
							<input
								type="file"
								name="photo_muat_barang"
								onChange={(e) => {
									setFile(e.target.files[0])
								}}
							/>
							<TextArea
								name="photo_muat_barang"
								placeholder="Photo Muat Barang"
								style={{ marginTop: `10px` }}
								{...register(`photo_muat_barang`)}
								onChange={(e) => {
									setKomentarMuatBarang(e.target.value)
								}}
							/>
						</Modal>
						<Modal
							title="Upload Photo Menuju Pelabuhan"
							visible={visibleMenujuPelabuhan}
							onOk={handleOkMenujuPelabuhan}
							onCancel={handleCancel}
						>
							<input
								type="file"
								name="photo_menuju_pelabuhan"
								onChange={(e) => {
									setFile(e.target.files[0])
								}}
							/>
							<input
								type="file"
								name="photo_seal"
								style={{ marginTop: `2%` }}
								onChange={(e) => {
									setFile2(e.target.files[0])
								}}
							/>
							<TextArea
								name="photo_muat_barang"
								placeholder="Photo Muat Barang"
								style={{ marginTop: `10px` }}
								{...register(`photo_menuju_pelabuhan`)}
								onChange={(e) => {
									setKomentarMenujuPelabuhan(e.target.value)
								}}
							/>
						</Modal>
						<Modal
							title="Upload Photo tiba pelabuhan"
							visible={visibleTibaPelabuhan}
							onOk={handleOkTibaPelabuhan}
							onCancel={handleCancel}
						>
							<TextArea
								name="komentar_tiba_pelabuhan"
								placeholder="Komentar Tiba Pelabuhan"
								style={{ marginTop: `10px` }}
								{...register(`komentar_tiba_pelabuhan`)}
								onChange={(e) => {
									setKomentarTibaPelabuhan(e.target.value)
								}}
							/>
						</Modal>
						<Modal
							title="Upload Photo Pindah Muatan"
							visible={visibleMuatan}
							onOk={handleOkMuatan}
							onCancel={handleCancel}
						>
							<input
								type="file"
								name="photo_container"
								onChange={(e) => {
									setFile(e.target.files[0])
								}}
							/>
							<TextArea
								name="photo_seal_muatan"
								placeholder="Photo Seal Muatan"
								style={{ marginTop: `10px` }}
								{...register(`photo_seal_muatan`)}
								onChange={(e) => {
									setKomentarMuatan(e.target.value)
								}}
							/>
						</Modal>
						<Modal
							title="Upload Photo"
							visible={visibleDestinasi}
							onOk={handleOkDestinasi}
							onCancel={handleCancel}
						>
							<input
								type="file"
								name="photo_seal_destinasi"
								onChange={(e) => {
									setFile(e.target.files[0])
								}}
							/>
							<TextArea
								name="photo_seal_destinasi"
								placeholder="Photo Seal Destinasi"
								style={{ marginTop: `10px` }}
								{...register(`photo_seal_destinasi`)}
								onChange={(e) => {
									setKomentarDestinasi(e.target.value)
								}}
							/>
						</Modal>
					</form>
				</div>
			</section>
		</AdminPage>
	)
}

SettingUserEdit.getLayout = function getLayout(page) {
	return <Dashboard>{page}</Dashboard>
}