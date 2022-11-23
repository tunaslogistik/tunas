/* eslint-disable no-mixed-spaces-and-tabs */
import { gql, useMutation, useQuery } from "@apollo/client"
import AdminPage from "@components/admin/AdminPage.component"
import Dashboard from "@components/dashboard/Dashboard.component"
import useLoading from "@hooks/useLoading.hook"
import { Button, DatePicker, message } from "antd"
import { GET_DAFTAR_TUJUAN } from "graphql/daftar_tujuan/queries"
import { CREATE_DAFTAR_WORKORDER } from "graphql/daftar_workorder/mutations"
import { GET_DAFTAR_WORKORDER } from "graphql/daftar_workorder/queries"
import { GET_VECHNICLE } from "graphql/mobil/queries"
import moment from "moment"
import Link from "next/link"
import { useRouter } from "next/router"
import { Controller, useForm } from "react-hook-form"
//get data

const GET_DATA = gql`
	query daftar_sales_order {
		daftar_sales_order {
			id
			nomor_ttb
			nomor_sales_order
			total_volume
			harga
			total_tagihan
			rekening
			kota_tujuan
			tanggal_sales_order
			term_payment
		}
	}
`

export default function Home() {
	const { setLoading } = useLoading()
	const { data } = useQuery(GET_DATA)

	//GET DAFTAR TUJUAN
	const { data: dataTujuan } = useQuery(GET_DAFTAR_TUJUAN)
	//GET MOBIL
	const { data: dataMobil } = useQuery(GET_VECHNICLE)
	//GET DAFTAR WORKORDER
	const { data: dataWorkorder } = useQuery(GET_DAFTAR_WORKORDER)

	const router = useRouter()
	const setForm = useForm()
	const { control, register, handleSubmit, setValue } = setForm

	const [createDaftar_workorder] = useMutation(CREATE_DAFTAR_WORKORDER, {
		refetchQueries: [{ query: GET_DATA }]
	})

	//create mutation function
	const createData = (data) => {
		createDaftar_workorder({ variables: { input: data } })
	}

	//make function set value tipe kendaraan by nomor kendaraan
	const setTipeKendaraan = (nomor_kendaraan) => {
		const tipe_kendaraan = dataMobil?.vechnicle.find(
			(item) => item.nomor_kendaraan === nomor_kendaraan
		).tipe_kendaraan
		setValue(`tipe_kendaraan`, tipe_kendaraan)
	}

	//IF WORKORDER LENGTH IS 0 THEN MAKE NOMOR WORKORDER 1 ELSE MAKE WORKORDER LENGTH
	const nomor_workorder =
		dataWorkorder?.daftar_workorder.length === 0
			? 1
			: dataWorkorder?.daftar_workorder.length

	function addLeadingZeros(num, totalLength) {
		return String(num).padStart(totalLength, `0`)
	}
	async function onSubmit(formData) {
		setLoading(true)
		try {
			console.log(`form data`, formData)
			const objArray = Object.keys(formData).map((i) => formData[i])

			//get kode kota tujuan from daftar tujuan where nama tujuan = from data nama tujuan
			const kode_kota_tujuan = dataTujuan?.daftar_tujuan.find(
				(item) => item.nama_tujuan === formData.kota_tujuan
			)?.kode_tujuan

			const myChildrenArray = objArray.map((item) => {
				return {
					//nomor wo = WO/kode_kota_tujuan/tanggal wo(YY/MM)/add leading zeros
					nomor_workorder: `WO/${kode_kota_tujuan}/${moment(
						formData.tanggal
					).format(`YY-MM`)}/${addLeadingZeros(parseInt(nomor_workorder), 4)}`,
					kendaraan: formData.tipe_kendaraan,
					nomor_container: formData.nomor_container,
					nomor_seal: formData.nomor_seal,
					kota_tujuan: formData.kota_tujuan,
					komentar_container: ``,
					komentar_muat_barang: ``,
					komentar_menuju_pelabuhan: ``,
					komentar_tiba_pelabuhan: ``,
					komentar_muatan: ``,
					komentar_destinasi: ``,
					tanggal_wo: moment(formData.tanggal).format(`YYYY-MM-DD`),
					tanggal_container: ``,
					tanggal_muat_barang: ``,
					tanggal_menuju_pelabuhan: ``,
					tanggal_tiba_pelabuhan: ``,
					tanggal_muatan: ``,
					tanggal_destinasi: ``,
					nomor_kendaraan: formData.nomor_kendaraan,
					nama_supir: formData.nama_supir,
					nama_kenek: formData.nama_kenek,
					wa_supir: formData.nomor_supir,
					wa_kenek: formData.nomor_kenek,
					photo_container: ``,
					photo_seal_pelabuhan: ``,
					photo_surat_jalan: ``,
					photo_muat_barang: ``,
					photo_seal_muatan: ``,
					photo_seal_destinasi: ``,
					status: ``
				}
			})
			console.log(`myChildrenArray`, myChildrenArray)

			//merge duplicate
			const merged = myChildrenArray.reduce((acc, current) => {
				const x = acc.find(
					(item) => item.nomor_workorder === current.nomor_workorder
				)
				if (!x) {
					return acc.concat([current])
				} else {
					return acc
				}
			}, [])

			//for each data in myChildrenArray create workorder
			for (let i = 0; i < merged.length; i++) {
				createData(merged[i])
			}
			// router.push(`/daftar_workorder`)
			message.success(`Data Berhasil Disimpan`)
		} catch (error) {
			console.log(error)
		}
		setLoading(false)
	}

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
		>
			<section className="section">
				<div className="container">
					<form className="form" onSubmit={handleSubmit(onSubmit)}>
						<div
							className="field"
							style={{
								display: `inline-block`,
								width: `calc(50% - 8px)`,
								marginTop: `2%`
							}}
						>
							<label style={{ fontWeight: `bolder` }} className="label">
								Tanggal
							</label>
							<div className="control">
								<Controller
									control={control}
									name="tanggal"
									rules={{ required: true }}
									render={({ field }) => (
										<DatePicker
											{...field}
											style={{
												width: `100%`,
												height: `38px`
											}}
											format={`DD/MM/YYYY`}
											placeholder="Tanggal Work Order"
											onChange={(date) => field.onChange(date)}
											className="form-control"
										/>
									)}
								/>
							</div>
						</div>
						<div
							className="field"
							style={{
								display: `inline-block`,
								width: `calc(50% - 8px)`,
								marginTop: `1%`,
								marginLeft: `1%`
							}}
						>
							<label style={{ fontWeight: `bolder` }} className="label">
								Kota Tujuan
							</label>
							<div className="control">
								<select
									{...register(`kota_tujuan`, { required: true })}
									style={{ width: `100%` }}
									required
								>
									<option value="">Pilih Kota Tujuan</option>
									{dataTujuan?.daftar_tujuan.map((item) => (
										<option key={item.nama_tujuan} value={item.nama_tujuan}>
											{item.nama_tujuan}
										</option>
									))}
								</select>
							</div>
						</div>
						<div
							className="field"
							style={{
								display: `inline-block`,
								width: `calc(50% - 8px)`,
								marginTop: `2%`
							}}
						>
							<label style={{ fontWeight: `bolder` }} className="label">
								Nomor Container
							</label>
							<div className="control">
								<input
									style={{ width: `100%` }}
									className="input"
									type="text"
									placeholder="Nomor Container"
									{...register(`nomor_container`)}
								/>
							</div>
						</div>
						<div
							className="field"
							style={{
								display: `inline-block`,
								width: `calc(50% - 8px)`,
								marginTop: `1%`,
								marginLeft: `1%`
							}}
						>
							<label style={{ fontWeight: `bolder` }} className="label">
								Nomor Seal
							</label>
							<div className="control">
								<input
									style={{ width: `100%` }}
									className="input"
									type="text"
									placeholder="Nomor Seal"
									{...register(`nomor_seal`)}
								/>
							</div>
						</div>
						<div
							className="field"
							style={{
								display: `inline-block`,
								width: `calc(50% - 8px)`,
								marginTop: `2%`
							}}
						>
							<label style={{ fontWeight: `bolder` }} className="label">
								Nomor Kendaraan
							</label>
							<select
								{...register(`nomor_kendaraan`, { required: true })}
								style={{ width: `100%` }}
								onChange={(e) => {
									setTipeKendaraan(e.target.value)
								}}
								required
							>
								<option value="">Pilih Nomor Kendaraan</option>
								{dataMobil?.vechnicle.map((item) => (
									<option
										key={item.nomor_kendaraan}
										value={item.nomor_kendaraan}
									>
										{item.nomor_kendaraan}
									</option>
								))}
							</select>
						</div>
						<div
							className="field"
							style={{
								display: `inline-block`,
								width: `calc(50% - 8px)`,
								marginTop: `1%`,
								marginLeft: `1%`
							}}
						>
							<label style={{ fontWeight: `bolder` }} className="label">
								Tipe Kendaraan
							</label>
							<div className="control">
								<input
									style={{ width: `100%` }}
									className="input"
									type="text"
									placeholder="Tipe Kendaraan"
									{...register(`tipe_kendaraan`)}
									readOnly
								/>
							</div>
						</div>
						<div
							className="field"
							style={{
								display: `inline-block`,
								width: `calc(50% - 8px)`,
								marginTop: `2%`
							}}
						>
							<label style={{ fontWeight: `bolder` }} className="label">
								Nama Supir
							</label>
							<div className="control">
								<select
									{...register(`nama_supir`, { required: true })}
									style={{ width: `100%` }}
									required
								>
									<option value="">Pilih Nama Supir</option>
									{dataMobil?.vechnicle.map((item) => (
										<option key={item.nama_supir} value={item.nama_supir}>
											{item.nama_supir}
										</option>
									))}
								</select>
							</div>
						</div>
						<div
							className="field"
							style={{
								display: `inline-block`,
								width: `calc(50% - 8px)`,
								marginTop: `1%`,
								marginLeft: `1%`
							}}
						>
							<label style={{ fontWeight: `bolder` }} className="label">
								Nama Kenek
							</label>
							<div className="control">
								<select
									{...register(`nama_kenek`, { required: true })}
									style={{ width: `100%` }}
									required
								>
									<option value="">Pilih Nama Kenek</option>
									{dataMobil?.vechnicle.map((item) => (
										<option key={item.nama_kenek} value={item.nama_kenek}>
											{item.nama_kenek}
										</option>
									))}
								</select>
							</div>
						</div>
						<div
							className="field"
							style={{
								display: `inline-block`,
								width: `calc(50% - 8px)`,
								marginTop: `2%`
							}}
						>
							<label style={{ fontWeight: `bolder` }} className="label">
								Nomor HP/WA Supir
							</label>
							<div className="control">
								<input
									style={{ width: `100%` }}
									className="input"
									type="text"
									placeholder="Nomor HP/WA Supir"
									{...register(`nomor_supir`)}
								/>
							</div>
						</div>
						<div
							className="field"
							style={{
								display: `inline-block`,
								width: `calc(50% - 8px)`,
								marginTop: `1%`,
								marginLeft: `1%`
							}}
						>
							<label style={{ fontWeight: `bolder` }} className="label">
								Nomor HP/WA Kenek
							</label>
							<div className="control">
								<input
									style={{ width: `100%` }}
									className="input"
									type="text"
									placeholder="Nomor HP/WA Kenek"
									{...register(`nomor_kenek`)}
								/>
							</div>
						</div>
						<div className="form-group">
							<Button
								key="submit"
								htmlType="submit"
								className="submit"
								style={{
									marginTop: `3%`,
									marginLeft: `91%`,
									marginBottom: `30px`,
									backgroundColor: `black`,
									borderColor: `black`
								}}
								type="primary"
							>
								Simpan
							</Button>
						</div>
					</form>
				</div>
			</section>
		</AdminPage>
	)
}
Home.getLayout = function getLayout(page) {
	return <Dashboard>{page}</Dashboard>
}
