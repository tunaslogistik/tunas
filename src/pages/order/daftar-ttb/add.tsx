/* eslint-disable no-mixed-spaces-and-tabs */
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons"
import { useMutation, useQuery } from "@apollo/client"
import AdminPage from "@components/admin/AdminPage.component"
import Dashboard from "@components/dashboard/Dashboard.component"
import { Button, DatePicker, Form, Input, Select, Space, message } from "antd"

import Checkbox from "antd/lib/checkbox/Checkbox"
import TextArea from "antd/lib/input/TextArea"
import { GET_ACCURATE } from "graphql/accurate/queries"
import { GET_CUSTOMER } from "graphql/customer/queries"
import { GET_DAFTAR_TUJUAN } from "graphql/daftar_tujuan/queries"
import { GET_JENIS_PENGIRIMAN } from "graphql/jenis_pengiriman/queries"
import { UPDATE_REFERENCE_TTB } from "graphql/reference_ttb/mutations"
import { GET_REFERENCE_TTB } from "graphql/reference_ttb/queries"
import moment from "moment"
import Link from "next/link"
import { useRouter } from "next/router"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { CREATE_DAFTAR_TTB } from "../../../../graphql/daftar_ttb/mutations"
import { GET_DAFTAR_TTB } from "../../../../graphql/daftar_ttb/queries"
//get data

export default function Home() {
	const { data } = useQuery(GET_DAFTAR_TTB)
	//GET DATA JENIS PENGIRIMAN
	const { data: dataJenisPengiriman } = useQuery(GET_JENIS_PENGIRIMAN)
	//GET DATA DAFTAR TUJUAN
	const { data: dataDaftarTujuan } = useQuery(GET_DAFTAR_TUJUAN)
	//GET DATA CUSTOMER
	const { data: dataCustomer } = useQuery(GET_CUSTOMER)
	//GET DATA REFERENCE TTB
	const { data: dataReferenceTtb } = useQuery(GET_REFERENCE_TTB)
	//GET DATA ACCURATE
	const { data: dataAccurate } = useQuery(GET_ACCURATE)

	const router = useRouter()
	const setForm = useForm()
	const { control, reset, register, watch, setValue } = setForm

	const [createDaftar_ttb] = useMutation(CREATE_DAFTAR_TTB, {
		refetchQueries: [{ query: GET_DAFTAR_TTB }]
	})

	//create mutation function
	const createData = (data) => {
		createDaftar_ttb({ variables: { input: data } })
	}

	//UPDATE
	const [updateReferenceTtb] = useMutation(UPDATE_REFERENCE_TTB, {
		refetchQueries: [{ query: GET_REFERENCE_TTB }]
	})

	const updateData = (data) => {
		updateReferenceTtb({ variables: { input: data } })
	}

	//setPPN

	const handleChange = (value) => {
		setValue(`ppn`, value)
		setPpn(value)
	}

	const [ppn, setPpn] = useState(``)

	console.log(`ppn`, ppn)
	//get data from dataaccurate where ppn = nama_barang
	const dataAccuratePpn = dataAccurate?.accurate?.filter(
		(item: any) => item.nama_barang === ppn
	)

	const tax_name = String(dataAccuratePpn?.[0]?.taxName)

	const { Option } = Select
	function addLeadingZeros(num, totalLength) {
		return String(num).padStart(totalLength, `0`)
	}

	//watch k

	const onFinish = (values: any) => {
		//get nama barang inside values
		const panjang = values?.daftar_ttb?.map((item: any) => {
			return item.panjang
		})
		//get data from datareferencettb where kode_tujuan === kota_tujuan
		const dataReference = dataReferenceTtb?.reference_ttb?.filter(
			(item: any) => item.kode_tujuan === values.kota_tujuan
		)

		if (panjang !== undefined) {
			const sum = values.daftar_ttb.reduce((accumulator, object) => {
				return (
					accumulator +
					object.panjang * object.lebar * object.tinggi * object.koli
				)
			}, 0)

			console.log(`sum`, sum)
			const data = values.daftar_ttb.map((item: any) => {
				return {
					ttb_number: ``,
					pengirim: values.pengirim,
					kota_tujuan: values.kota_tujuan,
					tanggal_diterima: String(values.tanggal_diterima),
					nama_penerima: values.nama_penerima,
					jenis_pengiriman: values.jenis_pengiriman,
					nomor_telepon: values.nomor_telepon,
					nama_barang: item.nama_barang,
					container_size: String(values.container_size),
					panjang: String(item.panjang),
					lebar: String(item.lebar),
					tinggi: String(item.tinggi),
					koli: String(item.koli),
					total_volume: String(sum),
					alamat_tujuan: values.alamat_tujuan,
					status: `TTB`,
					kategori: String(values.kategori),
					full_container: String(values.full_container),
					pembayar: values.pembayar,
					ppn: tax_name,
					accurate: values.accurate,
					biaya_tambahan: values.biaya_tambahan_ppn,
					biaya_tambahan_non_ppn: values.biaya_tambahan_non_ppn
				}
			})
			//count array of object length
			const count = data.length

			for (let i = 0; i < count; i++) {
				if (data[i].full_container === `true`) {
					data[i].full_container = `Full Container`
				}
				if (
					data[i].full_container === `false` ||
					data[i].full_container === undefined ||
					data[i].full_container === ``
				) {
					data[i].full_container = `Kontainer Tidak Penuh`
				}

				if (data[i].kategori === `true`) {
					data[i].kategori = `Barang Berbahaya`
				}
				if (
					data[i].kategori === `false` ||
					data[i].kategori === undefined ||
					data[i].kategori === ``
				) {
					data[i].kategori = `Barang Tidak Berbahaya`
				}
			}

			data.map((item) => {
				//if String(moment.unix(values.tanggal_ttb / 1000).format(`YY-MM`)) !== dataReference[0].tanggal_tahun then addleadingg zeros(1,4) else addleadingzeros(dataReference + 1,4)
				if (
					String(moment.unix(values.tanggal_ttb / 1000).format(`MM`)) !==
					dataReference[0].bulan_tahun
				) {
					item.ttb_number =
						values.full_container === true
							? `TTB-FL/` +
							  values.kota_tujuan +
							  `/` +
							  String(moment.unix(values.tanggal_ttb / 1000).format(`YY-MM`)) +
							  `/` +
							  addLeadingZeros(1, 4)
							: `TTB/` +
							  values.kota_tujuan +
							  `/` +
							  String(moment.unix(values.tanggal_ttb / 1000).format(`YY-MM`)) +
							  `/` +
							  addLeadingZeros(1, 4)
				} else {
					item.ttb_number =
						values.full_container === true
							? `TTB-FL/` +
							  values.kota_tujuan +
							  `/` +
							  String(moment.unix(values.tanggal_ttb / 1000).format(`YY-MM`)) +
							  `/` +
							  addLeadingZeros(dataReference[0].increment + 1, 4)
							: `TTB/` +
							  values.kota_tujuan +
							  `/` +
							  String(moment.unix(values.tanggal_ttb / 1000).format(`YY-MM`)) +
							  `/` +
							  addLeadingZeros(dataReference[0].increment + 1, 4)
				}
			})
			//if String(moment.unix(values.tanggal_ttb / 1000).format(`YY-MM`)) !== dataReference[0].tanggal_tahun then increment = 1 else increment = dataReference[0].increment + 1
			const increment =
				String(moment.unix(values.tanggal_ttb / 1000).format(`MM`)) !==
				dataReference[0].bulan_tahun
					? 1
					: dataReference[0].increment + 1

			const tanggal_tahun = String(
				moment.unix(values.tanggal_ttb / 1000).format(`YY-MM`)
			)

			const dataReferenceTTBupdate = {
				id: dataReference[0].id,
				increment: increment,
				tanggal_tahun: tanggal_tahun,
				bulan_tahun: String(moment.unix(values.tanggal_ttb / 1000).format(`MM`))
			}

			// for loop to create data
			for (let i = 0; i < count; i++) {
				createData(data[i])
			}

			//update reference
			updateData(dataReferenceTTBupdate)

			message.success(`Data berhasil ditambahkan`)
			router.push(`/order/daftar-ttb`)
		} else {
			message.error(`Tambahkan  list barang terlebih dahulu`)
		}
	}

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

	//map data customer
	const mapCustomer = dataCustomer?.customer?.map((customer) => {
		return {
			label: customer.nama_customer
		}
	})

	//map data accurate
	const mapAccurate = dataAccurate?.accurate?.map((accurate) => {
		return {
			label: accurate.nama_barang,
			ppn: accurate.taxName,
			kode_barang: accurate.kode_barang
		}
	})

	return (
		<AdminPage
			parent={
				<Link href="/order/daftar-ttb">
					<a>Daftar TTB</a>
				</Link>
			}
			authId=""
			title="Tambah TTB"
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
						<label style={{ fontWeight: `bold` }} className="label">
							Tanggal diterima
						</label>
						<Form.Item
							name="tanggal_diterima"
							rules={[
								{
									required: true,
									message: `Tanggal diterima tidak boleh kosong`
								}
							]}
						>
							<DatePicker
								format="DD-MM-YYYY"
								style={{ width: `100%`, height: `38px` }}
							/>
						</Form.Item>
						<div
							style={{
								display: `inline-block`,
								width: `calc(50% - 8px)`,
								marginTop: `1%`
							}}
						>
							<label style={{ fontWeight: `bold` }} className="label">
								Pengirim
							</label>
							<Form.Item
								name="pengirim"
								rules={[
									{
										required: true,
										message: `Pengirim tidak boleh kosong`
									}
								]}
							>
								<Select
									style={{ width: `100%`, height: `38px` }}
									placeholder="Pilih Pengirim"
								>
									{mapCustomer?.map((customer) => {
										return (
											<Option key={customer.label} value={customer.label}>
												{customer.label}
											</Option>
										)
									})}
								</Select>
							</Form.Item>
						</div>
						<div
							style={{
								display: `inline-block`,
								width: `calc(50% - 8px)`,
								marginTop: `1%`,
								marginLeft: `15px`
							}}
						>
							<label style={{ fontWeight: `bold` }} className="label">
								Pembayar
							</label>
							<Form.Item
								name="pembayar"
								rules={[
									{
										required: true,
										message: `Pengirim tidak boleh kosong`
									}
								]}
							>
								<Select
									style={{ width: `100%`, height: `38px` }}
									placeholder="Pilih Pembayar"
								>
									{mapCustomer?.map((customer) => {
										return (
											<Option key={customer.label} value={customer.label}>
												{customer.label}
											</Option>
										)
									})}
								</Select>
							</Form.Item>
						</div>
						<div
							style={{
								display: `inline-block`,
								width: `calc(50% - 8px)`,
								marginTop: `1%`
							}}
						>
							<label style={{ fontWeight: `bold` }} className="label">
								Nama Penerima
							</label>
							<Form.Item name="nama_penerima">
								<Input style={{ width: `100%` }} required />
							</Form.Item>
						</div>
						<div
							style={{
								display: `inline-block`,
								width: `calc(50% - 8px)`,
								marginTop: `1%`,
								marginLeft: `15px`
							}}
						>
							<label style={{ fontWeight: `bold` }} className="label">
								Nomor Telepon
							</label>
							<Form.Item name="nomor_telepon">
								<Input style={{ width: `100%` }} required />
							</Form.Item>
						</div>
						<div
							style={{
								display: `inline-block`,
								width: `calc(50% - 8px)`,
								marginTop: `1%`
							}}
						>
							<label style={{ fontWeight: `bold` }} className="label">
								Kota Tujuan
							</label>
							<Form.Item
								name="kota_tujuan"
								rules={[
									{
										required: true,
										message: `Pilih Kota Tujuan`
									}
								]}
							>
								<Select
									style={{ width: `100%`, height: `38px` }}
									placeholder="Pilih kode tujuan"
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
						</div>
						<div
							style={{
								display: `inline-block`,
								width: `calc(50% - 8px)`,
								marginTop: `1%`,
								marginLeft: `15px`
							}}
						>
							<label style={{ fontWeight: `bold` }} className="label">
								Jenis Pengiriman
							</label>
							<Form.Item
								name="jenis_pengiriman"
								rules={[
									{
										required: true,
										message: `Pilih jenis pengiriman`
									}
								]}
							>
								<Select
									placeholder="Pilih Jenis Pengiriman"
									style={{ width: `100%`, height: `38px` }}
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
						</div>
						<label style={{ fontWeight: `bold` }} className="label">
							Alamat Tujuan
						</label>
						<Form.Item name="alamat_tujuan">
							<TextArea style={{ width: `100%` }} rows={4} required />
						</Form.Item>
						<label style={{ fontWeight: `bold` }} className="label">
							Tanggal TTB
						</label>
						<Form.Item
							name="tanggal_ttb"
							rules={[
								{
									required: true,
									message: `Masukan Tanggal TTB`
								}
							]}
						>
							<DatePicker format="DD-MM-YYYY" style={{ width: `100%` }} />
						</Form.Item>
						<div>
							<label style={{ fontWeight: `bold` }} className="label">
								Container Size
							</label>
							<Form.Item name="container_size">
								<Input style={{ width: `100%` }} required />
							</Form.Item>
						</div>
						<h6>List Barang</h6>
						<Form.List name="daftar_ttb">
							{(fields, { add, remove }) => (
								<>
									{fields.map(({ key, name, ...restField }) => (
										<Space
											key={key}
											style={{ display: `flex`, marginBottom: 8 }}
											align="baseline"
										>
											<Form.Item
												{...restField}
												name={[name, `nama_barang`]}
												style={{ width: `145%` }}
												rules={[{ required: true, message: `Missing` }]}
												key={key}
											>
												<Input placeholder="nama barang" required />
											</Form.Item>
											<Form.Item
												{...restField}
												name={[name, `panjang`]}
												style={{ marginLeft: `80px` }}
												rules={[{ required: true, message: `Missing` }]}
												key={key}
											>
												<Input placeholder="panjang" required />
											</Form.Item>
											<Form.Item
												{...restField}
												name={[name, `tinggi`]}
												rules={[{ required: true, message: `Missing` }]}
												key={key}
											>
												<Input placeholder="tinggi" required />
											</Form.Item>
											<Form.Item
												{...restField}
												name={[name, `lebar`]}
												rules={[{ required: true, message: `Missing` }]}
												key={key}
											>
												<Input placeholder="lebar" required />
											</Form.Item>
											<Form.Item
												{...restField}
												name={[name, `koli`]}
												rules={[{ required: true, message: `Missing` }]}
												key={key}
											>
												<Input placeholder="koli" required />
											</Form.Item>
											<MinusCircleOutlined onClick={() => remove(name)} />
										</Space>
									))}
									<Form.Item>
										<Button
											type="dashed"
											style={{ marginBottom: `1%` }}
											onClick={() => add()}
											block
											icon={<PlusOutlined />}
										>
											Tambahkan List Barang
										</Button>
									</Form.Item>
								</>
							)}
						</Form.List>
						<div>
							<label style={{ fontWeight: `bold` }} className="label">
								Setting accurate
							</label>
						</div>
						<div
							style={{
								display: `inline-block`,
								width: `calc(50% - 8px)`,
								marginTop: `1%`
							}}
						>
							<label style={{ fontWeight: `bold` }} className="label">
								Accurate
							</label>
							<Form.Item
								name="accurate"
								rules={[
									{
										required: true,
										message: `Accurate tidak boleh kosong`
									}
								]}
							>
								<Select
									style={{ width: `100%`, height: `38px` }}
									placeholder="Pilih Integrasi Accurate"
									//setPPn and get data from accurate where nama barang = value

									onChange={(value) => {
										setPpn(value)
									}}
								>
									{mapAccurate?.map((accurate) => {
										return (
											<Option key={accurate.label} value={accurate.label}>
												{accurate.label}
											</Option>
										)
									})}
								</Select>
							</Form.Item>
						</div>
						<div
							style={{
								display: `inline-block`,
								width: `calc(50% - 8px)`,
								marginTop: `1%`,
								marginLeft: `15px`
							}}
						>
							<label style={{ fontWeight: `bold` }} className="label">
								PPN
							</label>
							<div>
								<input
									style={{
										width: `100%`,
										height: `33px`,
										fontSize: `13px`,
										paddingLeft: `10px`
									}}
									value={
										tax_name === `undefined`
											? `Silahkan pilih integrasi accurate`
											: tax_name
									}
									disabled
								/>
							</div>
						</div>
						<div
							style={{
								display: `inline-block`,
								width: `calc(50% - 8px)`,
								marginTop: `1%`
							}}
						>
							<label style={{ fontWeight: `bold` }} className="label">
								Biaya Tambahan PPN
							</label>
							<Form.Item
								name="biaya_tambahan_ppn"
								rules={[
									{
										required: true,
										message: `Biaya Tambahan PPN tidak boleh kosong`
									}
								]}
							>
								<Select
									style={{ width: `100%`, height: `38px` }}
									placeholder="Pilih Integrasi Accurate"
								>
									{mapAccurate?.map((accurate) => {
										return (
											<Option key={accurate.label} value={accurate.kode_barang}>
												{accurate.label}
											</Option>
										)
									})}
								</Select>
							</Form.Item>
						</div>
						<div
							style={{
								display: `inline-block`,
								width: `calc(50% - 8px)`,
								marginTop: `1%`,
								marginLeft: `15px`
							}}
						>
							<label style={{ fontWeight: `bold` }} className="label">
								Biaya Tambahan Non PPN
							</label>
							<div>
								<Form.Item
									name="biaya_tambahan_non_ppn"
									rules={[
										{
											required: true,
											message: `Biaya Tambahan PPN tidak boleh kosong`
										}
									]}
								>
									<Select
										style={{ width: `100%`, height: `38px` }}
										placeholder="Pilih Integrasi Accurate"
									>
										{mapAccurate?.map((accurate) => {
											return (
												<Option
													key={accurate.label}
													value={accurate.kode_barang}
												>
													{accurate.label}
												</Option>
											)
										})}
									</Select>
								</Form.Item>
							</div>
						</div>
						<Form.Item name="full_container" valuePropName="checked">
							<Checkbox>Full container</Checkbox>
						</Form.Item>
						<Form.Item name="kategori" valuePropName="checked">
							<Checkbox>Barang berbahaya</Checkbox>
						</Form.Item>
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
					</Form>
				</div>
			</section>
		</AdminPage>
	)
}
Home.getLayout = function getLayout(page) {
	return <Dashboard>{page}</Dashboard>
}
