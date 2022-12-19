import { gql, useMutation, useQuery } from "@apollo/client"
import AdminPage from "@components/admin/AdminPage.component"
import Dashboard from "@components/dashboard/Dashboard.component"
import { DashboardContext } from "@contexts/DashboardContext.context"
import { message } from "antd"

import { CREATE_REFERENCE_INVOICE } from "graphql/reference_invoice/mutations"
import { CREATE_REFERENCE_MUAT_BARANG } from "graphql/reference_muat_barang/mutations"
import { CREATE_REFERENCE_PACKING_LIST } from "graphql/reference_packing_list/mutations"
import { CREATE_REFERENCE_SALES_ORDER } from "graphql/reference_sales_order/mutations"
import { CREATE_REFERENCE_SURAT_JALAN } from "graphql/reference_surat_jalan/mutations"
import { CREATE_REFERENCE_SURAT_PENGANTAR } from "graphql/reference_surat_pengantar/mutations"
import { CREATE_REFERENCE_TTB } from "graphql/reference_ttb/mutations"
import { CREATE_REFERENCE_WORKORDER } from "graphql/reference_workorder/mutations"
import Link from "next/link"
import { useRouter } from "next/router"
import { useContext } from "react"
import { useForm } from "react-hook-form"
import { CREATE_DAFTAR_TUJUAN } from "../../../../graphql/daftar_tujuan/mutations"

//get data
const GET_DATA = gql`
	query Daftar_tujuan {
		daftar_tujuan {
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
	fontWeight: `bold`,
	fontSize: `14px`
}

export default function SettingUserEdit() {
	const { state: dashboardState } = useContext(DashboardContext)
	const { data } = useQuery(GET_DATA)
	const router = useRouter()
	const setForm = useForm()

	//create REFERENCE
	const [createReferenceInvoice] = useMutation(CREATE_REFERENCE_INVOICE, {
		refetchQueries: [{ query: GET_DATA }]
	})

	const [createReferenceMuatBarang] = useMutation(
		CREATE_REFERENCE_MUAT_BARANG,
		{
			refetchQueries: [{ query: GET_DATA }]
		}
	)

	const [createReferencePackingList] = useMutation(
		CREATE_REFERENCE_PACKING_LIST,
		{
			refetchQueries: [{ query: GET_DATA }]
		}
	)

	const [createReferenceSalesOrder] = useMutation(
		CREATE_REFERENCE_SALES_ORDER,
		{
			refetchQueries: [{ query: GET_DATA }]
		}
	)

	const [createReferenceSuratJalan] = useMutation(
		CREATE_REFERENCE_SURAT_JALAN,
		{
			refetchQueries: [{ query: GET_DATA }]
		}
	)

	const [createReferenceSuratPengantar] = useMutation(
		CREATE_REFERENCE_SURAT_PENGANTAR,
		{
			refetchQueries: [{ query: GET_DATA }]
		}
	)

	const [createReferenceTTB] = useMutation(CREATE_REFERENCE_TTB, {
		refetchQueries: [{ query: GET_DATA }]
	})

	const [createReferenceWorkOrder] = useMutation(CREATE_REFERENCE_WORKORDER, {
		refetchQueries: [{ query: GET_DATA }]
	})

	const [createDaftarTujuan] = useMutation(CREATE_DAFTAR_TUJUAN, {
		refetchQueries: [{ query: GET_DATA }]
	})

	//create REFERENCE mutation function
	const createReference = (data) => {
		createReferenceInvoice({ variables: { input: data } })
		createReferenceMuatBarang({ variables: { input: data } })
		createReferencePackingList({ variables: { input: data } })
		createReferenceSalesOrder({ variables: { input: data } })
		createReferenceSuratJalan({ variables: { input: data } })
		createReferenceSuratPengantar({ variables: { input: data } })
		createReferenceTTB({ variables: { input: data } })
		createReferenceWorkOrder({ variables: { input: data } })
	}

	const createData = (data) => {
		createDaftarTujuan({ variables: { input: data } })
	}

	const handleSubmit = (e) => {
		e.preventDefault()
		const dataSubmit = {
			kode_tujuan: e.target.kode_tujuan.value,
			nama_tujuan: e.target.nama_tujuan.value,
			creator: String(dashboardState.auth.id),
			updated_by: String(dashboardState.auth.id)
		}
		//check duplicate
		const duplicate = data.daftar_tujuan.find(
			(item) => item.kode_tujuan === dataSubmit.kode_tujuan
		)

		const dataReference = {
			kode_tujuan: e.target.kode_tujuan.value,
			kota_tujuan: e.target.nama_tujuan.value,
			tanggal_tahun: ``,
			bulan_tahun: ``,
			increment: 0
		}

		if (duplicate) {
			message.error(`Kode Tujuan sudah ada`)
		} else {
			createData(dataSubmit)
			createReference(dataReference)
			console.log(data)
			message.success(`Data berhasil ditambahkan`)
			router.push(`/data/daftar-tujuan`)
		}
	}
	return (
		<AdminPage
			parent={
				<Link href="/data/daftar-tujuan">
					<a>Daftar Kota</a>
				</Link>
			}
			authId="daftar-tujuan"
			title="Tambahkan Kota"
			legend=""
			setForm={setForm}
		>
			<section className="section">
				<div className="container">
					<div className="columns">
						<div className="column is-half is-offset-one-quarter">
							<div className="card">
								<div className="card-content">
									<div className="content">
										<form onSubmit={handleSubmit}>
											<div className="form-group">
												<label htmlFor="kode_biaya" style={inputStyles}>
													Kode Kota
												</label>
												<input
													type="text"
													className="form-control"
													style={inputStyle}
													id="kode_tujuan"
													required
												/>
											</div>
											<div className="form-group">
												<label htmlFor="nama_biaya" style={inputStyles}>
													Nama Kota
												</label>
												<input
													type="text"
													className="form-control"
													style={inputStyle}
													id="nama_tujuan"
													required
												/>
											</div>
											<div className="form-group" style={{ marginLeft: `91%` }}>
												<button type="submit" className="button is-primary">
													Tambah
												</button>
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
