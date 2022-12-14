/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/img-redundant-alt */
import { useMutation, useQuery } from "@apollo/client"
import AdminPage from "@components/admin/AdminPage.component"
import Dashboard from "@components/dashboard/Dashboard.component"
import Access from "@components/util/Access.component"
import { supabase } from "@utils/supabase"
import { Button, Modal, Table, message } from "antd"
import TextArea from "antd/lib/input/TextArea"
import { GET_DAFTAR_WORKORDER_BY_ID } from "graphql/daftar_workorder/queries"
import moment from "moment"
import Link from "next/link"
import { useRouter } from "next/router"
import { ChangeEvent, useState } from "react"
import { useForm } from "react-hook-form"
import { UPDATE_DAFTAR_WORKORDER } from "../../../../graphql/daftar_workorder/mutations"

export default function Home() {
	const router = useRouter()
	const { id } = router.query

	const setForm = useForm()
	const { register } = setForm

	const { data } = useQuery(GET_DAFTAR_WORKORDER_BY_ID, {
		variables: { id: Number(id) },
		pollInterval: 100
	})

	//make data into array of object
	const dataSource = data?.daftar_workorder_by_id
		? [data?.daftar_workorder_by_id]
		: []

	const [updateDaftrWorkorder] = useMutation(UPDATE_DAFTAR_WORKORDER, {
		refetchQueries: [{ query: GET_DAFTAR_WORKORDER_BY_ID }]
	})

	const updateData = (data) => {
		updateDaftrWorkorder({ variables: { input: data } })
	}

	//usestate for preview image
	const [file, setFile] = useState<File | null>(null)

	const [file2, setFile2] = useState<File | null>(null)

	const [photo_seal, setPhotoSeal] = useState<File | null>(null)

	//set nama kapal
	const [nama_kapals, setNamaKapal] = useState(``)

	const [photo_surat_jalan_pabrik, setPhotoSuratJalanPabrik] =
		useState<File | null>(null)

	const [photo_seal_pelabuhan, setPhotoSealPelabuhan] = useState<File | null>(
		null
	)
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
	//set komentar Kapal Sandar
	const [komentarKapalSandar, setKomentarKapalSandar] = useState(``)
	//set komentar terkirim
	const [komentarTerkirim, setKomentarTerkirim] = useState(``)

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

		const { data: data2 } = await supabase.storage
			.from(`workorder-bucket`)
			.upload(`workorder/${photo_seal.name}`, file2 as File)

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
			.getPublicUrl(`workorder/${photo_seal.name}`)
		if (urlData2) {
			console.log(urlData2)
			setUrl(urlData2.publicUrl)
		} else if (error) {
			console.log(error)
		}

		const datas = {
			id: parseInt(id as string),
			photo_container: urlData.publicUrl,
			photo_container_seal: urlData2.publicUrl,
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

		const { data: data2 } = await supabase.storage
			.from(`workorder-bucket`)
			.upload(`workorder/${photo_surat_jalan_pabrik.name}`, file2 as File)

		if (data) {
			console.log(data2)
		} else if (error) {
			console.log(error)
		}

		const { data: urlData2 } = await supabase.storage
			.from(`workorder-bucket`)
			.getPublicUrl(`workorder/${photo_surat_jalan_pabrik.name}`)
		if (urlData2) {
			console.log(urlData2)
			setUrl(urlData2.publicUrl)
		} else if (error) {
			console.log(error)
		}

		const datas = {
			id: parseInt(id as string),
			photo_surat_pengantar: urlData.publicUrl,
			photo_surat_jalan_pabrik: urlData2.publicUrl,
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

		const datas = {
			id: parseInt(id as string),
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

		const { data: data2 } = await supabase.storage
			.from(`workorder-bucket`)
			.upload(`workorder/${photo_seal_pelabuhan.name}`, file2 as File)

		if (data) {
			console.log(data2)
		} else if (error) {
			console.log(error)
		}

		const { data: urlData2 } = await supabase.storage
			.from(`workorder-bucket`)
			.getPublicUrl(`workorder/${photo_seal_pelabuhan.name}`)
		if (urlData2) {
			console.log(urlData2)
			setUrl(urlData2.publicUrl)
		} else if (error) {
			console.log(error)
		}
		const datas = {
			id: parseInt(id as string),
			photo_surat_jalan_stackful: urlData.publicUrl,
			photo_seal_pelabuhan: urlData2.publicUrl,
			komentar_tiba_pelabuhan: komentarTibaPelabuhan,
			tanggal_tiba_pelabuhan: moment().format(`YYYY-MM-DD HH:mm:ss`),
			status: `tiba_pelabuhan`
		}

		updateData(datas)

		message.success(`Upload berhasil`)
	}

	const handleUploadMuatan = async (e: ChangeEvent<HTMLInputElement>) => {
		setFile(setForm.getValues(`photo_muatan`))

		const datas = {
			id: parseInt(id as string),
			tanggal_muatan: moment().format(`YYYY-MM-DD HH:mm:ss`),
			nama_kapal: nama_kapals,
			komentar_muatan: komentarMuatan,
			status: `pindah_muatan`
		}

		updateData(datas)

		message.success(`Upload berhasil`)
	}

	const handleUploadDestinasi = async (e: ChangeEvent<HTMLInputElement>) => {
		setFile(setForm.getValues(`photo_destinasi`))

		const datas = {
			id: parseInt(id as string),
			komentar_destinasi: komentarDestinasi,
			//new date
			tanggal_destinasi: moment().format(`YYYY-MM-DD HH:mm:ss`),
			status: `destinasi`
		}

		updateData(datas)

		message.success(`Upload berhasil`)
	}

	const handleUploadKapalSandar = async (e: ChangeEvent<HTMLInputElement>) => {
		setFile(setForm.getValues(`photo_kapal_sandar`))

		const datas = {
			id: parseInt(id as string),
			komentar_kapal_sandar: komentarKapalSandar,
			//new date
			tanggal_kapal_sandar: moment().format(`YYYY-MM-DD HH:mm:ss`),
			status: `Kapal_Sandar`
		}

		updateData(datas)

		message.success(`Upload berhasil`)
	}

	const handleUploadBarangTerkirim = async (
		e: ChangeEvent<HTMLInputElement>
	) => {
		setFile(setForm.getValues(`photo_barang_terkirim`))

		const datas = {
			id: parseInt(id as string),
			komentar_barang_terkirim: komentarTerkirim,
			//new date
			tanggal_barang_terkirim: moment().format(`YYYY-MM-DD HH:mm:ss`),
			status: `barang_terkirim`
		}

		updateData(datas)

		message.success(`Upload berhasil`)
	}

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
	//visible kapal sandar
	const [visibleKapalSandar, setVisibleKapalSandar] = useState(false)
	//visible terkirim
	const [visibleTerkirim, setVisibleTerkirim] = useState(false)
	//visible message
	const [visibleMessage, setVisibleMessage] = useState(false)

	const handleOk = () => {
		setVisibleMessage(false)
	}
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
		setVisibleKapalSandar(false)
		setVisibleTerkirim(false)
		setVisibleMessage(false)
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

	const handleOkSandar = () => {
		//handle upload image
		let e
		handleUploadKapalSandar(e)
		setVisibleKapalSandar(false)
	}

	const handleOkTerkirim = () => {
		//handle upload image
		let e
		handleUploadBarangTerkirim(e)
		setVisibleTerkirim(false)
	}

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
						<p>Tidak Ada Photo Untuk Langkah Ini</p>
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

	const columnsMuatBarang = [
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
			dataIndex: [`photo`, `photo_surat_jalan_pabrik`],
			key: `photo`,
			//make photo from dataindex if dataindex is null then show text "Belum ada foto"
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
					{record.photo_surat_jalan_pabrik ? (
						<img
							src={record.photo_surat_jalan_pabrik}
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
	//make antd table for status, tanggal, photo and komentar
	const columnsContainer = [
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
			dataIndex: [`photo`, `photo_container_seal`],
			key: `photo`,
			//make photo from dataindex if dataindex is null then show text "Belum ada foto"
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
					{record.photo_container_seal ? (
						<img
							src={record.photo_container_seal}
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

	const columnsTibaPelabuhan = [
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
			dataIndex: [`photo`, `photo_seal_pelabuhan`],
			key: `photo`,
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
					{record.photo_seal_pelabuhan ? (
						<img
							src={record.photo_seal_pelabuhan}
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
	const dataContainer = dataSource?.map((item) => {
		return {
			key: item.id,
			status: `CONTAINER`,
			tanggal: item.tanggal_container,
			photo: item.photo_container,
			photo_container_seal: item.photo_container_seal,
			komentar: item.komentar_container
		}
	})

	//map data muat barang from data
	const dataMuatBarang = dataSource?.map((item) => {
		return {
			key: item.id,
			status: `MUAT BARANG`,
			tanggal: item.tanggal_muat_barang,
			photo: item.photo_surat_pengantar,
			photo_surat_jalan_pabrik: item.photo_surat_jalan_pabrik,
			komentar: item.komentar_muat_barang
		}
	})

	//map data menuju pelabuhan from data
	const dataMenujuPelabuhan = dataSource?.map((item) => {
		return {
			key: item.id,
			status: `MENUJU PELABUHAN`,
			tanggal: item.tanggal_menuju_pelabuhan,
			komentar: item.komentar_menuju_pelabuhan
		}
	})

	//map data tiba pelabuhan from data
	const dataTibaPelabuhan = dataSource?.map((item) => {
		return {
			key: item.id,
			status: `TIBA PELABUHAN`,
			photo: item.photo_surat_jalan_stackful,
			photo_seal_pelabuhan: item.photo_seal_pelabuhan,
			tanggal: item.tanggal_tiba_pelabuhan,
			komentar: item.komentar_tiba_pelabuhan
		}
	})

	//map data muatan from data
	const dataMuatan = dataSource?.map((item) => {
		return {
			key: item.id,
			status: `PINDAH MUATAN`,
			tanggal: item.tanggal_muatan,
			photo: item.photo_seal_muatan,
			komentar: item.komentar_muatan
		}
	})

	//map data destinasi from data
	const dataDestinasi = dataSource?.map((item) => {
		return {
			key: item.id,
			status: `MENUJU DESTINASI`,
			tanggal: item.tanggal_destinasi,
			photo: item.photo_seal_destinasi,
			komentar: item.komentar_destinasi
		}
	})

	//map data kapal sandar
	const dataKapalSandar = dataSource?.map((item) => {
		return {
			key: item.id,
			status: `KAPAL SANDAR`,
			tanggal: item.tanggal_kapal_sandar,
			komentar: item.komentar_kapal_sandar
		}
	})

	//map data barang terkirim
	const dataBarangTerkirim = dataSource?.map((item) => {
		return {
			key: item.id,
			status: `BARANG TERKIRIM`,
			tanggal: item.tanggal_barang_terkirim,
			komentar: item.komentar_barang_terkirim
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
										if (data?.daftar_workorder_by_id?.status === ``) {
											setVisibleContainer(true)
										} else if (
											data?.daftar_workorder_by_id?.status === `container`
										) {
											setVisibleMuatBarang(true)
										} else if (
											data?.daftar_workorder_by_id?.status === `muat_barang`
										) {
											setVisibleMenujuPelabuhan(true)
										} else if (
											data?.daftar_workorder_by_id?.status ===
											`menuju_pelabuhan`
										) {
											setVisibleTibaPelabuhan(true)
										} else if (
											data?.daftar_workorder_by_id?.status === `tiba_pelabuhan`
										) {
											setVisibleMuatan(true)
										} else if (
											data?.daftar_workorder_by_id?.status === `pindah_muatan`
										) {
											setVisibleDestinasi(true)
										} else if (
											data?.daftar_workorder_by_id?.status === `destinasi`
										) {
											setVisibleKapalSandar(true)
										} else if (
											data?.daftar_workorder_by_id?.status === `Kapal_Sandar`
										) {
											setVisibleTerkirim(true)
										} else {
											setVisibleMessage(true)
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
									{moment(data?.daftar_workorder_by_id?.tanggal_wo).format(
										`DD/MM/YYYY`
									)}
								</p>
							</p>
						</p>
						<p>
							<p style={{ display: `inline-block` }}>
								Kota Tujuan :{` `}
								<p style={{ fontWeight: `bold`, display: `inline-block` }}>
									{data?.daftar_workorder_by_id?.kota_tujuan}
								</p>
							</p>
						</p>
						<p>
							<p style={{ display: `inline-block` }}>
								No. Container :{` `}
								<p style={{ fontWeight: `bold`, display: `inline-block` }}>
									{data?.daftar_workorder_by_id?.nomor_container}
								</p>
							</p>
						</p>
						<p>
							<p style={{ display: `inline-block` }}>
								No. Seal :{` `}
								<p style={{ fontWeight: `bold`, display: `inline-block` }}>
									{data?.daftar_workorder_by_id?.nomor_seal}
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
									{data?.daftar_workorder_by_id?.nomor_kendaraan}
								</p>
							</p>
						</p>
						<p>
							<p style={{ display: `inline-block` }}>
								Tipe Kendaraan :{` `}
								<p style={{ fontWeight: `bold`, display: `inline-block` }}>
									{data?.daftar_workorder_by_id?.kendaraan}
								</p>
							</p>
						</p>
						<p>
							<p style={{ display: `inline-block` }}>
								Supir :{` `}
								<p style={{ fontWeight: `bold`, display: `inline-block` }}>
									{data?.daftar_workorder_by_id?.nama_supir} /{` `}
									{data?.daftar_workorder_by_id?.wa_supir}
								</p>
							</p>
						</p>
						<p>
							<p style={{ display: `inline-block` }}>
								Kenek :{` `}
								<p style={{ fontWeight: `bold`, display: `inline-block` }}>
									{data?.daftar_workorder_by_id?.nama_kenek} / {` `}
									{data?.daftar_workorder_by_id?.wa_kenek}
								</p>
							</p>
						</p>
					</div>
					<Table
						style={{ marginTop: `5%` }}
						rowKey={(record) => record.id}
						columns={columnsContainer}
						dataSource={dataContainer}
						pagination={false}
					/>
					<Table
						rowKey={(record) => record.id}
						showHeader={false}
						columns={columnsMuatBarang}
						dataSource={dataMuatBarang}
						pagination={false}
					/>
					<Table
						rowKey={(record) => record.id}
						showHeader={false}
						columns={columns}
						dataSource={dataMenujuPelabuhan}
						pagination={false}
					/>
					<Table
						rowKey={(record) => record.id}
						showHeader={false}
						columns={columnsTibaPelabuhan}
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
					<Table
						rowKey={(record) => record.id}
						showHeader={false}
						columns={columns}
						dataSource={dataKapalSandar}
						pagination={false}
					/>
					<Table
						rowKey={(record) => record.id}
						showHeader={false}
						columns={columns}
						dataSource={dataBarangTerkirim}
						pagination={false}
					/>
					<form id="formWorkorder">
						<Modal
							title="Upload Photo Container"
							visible={visibleContainer}
							onOk={handleOkContainer}
							onCancel={handleCancel}
						>
							<div>
								<p
									style={{
										marginTop: `3px`,
										fontWeight: `bold`,
										marginBottom: `-2px`
									}}
								>
									Photo Container
								</p>
							</div>
							<input
								type="file"
								name="photo_container"
								onChange={(e) => {
									setFile(e.target.files[0])
								}}
							/>
							<div>
								<p
									style={{
										marginTop: `3px`,
										fontWeight: `bold`,
										marginBottom: `-2px`
									}}
								>
									Photo Seal
								</p>
							</div>
							<input
								type="file"
								name="photo_container_seal"
								onChange={(e) => {
									setPhotoSeal(e.target.files[0])
								}}
							/>
							<div>
								<p
									style={{
										marginTop: `3px`,
										fontWeight: `bold`,
										marginBottom: `-2px`
									}}
								>
									Keterangan
								</p>
							</div>
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
							<div>
								<p
									style={{
										marginTop: `3px`,
										fontWeight: `bold`,
										marginBottom: `-2px`
									}}
								>
									Photo Surat Pengantar
								</p>
							</div>
							<input
								type="file"
								name="photo_surat_pengantar"
								onChange={(e) => {
									setFile(e.target.files[0])
								}}
							/>
							<div>
								<p
									style={{
										marginTop: `3px`,
										fontWeight: `bold`,
										marginBottom: `-2px`
									}}
								>
									Photo Surat Jalan Pabrik
								</p>
							</div>
							<input
								type="file"
								name="photo_surat_jalan_pabrik"
								onChange={(e) => {
									setPhotoSuratJalanPabrik(e.target.files[0])
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
							<div>
								<p
									style={{
										marginTop: `3px`,
										fontWeight: `bold`,
										marginBottom: `-2px`
									}}
								>
									Photo Surat Jalan Stackful
								</p>
							</div>
							<input
								type="file"
								name="photo_surat_jalan_stackful"
								onChange={(e) => {
									setFile(e.target.files[0])
								}}
							/>
							<div>
								<p
									style={{
										marginTop: `3px`,
										fontWeight: `bold`,
										marginBottom: `-2px`
									}}
								>
									Photo Seal Pelabuhan
								</p>
							</div>
							<input
								type="file"
								name="photo_seal_pelabuhan"
								onChange={(e) => {
									setPhotoSealPelabuhan(e.target.files[0])
								}}
							/>
							<div>
								<p
									style={{
										marginTop: `3px`,
										fontWeight: `bold`,
										marginBottom: `-2px`
									}}
								>
									Keterangan
								</p>
							</div>
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
							<div>
								<p
									style={{
										marginTop: `3px`,
										fontWeight: `bold`,
										marginBottom: `-2px`
									}}
								>
									Nama Kapal
								</p>
							</div>
							<input
								type="text"
								name="nama_kapal"
								placeholder="Nama Kapal"
								style={{ marginTop: `10px`, width: `100%` }}
								{...register(`nama_kapal`)}
								onChange={(e) => {
									setNamaKapal(e.target.value)
								}}
							/>
							<p
								style={{
									marginTop: `3px`,
									fontWeight: `bold`,
									marginBottom: `-2px`
								}}
							>
								Keterangan
							</p>
							<TextArea
								name="photo_seal_muatan"
								placeholder="Komentar"
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
							<div>
								<p
									style={{
										marginTop: `3px`,
										fontWeight: `bold`,
										marginBottom: `-2px`
									}}
								>
									Keterangan
								</p>
							</div>
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
						<Modal
							title="Upload Photo"
							visible={visibleKapalSandar}
							onOk={handleOkSandar}
							onCancel={handleCancel}
						>
							<div>
								<p
									style={{
										marginTop: `3px`,
										fontWeight: `bold`,
										marginBottom: `-2px`
									}}
								>
									Keterangan
								</p>
							</div>
							<TextArea
								name="photo_kapal_sandar"
								placeholder=""
								style={{ marginTop: `10px` }}
								{...register(`photo_kapal_sandar`)}
								onChange={(e) => {
									setKomentarKapalSandar(e.target.value)
								}}
							/>
						</Modal>
						<Modal
							title="Upload Photo"
							visible={visibleTerkirim}
							onOk={handleOkTerkirim}
							onCancel={handleCancel}
						>
							<div>
								<p
									style={{
										marginTop: `3px`,
										fontWeight: `bold`,
										marginBottom: `-2px`
									}}
								>
									Keterangan
								</p>
							</div>
							<TextArea
								name="photo_barang_terkirim"
								placeholder=""
								style={{ marginTop: `10px` }}
								{...register(`photo_barang_terkirim`)}
								onChange={(e) => {
									setKomentarTerkirim(e.target.value)
								}}
							/>
						</Modal>
						<Modal
							visible={visibleMessage}
							title="Work Order Telah Selesai"
							onOk={handleOk}
							onCancel={handleCancel}
							style={{
								textAlign: `center`,
								fontWeight: `bold`,
								//make center off screen
								top: `30%`
							}}
						>
							<div>
								<p>Work Order Telah Selesai, Silahkan Akses Menu Lain</p>
							</div>
						</Modal>
					</form>
				</div>
			</section>
		</AdminPage>
	)
}
Home.getLayout = function getLayout(page) {
	return <Dashboard>{page}</Dashboard>
}
