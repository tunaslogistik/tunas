import { gql, useQuery } from "@apollo/client"
import AdminPage from "@components/admin/AdminPage.component"
import Dashboard from "@components/dashboard/Dashboard.component_print"
import {
	Document,
	Font,
	Page,
	PDFViewer,
	StyleSheet,
	Text,
	View
} from "@react-pdf/renderer"
import { GET_DAFTAR_TUJUAN } from "graphql/daftar_tujuan/queries"
import moment from "moment"
import { useRouter } from "next/router"
import { useRef } from "react"
import { useForm } from "react-hook-form"
import { GET_CUSTOMER } from "../../../../../graphql/customer/queries"
import { GET_DAFTAR_TTB } from "../../../../../graphql/daftar_ttb/queries"

const GET_DATA = gql`
	query daftar_sales_order {
		daftar_sales_order {
			id
			nomor_ttb
			nomor_sales_order
			total_volume
			harga
			pengirim
			kota_tujuan
			total_tagihan
			nama_kapal
			tanggal_keberangkatan
			tanggal_sales_order
			term_payment
		}
	}
`
//Helvetica-Bold from react-pdf
Font.register({
	family: `Helvetica-Bold`,
	src: `https://fonts.gstatic.com/s/helveticaneue/v70/1Ptsg8zYS_SKggPNyC0IT0kLW-43aMEzIO6XUTLjad8.woff2`
})

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
		fontSize: `11.2469px`
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
	const { data, loading, error } = useQuery(GET_DATA)
	const { data: data_TTB } = useQuery(GET_DAFTAR_TTB)
	const { data: dataCustomer } = useQuery(GET_CUSTOMER)
	console.log(`data_TTB`, data_TTB)
	//get daftar tujuan
	const { data: dataTujuan } = useQuery(GET_DAFTAR_TUJUAN)

	const componentRef = useRef()
	const setForm = useForm()
	const router = useRouter()
	const id = router.query.id

	const dataSalesOrderfilter = data?.daftar_sales_order?.filter(
		(item) => item.id === parseInt(id as string)
	)
	// GET DATA ttb number where id eqaul to id
	const dataTTBfilter = data_TTB?.daftar_ttb?.filter(
		(item) => item.ttb_number === dataSalesOrderfilter?.[0]?.nomor_ttb
	)

	const dataTTB = dataTTBfilter

	//get kota tujuan from daftar tujuan where kode tujuan equal to kode tujuan
	const dataTujuanFilter = dataTujuan?.daftar_tujuan.find(
		(item2) => item2.kode_tujuan === dataTTB?.[0]?.kota_tujuan
	)?.nama_tujuan

	//get ttb number
	const ttbNumber = dataTTB?.[0]?.ttb_number

	//filter data by ttb number
	const dataFilter = data?.daftar_ttb?.filter(
		(item) => item.ttb_number === ttbNumber
	)

	//store all nama barang in dataTTB with comma
	const namaBarang = dataTTB?.map((item) => item.nama_barang).join(`, `)

	// sum all koli
	const totalKoli = dataTTB?.reduce((acc, item) => acc + item.koli, 0)
	// get data customer
	const dataCustomerFilter = dataCustomer?.customer?.filter(
		(item) => item.nama_customer === dataTTB?.[0]?.pengirim
	)

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
						<Text
							style={{
								fontFamily: `Helvetica-Bold`
							}}
						>
							PT TUNAS KREASI PERKASA LOGISTIK
						</Text>
						<Text style={{ fontSize: `10px`, paddingTop: `2px` }}>
							Telp: 6630638 (Hunting) Fax: 6630639
						</Text>
						<Text style={{ fontSize: `10px`, paddingTop: `2px`, flex: 1 }}>
							Email: kreasiperkasa@gmail.com
						</Text>
					</View>
					<View
						style={{
							marginTop: `40px`,
							marginLeft: `116px`
						}}
					>
						<Text
							style={{
								fontFamily: `Helvetica-Bold`,
								marginLeft: `47%`
							}}
						>
							SALES ORDER
						</Text>
						<Text
							style={{
								marginLeft: `60%`,
								fontFamily: `Helvetica-Bold`,
								fontSize: `10px`,
								width: `500px`
							}}
						>
							{dataSalesOrderfilter?.[0]?.nomor_sales_order}
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
								fontFamily: `Helvetica-Bold`,
								fontSize: `10px`
							}}
						>
							{dataTTB?.[0]?.pengirim} ({dataCustomerFilter?.[0]?.telepon})
						</Text>
						<Text style={{ paddingTop: `2px`, fontSize: `10px`, flex: 1 }}>
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
							{dataTTB?.[0]?.nama_penerima}
						</Text>
						<Text style={{ paddingTop: `2px`, fontSize: `10px` }}>
							({dataTTB?.[0]?.nomor_telepon})
						</Text>
						<Text style={{ paddingTop: `2px`, fontSize: `10px` }}>
							{dataTTB?.[0]?.alamat_tujuan}
						</Text>
					</View>
				</View>
				<View
					style={{
						flexDirection: `row`,
						marginLeft: `40px`,
						marginRight: `40px`,
						marginTop: `40px`,
						paddingBottom: `4px`,
						border: `1px solid black`
					}}
				>
					<View
						style={{
							paddingRight: `40px`,
							fontSize: `12px`,
							marginLeft: `10px`
						}}
					>
						<Text
							style={{
								marginTop: `4px`,
								fontSize: `10px`
							}}
						>
							No. TTB:
						</Text>
						<Text style={{ paddingTop: `5px`, fontSize: `10px`, flex: 1 }}>
							Tanggal TTB:
						</Text>
						<Text style={{ paddingTop: `5px`, fontSize: `10px`, flex: 1 }}>
							Jenis Muatan:
						</Text>
						<Text style={{ paddingTop: `5px`, fontSize: `10px`, flex: 1 }}>
							Jumlah Koli:
						</Text>
						<Text style={{ paddingTop: `5px`, fontSize: `10px`, flex: 1 }}>
							Volume (m3):
						</Text>
						<Text style={{ paddingTop: `5px`, fontSize: `10px`, flex: 1 }}>
							Tujuan
						</Text>
						<Text style={{ paddingTop: `3px`, fontSize: `10px`, flex: 1 }}>
							Harga:
						</Text>
						<Text style={{ paddingTop: `5px`, fontSize: `10px`, flex: 1 }}>
							Total Tagihan:
						</Text>
						<Text style={{ paddingTop: `5px`, fontSize: `10px`, flex: 1 }}>
							TOP:
						</Text>
						<Text style={{ paddingTop: `5px`, fontSize: `10px`, flex: 1 }}>
							No. REK BCA:
						</Text>
					</View>
					<View style={{ marginLeft: `10px`, width: `515px` }}>
						<Text
							style={{
								paddingTop: `5px`,
								fontFamily: `Helvetica-Bold`,
								fontSize: `10px`
							}}
						>
							{dataTTB?.[0]?.ttb_number}
						</Text>
						<Text
							style={{
								paddingTop: `5px`,
								fontFamily: `Helvetica-Bold`,
								fontSize: `10px`
							}}
						>
							{moment(dataTTB?.[0]?.tanggal_diterima).format(`DD-MM-YYYY`)}
						</Text>
						<Text
							style={{
								paddingTop: `5px`,
								fontFamily: `Helvetica-Bold`,
								fontSize: `10px`
							}}
						>
							{namaBarang}
						</Text>
						<Text
							style={{
								paddingTop: `5px`,
								fontFamily: `Helvetica-Bold`,
								fontSize: `10px`
							}}
						>
							{totalKoli}
						</Text>
						<Text
							style={{
								paddingTop: `5px`,
								fontFamily: `Helvetica-Bold`,
								fontSize: `10px`
							}}
						>
							{dataTTB?.[0]?.total_volume}
						</Text>
						<Text
							style={{
								paddingTop: `5px`,
								fontFamily: `Helvetica-Bold`,
								fontSize: `10px`
							}}
						>
							{dataTujuanFilter}
						</Text>
						<Text
							style={{
								paddingTop: `0px`,
								fontFamily: `Helvetica-Bold`,
								fontSize: `10px`
							}}
						>
							{dataTTB?.[0]?.harga}
						</Text>
						<Text
							style={{
								paddingTop: `5px`,
								fontFamily: `Helvetica-Bold`,
								fontSize: `10px`
							}}
						>
							{dataTTB?.[0]?.total_volume}
						</Text>
						<Text
							style={{
								paddingTop: `5px`,
								fontFamily: `Helvetica-Bold`,
								fontSize: `10px`
							}}
						>
							{dataSalesOrderfilter?.[0]?.total_tagihan}
						</Text>
						<Text
							style={{
								paddingTop: `5px`,
								fontFamily: `Helvetica-Bold`,
								fontSize: `10px`
							}}
						>
							{dataSalesOrderfilter?.[0]?.term_payment}
						</Text>
						<Text
							style={{
								paddingTop: `5px`,
								fontFamily: `Helvetica-Bold`,
								fontSize: `10px`
							}}
						>
							244-2877-999 a/n PT Tunas Kreasi Perkasa Logistik
						</Text>
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
							fontSize: `12px`
						}}
					>
						<Text
							style={{
								marginTop: `15px`,
								fontSize: `10px`,
								fontFamily: `Helvetica-Bold`,
								marginRight: `290px`
							}}
						>
							CATATAN :
						</Text>
						{dataTTB?.[0]?.kategori === `Barang Tidak Berbahaya` ? (
							``
						) : (
							<Text
								style={{
									fontStyle: `bold`,
									marginTop: `5px`,
									fontSize: `9px`,
									flex: 1
								}}
							>
								Barang Berbahaya
							</Text>
						)}
						<Text style={{ marginTop: `1px`, fontSize: `9px`, flex: 1 }}>
							Mohon konfirmasi dari Bapak/Ibu mengenai Sales Order ini.
						</Text>
						<Text style={{ fontSize: `9px`, flex: 1 }}>
							Apabila dalam jangka waktu 3x24 jam kami tidak menerima
						</Text>
						<Text style={{ fontSize: `9px`, flex: 1 }}>
							balasan dari Bapak/Ibu, maka kami anggap Sales Order ini telah
						</Text>
						<Text style={{ fontSize: `9px`, flex: 1 }}>disetujui.</Text>
					</View>
					<View style={{ marginLeft: `10%` }}>
						<Text
							style={{
								textAlign: `right`,
								fontSize: `10px`,
								fontFamily: `Helvetica-Bold`,
								marginTop: `5px`,
								marginLeft: `47%`
							}}
						>
							Jakarta,{` `}
							{moment(dataTTB?.[0]?.tanggal_diterima).format(`DD-MM-YYYY`)}
						</Text>
						<View style={{ flexDirection: `row` }}>
							<View
								style={{
									marginTop: `16px`
								}}
							>
								<Text style={{ fontSize: `10px`, marginLeft: `13px` }}>
									Hormat Kami,
								</Text>
								<Text style={{ marginTop: `45px`, fontSize: `10px`, flex: 1 }}>
									(______________)
								</Text>
							</View>
							<View
								style={{
									marginTop: `16px`,
									marginLeft: `47px`
								}}
							>
								<Text style={{ fontSize: `9px`, marginLeft: `10px` }}>
									Menyetujui,
								</Text>
								<Text
									style={{
										marginLeft: `-10px`,
										marginTop: `45px`,
										fontSize: `10px`,
										flex: 1
									}}
								>
									(______________)
								</Text>
							</View>
						</View>
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
		<AdminPage setForm={setForm} authId="" title="" legend="">
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
