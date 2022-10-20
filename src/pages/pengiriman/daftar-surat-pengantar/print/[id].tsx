import { gql, useQuery } from "@apollo/client"
import AdminPage from "@components/admin/AdminPage.component"
import Dashboard from "@components/dashboard/Dashboard.component_print"
import {
	Document,
	Page,
	PDFViewer,
	StyleSheet,
	Text,
	View
} from "@react-pdf/renderer"
import { GET_DAFTAR_MUAT_BARANG } from "graphql/daftar_muat_barang/queries"
import { GET_DAFTAR_SURAT_JALAN } from "graphql/daftar_surat_jalan/queries"
import { GET_DAFTAR_TUJUAN } from "graphql/daftar_tujuan/queries"
import { GET_VECHNICLE } from "graphql/mobil/queries"
import moment from "moment"
import { useRouter } from "next/router"
import { useForm } from "react-hook-form"
import { GET_CUSTOMER } from "../../../../../graphql/customer/queries"
import { GET_DAFTAR_SALES_ORDER } from "../../../../../graphql/daftar_sales_order/queries"
import { GET_DAFTAR_TTB } from "../../../../../graphql/daftar_ttb/queries"

const GET_DATA = gql`
	query daftar_surat_pengantar {
		daftar_surat_pengantar {
			id
			nomor_muat_barang
			nomor_surat_jalan
			nomor_ttb
			total_ttb
			total_koli
			pengirim
			kota_tujuan
			total_volume
			nomor_kendaraan
			vendor_pelayanan
			posisi
			nomor_container
			nomor_seal
		}
	}
`
const styles = StyleSheet.create({
	pageNumber: {
		position: `absolute`,
		fontSize: 12,
		bottom: 40,
		left: 0,
		right: 40,
		textAlign: `right`,
		color: `black`
	},
	body: {
		paddingBottom: 75
	},
	container: {
		padding: `38px 26px`
	},
	text: { fontSize: `10.2325px`, marginTop: `10px` },
	heading: {
		fontSize: `18px`
	},
	date: {
		fontSize: `9.16369px`,
		marginTop: `7px`
	},
	subHeading1: {
		marginTop: `51px`,
		fontSize: `10.2325px`
	},
	table: {
		marginTop: `24px`,
		marginLeft: `40px`,
		border: `1px solid #000000`,
		marginRight: `40px`
	},
	tblHeading: {
		marginTop: `12px`,
		marginLeft: `12px`,
		marginBottom: `12px`,
		fontSize: `8px`
	},
	tblHeader: {
		display: `flex`,
		borderTop: `1px solid #000000`,
		flexDirection: `row`,
		justifyContent: `space-between`
	},
	tblBody: { borderTop: `1px solid #000000` },
	tblRow: {
		display: `flex`,
		justifyContent: `space-between`,
		flexDirection: `row`
	},
	tblRow2: {
		display: `flex`,
		justifyContent: `space-between`,
		flexDirection: `row`,
		borderTop: `1px solid #000000`
	},
	tblCell: {
		backgroundColor: `#F4F4F4`,
		padding: `10px 20px`,
		fontSize: `10.3214px`
	},
	tableTextH: {
		width: `60px`,
		fontSize: `10px`,
		textAlign: `center`,
		borderRight: `1px solid #000000`,
		justifyContent: `center`,
		padding: `10px`
	},
	//tableText
	tableText: {
		width: `60px`,
		fontSize: `10px`,
		textAlign: `center`,
		padding: `10px`,
		borderRight: `1px solid #000000`
	},
	tableText2: {
		width: `80px`,
		fontSize: `10.2469px`,
		textAlign: `center`,
		padding: `10px`,
		borderRight: `1px solid #000000`
	}
})
export default function Home() {
	const { data } = useQuery(GET_DATA)
	const setForm = useForm()
	const router = useRouter()
	const id = router.query.id
	// GET DATA ttb number where id eqaul to id
	const daftar_surat_jalan_id = data?.daftar_surat_pengantar?.filter((item) => {
		return item.id === parseInt(id as string)
	})
	//get ttb number
	const { data: dataTtb } = useQuery(GET_DAFTAR_TTB)

	//get sales order
	const { data: dataSalesOrder } = useQuery(GET_DAFTAR_SALES_ORDER)

	//get customer
	const { data: dataCustomer } = useQuery(GET_CUSTOMER)

	//get vechnicle
	const { data: dataVechicle } = useQuery(GET_VECHNICLE)
	//get daftar muat barang
	const { data: dataDaftarMuatBarang } = useQuery(GET_DAFTAR_MUAT_BARANG)
	//get daftar surat jalan
	const { data: dataDaftarSuratJalan } = useQuery(GET_DAFTAR_SURAT_JALAN)
	//get daftar tujuan
	const { data: dataDaftarTujuan } = useQuery(GET_DAFTAR_TUJUAN)

	// get all data where nomor_surat_jalan equal to daftar_surat_jalan[0].nomor_surat_jalan
	const daftar_surat_jalan = data?.daftar_surat_pengantar?.filter((item) => {
		return (
			item.nomor_surat_jalan === daftar_surat_jalan_id?.[0]?.nomor_surat_jalan
		)
	})

	const nomor_ttb = daftar_surat_jalan?.map((item) => {
		return item.nomor_ttb
	})

	//filter data by ttb number in nomor_ttb daftar_surat_jalan
	const datadaftarTTB = dataTtb?.daftar_ttb?.filter((item) => {
		return nomor_ttb?.includes(item.ttb_number)
	})

	console.log(`data`, daftar_surat_jalan)

	//datadaftarTTB map
	const dataTTB = datadaftarTTB?.map((item) => {
		return {
			id: item.id,
			ttb_number: item.ttb_number,
			pengirim: item.pengirim,
			container_size: item.container_size,
			nomor_telepon: item.nomor_telepon,
			panjang: item.panjang,
			lebar: item.lebar,
			tinggi: item.tinggi,
			alamat_tujuan: item.alamat_tujuan,
			kode_tujuan: item.kota_tujuan,
			//get nama tujuan from customer
			nama_tujuan: dataDaftarTujuan?.daftar_tujuan?.filter((item2) => {
				return item2.kota_customer === item.kode_tujuan
			})?.[0]?.nama_tujuan,
			volume_m3: item.panjang * item.lebar * item.tinggi * item.koli,
			jenis_pengiriman: item.jenis_pengiriman,
			penerima: item.nama_penerima,
			nama_barang: item.nama_barang,
			koli: dataTtb?.daftar_ttb?.find(
				(item2) => item2.ttb_number === item.ttb_number
			)?.koli,
			count: datadaftarTTB?.filter(
				(item2) => item2.nama_barang === item.nama_barang
			).length,
			//nomor sales order from sales order
			nomor_so: dataSalesOrder?.daftar_sales_order?.find(
				(item2) => item2.nomor_ttb === item.ttb_number
			)?.nomor_sales_order,
			status: item.status
		}
	})

	const MuatBarang = dataDaftarMuatBarang?.daftar_muat_barang.filter(
		(item) => item.nomor_ttb === dataTTB?.[0]?.ttb_number
	)

	console.log(`nama kapal`, MuatBarang)

	const SuratJalan = dataDaftarSuratJalan?.daftar_surat_jalan.filter(
		(item) => item.nomor_ttb === dataTTB?.[0]?.ttb_number
	)

	//filter data customer
	const dataCustomerFilter = dataCustomer?.customer.filter(
		(item) => item.nama_customer === dataTTB?.[0]?.pengirim
	)

	//get nama supir by surat jalan nomor kendaraan
	const nama_supir = dataVechicle?.vechnicle?.find(
		(item) => item.nomor_kendaraan === daftar_surat_jalan?.[0]?.nomor_kendaraan
	)?.nama_supir
	const MyDocument = () => (
		<Document>
			<Page style={styles.body}>
				<View style={{ flexDirection: `row` }}>
					<View
						style={{
							marginTop: `40px`,
							marginLeft: `40px`,
							fontWeight: `bold`,
							fontSize: `12px`
						}}
					>
						<Text style={{ fontFamily: `Helvetica-Bold` }}>
							PT TUNAS KREASI PERKASA LOGISTIK
						</Text>
						<Text style={{ fontSize: `10px`, paddingTop: `2px` }}>
							Telp: 6630638 (Hunting) Fax: 6630639
						</Text>
						<Text style={{ fontSize: `10px`, flex: 1, paddingTop: `2px` }}>
							Email: kreasiperkasa@gmail.com
						</Text>
					</View>
					<View
						style={{
							marginTop: `38px`,
							marginLeft: `116px`
						}}
					>
						<Text
							style={{
								fontFamily: `Helvetica-Bold`
							}}
						>
							SURAT PENGANTAR
						</Text>
						<Text
							style={{
								fontFamily: `Helvetica-Bold`,
								marginLeft: `88px`,
								fontSize: `10px`
							}}
						>
							{daftar_surat_jalan_id?.[0]?.nomor_surat_jalan}
						</Text>
					</View>
				</View>
				<View
					style={{
						flexDirection: `row`,
						marginLeft: `40px`,
						marginRight: `40px`,
						marginTop: `40px`,
						paddingBottom: `40px`,
						borderTop: `1px solid black`,
						borderBottom: `1px solid black`
					}}
				>
					<View
						style={{
							paddingRight: `40px`,
							marginBottom: `-41px`,
							fontSize: `12px`,
							borderBottom: `1px solid black`,
							borderRight: `1px solid black`,
							width: `515px`
						}}
					>
						<Text
							style={{
								marginTop: `16px`,
								fontSize: `10px`,
								fontWeight: `heavy`,
								marginRight: `116px`
							}}
						>
							Pengirim
						</Text>
						<Text
							style={{
								marginTop: `4px`,
								fontStyle: `bold`,
								fontFamily: `Helvetica-Bold`,
								fontSize: `10px`
							}}
						>
							{dataTTB?.[0]?.pengirim} ({dataCustomerFilter?.[0]?.telepon})
						</Text>
						<Text style={{ fontSize: `10px`, flex: 1, paddingTop: `2px` }}>
							{dataCustomerFilter?.[0]?.alamat}
						</Text>
					</View>
					<View style={{ marginLeft: `10px`, width: `515px` }}>
						<Text style={{ fontSize: `10px`, marginTop: `16px` }}>
							Penerima
						</Text>
						<Text
							style={{
								marginTop: `4px`,
								fontFamily: `Helvetica-Bold`,
								fontSize: `10px`
							}}
						>
							{dataTTB?.[0]?.penerima}
						</Text>
						<Text
							style={{
								paddingTop: `2px`,
								fontFamily: `Helvetica-Bold`,
								fontSize: `10px`
							}}
						>
							({dataTTB?.[0]?.nomor_telepon})
						</Text>
						<Text style={{ paddingTop: `2px`, fontSize: `10px` }}>
							{dataTTB?.[0]?.alamat_tujuan}
						</Text>
					</View>
				</View>
				<View style={styles.table}>
					<Text style={styles.tblHeading}>
						<Text
							style={{
								width: `215px`,
								fontSize: `10px`,
								padding: `10px`,
								borderRight: `1px solid #000000`
							}}
						>
							No.Kendaraan : {`            `}
							<Text style={{ fontFamily: `Helvetica-Bold` }}>
								{daftar_surat_jalan?.[0]?.nomor_kendaraan}
							</Text>
						</Text>
						<Text>{`\n`}</Text>
						<Text>{`\n`}</Text>
						<Text
							style={{
								width: `215px`,
								fontSize: `10px`,
								padding: `10px`,
								borderRight: `1px solid #000000`
							}}
						>
							Nama Supir : {`               `}
							{` `}
							<Text style={{ fontFamily: `Helvetica-Bold` }}>{nama_supir}</Text>
						</Text>
						<Text>{`\n`}</Text>
						<Text>{`\n`}</Text>
						<Text
							style={{
								width: `215px`,
								fontSize: `10px`,
								padding: `10px`,
								borderRight: `1px solid #000000`
							}}
						>
							No.Kontainer : {`              `}
							<Text style={{ fontFamily: `Helvetica-Bold` }}>
								{MuatBarang?.[0]?.nomor_container}
							</Text>
						</Text>
						<Text>{`\n`}</Text>
						<Text>{`\n`}</Text>
						<Text
							style={{
								width: `215px`,
								fontSize: `10px`,
								padding: `10px`,
								borderRight: `1px solid #000000`
							}}
						>
							No.Seal : {`                      `}
							<Text style={{ fontFamily: `Helvetica-Bold` }}>
								{MuatBarang?.[0]?.nomor_seal}
							</Text>
						</Text>
						<Text>{`\n`}</Text>
						<Text>{`\n`}</Text>
						<Text
							style={{
								width: `215px`,
								fontSize: `10px`,
								padding: `10px`,
								borderRight: `1px solid #000000`
							}}
						>
							Nama Kapal : {`               `}
							<Text style={{ fontFamily: `Helvetica-Bold` }}>
								{MuatBarang?.[0]?.nama_kapal}
							</Text>
						</Text>
						<Text>{`\n`}</Text>
						<Text>{`\n`}</Text>
						<Text
							style={{
								width: `215px`,
								fontSize: `10px`,
								padding: `10px`,
								borderRight: `1px solid #000000`
							}}
						>
							Tgl Pengiriman : {`           `}
							<Text style={{ fontFamily: `Helvetica-Bold` }}>
								{moment(SuratJalan?.[0]?.tanggal_keberangkatan).format(
									`DD/MM/YYYY`
								)}
							</Text>
						</Text>
					</Text>
					<View style={styles.tblHeader}>
						<Text
							style={{
								width: `215px`,
								fontSize: `10px`,
								fontFamily: `Helvetica-Bold`,
								textAlign: `left`,
								padding: `10px`,
								borderRight: `1px solid #000000`
							}}
						>
							NAMA BARANG
						</Text>
						<Text
							style={{
								width: `215px`,
								fontSize: `10px`,
								fontFamily: `Helvetica-Bold`,
								textAlign: `center`,
								padding: `10px`,
								borderRight: `1px solid #000000`
							}}
						>
							NO. TTB
						</Text>
						<Text
							style={{
								width: `215px`,
								fontSize: `10px`,
								fontFamily: `Helvetica-Bold`,
								textAlign: `center`,
								padding: `10px`,
								borderRight: `1px solid #000000`
							}}
						>
							NO. SO
						</Text>
						<Text
							style={{
								width: `150px`,
								fontSize: `10px`,
								fontFamily: `Helvetica-Bold`,
								textAlign: `right`,
								padding: `10px`,
								borderRight: `1px solid #000000`
							}}
						>
							TUJUAN
						</Text>
						<Text
							style={{
								width: `150px`,
								fontSize: `9px`,
								fontFamily: `Helvetica-Bold`,
								textAlign: `right`,
								padding: `10px`
							}}
						>
							CONTAINER SIZE
						</Text>
					</View>
					<View style={styles.tblBody}>
						{dataTTB?.map((item, index) => (
							<View style={styles.tblRow} key={index}>
								<Text
									style={{
										width: `215px`,
										fontSize: `11px`,
										textAlign: `left`,
										padding: `10px`,
										borderRight: `1px solid #000000`
									}}
								>
									{item.nama_barang}
								</Text>
								<Text
									style={{
										width: `215px`,
										fontSize: `11px`,
										textAlign: `center`,
										padding: `10px`,
										borderRight: `1px solid #000000`
									}}
								>
									{item.ttb_number}
								</Text>
								<Text
									style={{
										width: `215px`,
										fontSize: `11px`,
										textAlign: `center`,
										padding: `10px`,
										borderRight: `1px solid #000000`
									}}
								>
									{item.nomor_so}
								</Text>
								<Text
									style={{
										width: `150px`,
										fontSize: `11px`,
										textAlign: `right`,
										padding: `10px`,
										borderRight: `1px solid #000000`
									}}
								>
									{item.nama_tujuan}
								</Text>
								<Text
									style={{
										width: `150px`,
										fontSize: `11px`,
										textAlign: `right`,
										padding: `10px`
									}}
								>
									{item.container_size}
								</Text>
							</View>
						))}
					</View>
				</View>
				<View
					style={{
						flexDirection: `row`,
						marginTop: `15px`,
						paddingBottom: `40px`
					}}
				>
					<View
						style={{
							marginLeft: `40px`,
							marginBottom: `-41px`,
							fontSize: `12px`,
							width: `200px`
						}}
					>
						<Text
							style={{
								marginTop: `15px`,
								fontSize: `10px`,
								fontFamily: `Helvetica-Bold`,
								marginRight: `116px`
							}}
						>
							CATATAN
						</Text>
						<Text style={{ marginTop: `2%`, fontSize: `10px`, flex: 1 }}>
							{daftar_surat_jalan_id?.[0]?.keterangan}
						</Text>
					</View>
					<View style={{ flexDirection: `row` }}>
						<View
							style={{
								marginTop: `6px`,
								marginLeft: `230px`
							}}
						></View>
					</View>
				</View>
				<Text
					style={styles.pageNumber}
					render={({ pageNumber, totalPages }) =>
						`Halaman ${pageNumber} dari ${totalPages}`
					}
					fixed
				/>
			</Page>
		</Document>
	)
	return (
		<AdminPage setForm={setForm} authId="home" title="" legend="">
			<section className="section">
				<PDFViewer width="2000" height="1000">
					<MyDocument />
				</PDFViewer>
			</section>
		</AdminPage>
	)
}

Home.getLayout = function getLayout(page) {
	return <Dashboard>{page}</Dashboard>
}
