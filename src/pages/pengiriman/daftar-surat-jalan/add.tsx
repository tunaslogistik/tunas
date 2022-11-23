/* eslint-disable no-mixed-spaces-and-tabs */
/* eslint-disable array-callback-return */
import { gql, useMutation, useQuery } from "@apollo/client"
import IconPlus from "@assets/icons/icon-plus-fill.svg"
import IconTrash from "@assets/icons/icon-trash.svg"
import AdminPage from "@components/admin/AdminPage.component"
import Dashboard from "@components/dashboard/Dashboard.component"
import useLoading from "@hooks/useLoading.hook"
import { Button, DatePicker, notification } from "antd"

import { GET_DAFTAR_MUAT_BARANG } from "graphql/daftar_muat_barang/queries"
import { GET_DAFTAR_TTB } from "graphql/daftar_ttb/queries"
import moment from "moment"
import Link from "next/link"
import router from "next/router"
import { useEffect, useRef, useState } from "react"
import { Controller, useFieldArray, useForm } from "react-hook-form"
import { CREATE_DAFTAR_SURAT_JALAN } from "../../../../graphql/daftar_surat_jalan/mutations"

//get data

const GET_DATA = gql`
	query daftar_surat_jalan {
		daftar_surat_jalan {
			id
			nomor_surat_jalan
			nomor_ttb
			vendor_pelayanan
			tanggal_surat_jalan
			tanggal_keberangkatan
			nomor_container
			nomor_seal
			keterangan
		}
	}
`

export default function Home() {
	const formRef = useRef(null)
	const { setLoading } = useLoading()
	const { data } = useQuery(GET_DATA)
	//GET DAFTAR TTB
	const { data: dataDaftarTTB } = useQuery(GET_DAFTAR_TTB)
	//GET DATA DAFTAR MUAT BARANG
	const { data: dataDaftarMuatBarang } = useQuery(GET_DAFTAR_MUAT_BARANG)
	const setForm = useForm()
	const { control, register, watch, handleSubmit, setValue } = setForm

	useEffect(() => {
		formRef.current?.setFieldsValue({
			nomor_ttb: data?.nomor_ttb
		})
	}, [data])

	const [selectednoTTBatas, setSelectednoTTBatas] = useState()
	const [selectednoTTBA] = useState([])

	const [createDaftar_sales_jalan] = useMutation(CREATE_DAFTAR_SURAT_JALAN, {
		refetchQueries: [{ query: GET_DATA }]
	})

	//create mutation function
	const createData = (data) => {
		createDaftar_sales_jalan({ variables: { input: data } })
	}

	const { fields, append, remove } = useFieldArray({
		control,
		name: `test`
	})
	function addLeadingZeros(num, totalLength) {
		return String(num).padStart(totalLength, `0`)
	}
	const panjangSalesOrder = data?.daftar_surat_jalan.length + 1

	const selectedTTB = dataDaftarTTB?.daftar_ttb.find(
		(item) => item.ttb_number === selectednoTTBatas
	)
	const isFullContainer = selectedTTB?.full_container

	console.log(`isFullContainer`, isFullContainer)
	async function onSubmit(formData) {
		setLoading(true)
		try {
			const objArray = Object.keys(formData).map((i) => formData[i])
			const myChildrenArray = objArray.map((item) => {
				return {
					nomor_ttb: formData.nomor_ttb,
					koli: String(formData.koli),
					volume: String(formData.total_volume_ttb),
					nomor_surat_jalan:
						isFullContainer === `Full Container`
							? `SJ/` +
							  `FL` +
							  `/` +
							  formData.kota_tujuan +
							  `/` +
							  String(
									moment
										.unix(formData.tanggal_surat_jalan / 1000)
										.format(`YY-MM`)
							  ) +
							  `/` +
							  addLeadingZeros(panjangSalesOrder, 4)
							: `SJ/` +
							  formData.kota_tujuan +
							  `/` +
							  String(
									moment
										.unix(formData.tanggal_surat_jalan / 1000)
										.format(`YY-MM`)
							  ) +
							  `/` +
							  addLeadingZeros(panjangSalesOrder, 4),
					vendor_pelayanan: formData.vendor_pelayaran,
					tanggal_surat_jalan: formData.tanggal_surat_jalan,
					nomor_container: formData.nomor_container,
					nama_kapal: formData.nama_kapal,
					nomor_seal: formData.nomor_seal,
					tanggal_keberangkatan: formData.tanggal_keberangkatan,
					keterangan: formData.keterangan
				}
			})

			//merge duplicate
			const myChildrenArrayMerge = myChildrenArray.reduce((acc, cur) => {
				const x = acc.find(
					(item) => item.nomor_surat_jalan === cur.nomor_surat_jalan
				)
				if (!x) {
					return acc.concat([cur])
				} else {
					return acc
				}
			}, [])

			const temp2 = []
			if (formData.nomor_ttbA !== undefined) {
				for (let i = 0; i < formData.nomor_ttbA.length; i++) {
					if (formData.nomor_ttbA[i] !== `Pilih Nomor TTB`) {
						temp2.push({
							nomor_ttb: formData.nomor_ttbA[i],
							koli: String(
								dataDaftarTTB?.daftar_ttb.find(
									(item) => item.ttb_number === formData.nomor_ttbA[i]
								).koli
							),
							volume: String(
								dataDaftarTTB?.daftar_ttb.find(
									(item) => item.ttb_number === formData.nomor_ttbA[i]
								).total_volume
							),
							nomor_surat_jalan:
								`SJ/` +
								formData.kota_tujuan +
								`/` +
								String(
									moment
										.unix(formData.tanggal_surat_jalan / 1000)
										.format(`YY-MM`)
								) +
								`/` +
								addLeadingZeros(panjangSalesOrder, 4),
							vendor_pelayanan: formData.vendor_pelayaran,
							tanggal_surat_jalan: formData.tanggal_surat_jalan,
							nomor_container: formData.nomor_container,
							nomor_seal: formData.nomor_seal,
							nama_kapal: formData.nama_kapal,
							tanggal_keberangkatan: formData.tanggal_keberangkatan,
							keterangan: formData.keterangan
						})
					}
				}
			}

			const myChildrenArrayMerge2 = myChildrenArrayMerge.concat(temp2)

			console.log(`myChildrenArray`, temp2)

			//find mychildrenarraymerge2 koli and volume in ttb where

			//sum koli
			const sumKoli = myChildrenArrayMerge2.reduce((acc, cur) => {
				return acc + cur.koli
			}, 0)

			//sum volume
			const sumVolume = myChildrenArrayMerge2.reduce((acc, cur) => {
				return parseInt(acc) + parseInt(cur.volume)
			}, 0)

			myChildrenArrayMerge2.map((item) => {
				item.total_koli = String(sumKoli)
				item.total_volume = String(sumVolume)
			})
			console.log(`myChildrenArrayMerge2`, myChildrenArrayMerge2)
			//create new data
			for (let i = 0; i < myChildrenArrayMerge2.length; i++) {
				const check = data?.daftar_surat_jalan.find(
					(item) => item.nomor_ttb === myChildrenArrayMerge2[i].nomor_ttb
				)
				if (check !== undefined) {
					notification.error({
						message: `Nomor Surat Jalan sudah ada`
					})
				}
				if (check === undefined) {
					createData(myChildrenArrayMerge2[i])
				}
			}

			const check = data?.daftar_surat_jalan.find(
				(item) => item.nomor_ttb === formData.nomor_ttb
			)
			if (check === undefined) {
				notification.success({
					message: `Data berhasil dibuat`
				})
			}
			router.push(`/pengiriman/daftar-surat-jalan`)
		} catch (error) {
			console.log(error)
		}
		setLoading(false)
	}

	//MAP DATA DAFTAR TTB
	const mapDaftarTTB = dataDaftarTTB?.daftar_ttb?.map((ttb) => {
		return {
			nomor_ttb: ttb.ttb_number,
			nama_penerima: ttb.nama_penerima,
			pengirim: ttb.pengirim,
			kota_tujuan: ttb.kota_tujuan,
			total_volume: ttb.total_volume,
			koli: ttb.koli
		}
	})
	//make a loop to merge duplicate ttb number
	const mergeTTB = mapDaftarTTB?.reduce((acc, curr) => {
		if (!acc.some((item) => item.nomor_ttb === curr.nomor_ttb)) {
			acc.push(curr)
		}
		return acc
	}, [])

	const ttb_number = selectednoTTBatas

	console.log(`allNumber`, selectednoTTBA)

	//get all ttb number in surat jalan
	const getAllTTBNumber = data?.daftar_surat_jalan?.map((suratJalan) => {
		return suratJalan.nomor_ttb
	})

	//filter ttb where ttb number in daftar muat_barang and not in surat jalan
	const filterTTB = mergeTTB?.filter((ttb) => {
		return dataDaftarMuatBarang?.daftar_muat_barang.some(
			(item) =>
				item.nomor_ttb === ttb.nomor_ttb &&
				!String(ttb_number)?.includes(ttb.nomor_ttb) &&
				item.nomor_ttb &&
				!getAllTTBNumber?.includes(ttb.nomor_ttb) &&
				!selectednoTTBA.includes(ttb.nomor_ttb)
		)
	})

	const handleChangeTTB = (value) => {
		const data = mergeTTB?.find((item) => item.nomor_ttb === value)
		setSelectednoTTBatas(value)
		setValue(`nomor_ttbatas`, selectednoTTBatas)
		setValue(`pengirim`, data.pengirim)
		setValue(`penerima`, data.nama_penerima)
		setValue(`kota_tujuan`, data.kota_tujuan)
		setValue(`total_volume_ttb`, data.total_volume)
		setValue(`koli`, data.koli)
	}

	const handleChangeTTBA = (value, index) => {
		const data = mergeTTB?.find((item) => item.nomor_ttb === value)
		selectednoTTBA[index] = data?.nomor_ttb
		setValue(`pengirimA[${index}]`, data.pengirim)
		setValue(`penerimaA[${index}]`, data.nama_penerima)
		setValue(`kota_tujuanA[${index}]`, data.kota_tujuan)
		setValue(`total_volume_ttbA[${index}]`, data.total_volume)
		setValue(`koliA[${index}]`, data.koli)
	}

	useEffect(() => {
		// setValue(`total_tagihan`, total)
		console.log(`watch`, watch(`harga`))
	}, [watch])

	const filterDaftarMuatBarang =
		dataDaftarMuatBarang?.daftar_muat_barang.filter((item) => {
			return item.nomor_ttb === watch(`nomor_ttb`)
		})

	setValue(`nomor_container`, filterDaftarMuatBarang?.[0]?.nomor_container)
	setValue(`nomor_seal`, filterDaftarMuatBarang?.[0]?.nomor_seal)
	setValue(`vendor_pelayaran`, filterDaftarMuatBarang?.[0]?.vendor_pelayanan)

	return (
		<AdminPage
			parent={
				<Link href="/pengiriman/daftar-surat-jalan">
					<a>Daftar Surat Jalan</a>
				</Link>
			}
			authId=""
			title="Tambah Surat Jalan"
			legend=""
			setForm={setForm}
		>
			<section className="section">
				<div className="container">
					<form className="form" onSubmit={handleSubmit(onSubmit)}>
						<br></br>
						<label style={{ fontSize: `20px`, fontWeight: `bolder` }}>
							Daftar TTB
						</label>
						<div style={{ width: `100%` }}>
							<div
								style={{ display: `inline-block`, width: `20%` }}
								className="col"
							>
								<label style={{ fontSize: `10px`, fontWeight: `bolder` }}>
									Nomor TTB
								</label>
								<select
									{...register(`nomor_ttb`)}
									onChange={(e) => handleChangeTTB(e.target.value)}
									style={{ width: `100%` }}
									required
								>
									<option>
										{selectednoTTBatas === undefined
											? `Pilih Nomor TTB`
											: selectednoTTBatas}
									</option>
									{filterTTB
										?.map((ttb) => {
											return (
												<option key={ttb.nomor_ttb} value={ttb.nomor_ttb}>
													{ttb.nomor_ttb}
												</option>
											)
										})
										?.reverse()}
								</select>
							</div>
							<div
								style={{
									display: `inline-block`,
									width: `20%`,
									marginLeft: `1%`
								}}
								className="col"
							>
								<label style={{ fontSize: `10px`, fontWeight: `bolder` }}>
									Pengirim
								</label>
								<input
									style={{ width: `100%` }}
									className="input"
									type="text"
									placeholder="Pengirim"
									{...register(`pengirim`)}
									readOnly
								/>
							</div>
							<div
								style={{
									display: `inline-block`,
									width: `16%`,
									marginLeft: `1%`
								}}
								className="col"
							>
								<label style={{ fontSize: `10px`, fontWeight: `bolder` }}>
									Penerima
								</label>
								<input
									style={{ width: `100%` }}
									className="input"
									type="text"
									placeholder="Penerima"
									{...register(`penerima`)}
									readOnly
								/>
							</div>
							<div
								style={{
									display: `inline-block`,
									marginLeft: `1%`,
									width: `14%`
								}}
								className="field"
							>
								<label style={{ fontSize: `10px`, fontWeight: `bolder` }}>
									Kota Tujuan
								</label>
								<div className="control">
									<input
										style={{ width: `100%` }}
										className="input"
										type="text"
										placeholder="Kota Tujuan"
										{...register(`kota_tujuan`)}
										readOnly
									/>
								</div>
							</div>
							<div
								style={{
									display: `inline-block`,
									marginLeft: `1%`,
									width: `10%`
								}}
								className="field"
							>
								<label style={{ fontSize: `10px`, fontWeight: `bolder` }}>
									Total Volume
								</label>
								<div className="control">
									<input
										style={{ width: `100%` }}
										className="input"
										type="text"
										placeholder="Total Volume"
										{...register(`total_volume_ttb`)}
										readOnly
									/>
								</div>
							</div>
							<div
								style={{
									display: `inline-block`,
									marginLeft: `1%`,
									width: `10%`
								}}
								className="field"
							>
								<label style={{ fontSize: `10px`, fontWeight: `bolder` }}>
									Koli
								</label>
								<div className="control">
									<input
										style={{ width: `100%` }}
										className="input"
										type="text"
										placeholder="Koli"
										{...register(`koli`)}
										readOnly
									/>
								</div>
							</div>
							<div
								className="col"
								style={{
									display: `inline-block`,
									paddingLeft: `1%`
								}}
							>
								<i
									onClick={(e) => {
										e.preventDefault()
										append({})
									}}
									className="icon"
									role="img"
								>
									<IconPlus className="svg" />
								</i>
							</div>
						</div>
						{fields.map((item, index) => {
							return (
								<div
									className="row"
									key={item.id}
									style={{ display: `flex`, paddingTop: `1%`, width: `100%` }}
								>
									<div>
										<div
											style={{ display: `inline-block`, width: `20%` }}
											className="col"
										>
											<label style={{ fontSize: `10px`, fontWeight: `bolder` }}>
												Nomor TTB
											</label>
											<select
												{...register(`nomor_ttbA.${index}`)}
												onChange={(e) => {
													handleChangeTTBA(e.target.value, index)
													selectednoTTBA[index] = e.target.value
												}}
												style={{ width: `100%` }}
												required
											>
												<option value={selectednoTTBA[index]}>
													{selectednoTTBA[index] === undefined
														? `Pilih Nomor TTB`
														: selectednoTTBA[index]}
												</option>
												{filterTTB
													?.map((ttb) => {
														return (
															<option key={ttb.nomor_ttb} value={ttb.nomor_ttb}>
																{ttb.nomor_ttb}
															</option>
														)
													})
													?.reverse()}
											</select>
										</div>
										<div
											style={{
												display: `inline-block`,
												width: `21%`,
												marginLeft: `1%`
											}}
											className="col"
										>
											<label style={{ fontSize: `10px`, fontWeight: `bolder` }}>
												Pengirim
											</label>
											<input
												style={{ width: `100%` }}
												className="input"
												type="text"
												placeholder="Pengirim"
												{...register(`pengirimA.${index}`)}
												readOnly
											/>
										</div>
										<div
											style={{
												display: `inline-block`,
												width: `17%`,
												marginLeft: `1%`
											}}
											className="col"
										>
											<label style={{ fontSize: `10px`, fontWeight: `bolder` }}>
												Penerima
											</label>
											<input
												style={{ width: `100%` }}
												className="input"
												type="text"
												placeholder="Penerima"
												{...register(`penerimaA.${index}`)}
												readOnly
											/>
										</div>
										<div
											style={{
												display: `inline-block`,
												marginLeft: `1%`,
												width: `15%`
											}}
											className="field"
										>
											<label style={{ fontSize: `10px`, fontWeight: `bolder` }}>
												Kota Tujuan
											</label>
											<div className="control">
												<input
													style={{ width: `100%` }}
													className="input"
													type="text"
													placeholder="Kota Tujuan"
													{...register(`kota_tujuanA.${index}`)}
													readOnly
												/>
											</div>
										</div>
										<div
											style={{
												display: `inline-block`,
												marginLeft: `1%`,
												width: `10%`
											}}
											className="field"
										>
											<label style={{ fontSize: `10px`, fontWeight: `bolder` }}>
												Total Volume
											</label>
											<div className="control">
												<input
													style={{ width: `100%` }}
													className="input"
													type="text"
													placeholder="Total Volume"
													{...register(`total_volume_ttbA.${index}`)}
													readOnly
												/>
											</div>
										</div>
										<div
											style={{
												display: `inline-block`,
												marginLeft: `1%`,
												width: `10%`
											}}
											className="field"
										>
											<label style={{ fontSize: `10px`, fontWeight: `bolder` }}>
												Koli
											</label>
											<div className="control">
												<input
													style={{ width: `100%` }}
													className="input"
													type="text"
													placeholder="Koli"
													{...register(`koliA.${index}`)}
													readOnly
												/>
											</div>
										</div>
									</div>
									<div
										style={{
											display: `inline-block`,
											marginTop: `30px`,
											marginLeft: `1%`
										}}
									>
										<i
											className="icon"
											style={{ marginLeft: `-130%` }}
											onClick={(e) => {
												e.preventDefault()
												remove(index)
											}}
											role="img"
										>
											<IconTrash className="svg" />
										</i>
									</div>
								</div>
							)
						})}
						<div
							className="field"
							style={{
								display: `inline-block`,
								width: `calc(50% - 8px)`,
								marginTop: `1%`
							}}
						>
							<label style={{ fontWeight: `bolder` }} className="label">
								Tanggal surat jalan
							</label>
							<div className="control">
								<Controller
									control={control}
									name="tanggal_surat_jalan"
									rules={{ required: true }}
									render={({ field }) => (
										<DatePicker
											{...field}
											style={{
												width: `100%`,
												height: `38px`
											}}
											format={`DD/MM/YYYY`}
											placeholder="Tanggal Surat Jalan"
											onChange={(date) => field.onChange(date)}
											className="form-control"
										/>
									)}
								/>
							</div>
						</div>
						<div
							className="field"
							style={{ display: `inline-block`, width: `calc(50% - 8px)` }}
						>
							<label
								style={{ fontWeight: `bolder`, marginLeft: `10px` }}
								className="label"
							>
								Nama Kapal
							</label>
							<div className="control">
								<input
									style={{
										display: `inline-block`,
										width: `calc(120% - 8px)`,
										margin: `0 8px`
									}}
									className="input"
									type="text"
									placeholder="nama kapal"
									value={filterDaftarMuatBarang?.[0]?.nama_kapal}
									{...register(`nama_kapal`)}
									required
								/>
							</div>
						</div>
						<div
							className="field"
							style={{
								display: `inline-block`,
								width: `calc(50% - 8px)`,
								marginTop: `1%`
							}}
						>
							<label style={{ fontWeight: `bolder` }} className="label">
								Vendor Pelayaran
							</label>
							<div className="control">
								<input
									style={{ width: `100%`, marginTop: `4px` }}
									className="input"
									type="text"
									placeholder="Vendor Pelayaran"
									value={filterDaftarMuatBarang?.[0]?.vendor_pelayanan}
									{...register(`vendor_pelayaran`)}
									required
									disabled
								/>
							</div>
						</div>
						<div
							className="field"
							style={{ display: `inline-block`, width: `calc(50% - 8px)` }}
						>
							<label
								style={{ fontWeight: `bolder`, marginLeft: `10px` }}
								className="label"
							>
								Tanggal Keberangkatan
							</label>
							<div className="control">
								<Controller
									control={control}
									name="tanggal_keberangkatan"
									rules={{ required: true }}
									render={({ field }) => (
										<DatePicker
											{...field}
											style={{
												display: `inline-block`,
												width: `100%`,
												margin: `0 8px`,
												height: `38px`
											}}
											format={`DD/MM/YYYY`}
											placeholder="Tanggal Keberangkatan"
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
								marginTop: `1%`
							}}
						>
							<label style={{ fontWeight: `bolder` }} className="label">
								No. Container
							</label>
							<div className="control">
								<input
									style={{ width: `100%` }}
									className="input"
									type="text"
									placeholder="nomor container"
									value={filterDaftarMuatBarang?.[0]?.nomor_container}
									{...register(`nomor_container`)}
									required
									disabled
								/>
							</div>
						</div>
						<div
							className="field"
							style={{ display: `inline-block`, width: `calc(50% - 8px)` }}
						>
							<label
								style={{ fontWeight: `bolder`, marginLeft: `10px` }}
								className="label"
							>
								Nomor Seal
							</label>
							<div className="control">
								<input
									style={{
										display: `inline-block`,
										width: `calc(120% - 8px)`,
										margin: `0 8px`
									}}
									className="input"
									type="text"
									placeholder="nomor container"
									value={filterDaftarMuatBarang?.[0]?.nomor_seal}
									{...register(`nomor_seal`)}
									required
									disabled
								/>
							</div>
						</div>
						<div className="field" style={{ marginTop: `1%` }}>
							<label style={{ fontWeight: `bolder` }} className="label">
								Keterangan
							</label>
							<div className="control">
								<textarea
									style={{ width: `100%` }}
									className="textarea"
									placeholder="Keterangan"
									{...register(`keterangan`)}
									required
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
