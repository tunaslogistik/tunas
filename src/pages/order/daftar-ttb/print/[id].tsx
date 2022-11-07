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
import moment from "moment"
import { useRouter } from "next/router"
import { useForm } from "react-hook-form"
import { GET_CUSTOMER } from "../../../../../graphql/customer/queries"

const GET_DATA = gql`
	query daftar_ttb {
		daftar_ttb {
			id
			ttb_number
			pengirim
			kota_tujuan
			tanggal_diterima
			nama_penerima
			jenis_pengiriman
			nomor_telepon
			nama_barang
			total_volume
			panjang
			lebar
			tinggi
			koli
			alamat_tujuan
			status
			kategori
			full_container
		}
	}
`

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
		fontSize: `8px`,
		textAlign: `left`,
		fontFamily: `Helvetica-Bold`,
		borderRight: `1px solid #000000`,
		justifyContent: `center`,
		padding: `10px`
	},
	tableTextG: {
		width: `60px`,
		fontFamily: `Helvetica-Bold`,
		fontSize: `10px`,
		textAlign: `center`,
		justifyContent: `center`,
		padding: `10px`
	},
	//tableText
	tableText: {
		width: `60px`,
		fontSize: `10px`,
		textAlign: `left`,
		padding: `10px`,
		borderRight: `1px solid #000000`
	},
	tableText2: {
		width: `80px`,
		fontSize: `10.2469px`,
		textAlign: `center`,
		padding: `10px`,
		borderRight: `1px solid #000000`
	},
	tableText4: {
		width: `80px`,
		fontFamily: `Helvetica-Bold`,
		fontSize: `10.2469px`,
		textAlign: `center`,
		padding: `10px`
	},
	tableText3: {
		width: `60px`,
		fontSize: `10px`,
		textAlign: `right`,
		padding: `10px`
	}
})
export default function Home() {
	const { data } = useQuery(GET_DATA)
	const { data: dataCustomer } = useQuery(GET_CUSTOMER)
	const setForm = useForm()
	const router = useRouter()
	const id = router.query.id
	// GET DATA ttb number where id eqaul to id

	const dataTTBfilter = data?.daftar_ttb?.filter(
		(item) => item.id === parseInt(id as string)
	)

	const dataTTB = data?.daftar_ttb?.filter(
		(item) => item.ttb_number === dataTTBfilter?.[0]?.ttb_number
	)

	// get data customer
	const dataCustomerFilter = dataCustomer?.customer?.filter(
		(item) => item.nama_customer === dataTTB?.[0]?.pengirim
	)

	const MyDocument = () => (
		<Document>
			<Page style={styles.body}>
				<View style={{ flexDirection: `row`, marginBottom: `20px` }} fixed>
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
						<Text style={{ fontSize: `10px`, paddingTop: `2px`, flex: 1 }}>
							Email: kreasiperkasa@gmail.com
						</Text>
					</View>
					<View
						style={{
							marginTop: `40px`
						}}
					>
						<Text
							style={{
								fontWeight: `bold`,
								marginLeft: `40%`,
								fontFamily: `Helvetica-Bold`
							}}
						>
							Tanda Terima Barang
						</Text>
						<Text
							style={{
								fontFamily: `Helvetica-Bold`,
								paddingTop: `2px`,
								width: `320px`,
								textAlign: `right`,
								fontSize: `10px`
							}}
						>
							{dataTTB?.[0]?.ttb_number}
						</Text>
					</View>
				</View>
				<View
					style={{
						flexDirection: `row`,
						marginLeft: `40px`,
						marginRight: `40px`,
						marginTop: `20px`,
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
						<Text style={{ fontSize: `10px`, paddingTop: `3px`, flex: 1 }}>
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
						<Text
							style={{
								fontSize: `10px`,
								fontFamily: `Helvetica-Bold`,
								paddingTop: `2px`
							}}
						>
							({dataTTB?.[0]?.nomor_telepon})
						</Text>
						<Text
							style={{
								fontSize: `10px`,
								paddingTop: `2px`
							}}
						>
							{dataTTB?.[0]?.alamat_tujuan}
						</Text>
					</View>
				</View>
				<View style={styles.table}>
					<Text style={styles.tblHeading}>
						<Text style={{ fontSize: `9px` }}>
							No.Kontainer : {dataTTB?.[0]?.container_number}
						</Text>
						<Text>{`\n`}</Text>
						<Text style={{ fontSize: `9px` }}>
							No.Seal : {dataTTB?.[0]?.container_number}
						</Text>
					</Text>
					<View style={styles.tblHeader}>
						<Text
							style={{
								width: `60px`,
								fontSize: `8px`,
								fontFamily: `Helvetica-Bold`,
								textAlign: `left`,
								flex: 1,
								padding: `10px`,
								borderRight: `1px solid #000000`
							}}
						>
							KOLI
						</Text>
						<Text
							style={{
								width: `215px`,
								fontSize: `8px`,
								textAlign: `left`,
								fontFamily: `Helvetica-Bold`,
								padding: `10px`,
								borderRight: `1px solid #000000`
							}}
						>
							NAMA BARANG
						</Text>
						<Text style={styles.tableTextH}>PANJANG</Text>
						<Text style={styles.tableTextH}>LEBAR</Text>
						<Text style={styles.tableTextH}>TINGGI</Text>
						<Text
							style={{
								width: `60px`,
								fontFamily: `Helvetica-Bold`,
								fontSize: `8px`,
								textAlign: `right`,
								paddingLeft: `10px`,
								paddingTop: `10px`,
								paddingBottom: `10px`,
								paddingRight: `5px`
							}}
						>
							TOTAL
						</Text>
					</View>
					<View style={styles.tblBody}>
						{dataTTB?.map((item, index) => (
							<View style={styles.tblRow} key={index}>
								<Text
									style={{
										width: `60px`,
										fontSize: `11px`,
										textAlign: `left`,
										flex: 1,
										padding: `10px`,
										borderRight: `1px solid #000000`
									}}
								>
									{item.koli}
								</Text>
								<Text
									style={{
										width: `215px`,
										fontSize: `11px`,
										textAlign: `left`,
										padding: `10px`,
										borderRight: `1px solid #000000`
									}}
								>
									{item.nama_barang.split()}
								</Text>
								<Text style={styles.tableText}>{item.panjang}</Text>
								<Text style={styles.tableText}>{item.lebar}</Text>
								<Text style={styles.tableText}>{item.tinggi}</Text>
								<Text style={styles.tableText3}>
									{item.panjang * item.lebar * item.tinggi * item.koli}
								</Text>
							</View>
						))}
						<View style={styles.tblRow2} key="">
							<Text
								style={{
									width: `365px`,
									fontSize: `11px`,
									textAlign: `center`,
									padding: `10px`,
									borderRight: `1px solid #000000`
								}}
							>
								{}
							</Text>
							<Text
								style={{
									width: `147px`,
									marginLeft: `10px`,
									fontSize: `9px`,
									textAlign: `center`,
									padding: `10px`,
									fontFamily: `Helvetica-Bold`
								}}
							>
								Total Keseluruhan
							</Text>
							<Text style={styles.tableText2}></Text>
							<Text
								style={{
									width: `80px`,
									fontFamily: `Helvetica-Bold`,
									fontSize: `8px`,
									textAlign: `right`,
									paddingTop: `10px`,
									paddingBottom: `10px`,
									paddingLeft: `10px`,
									paddingRight: `10px`
								}}
							>
								{dataTTB?.[0]?.total_volume}
							</Text>
						</View>
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
							fontSize: `12px`
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
							CATATAN :
						</Text>
						{dataTTB?.[0]?.full_container === `Kontainer Tidak Penuh` ? (
							``
						) : (
							<Text
								style={{
									marginTop: `4px`,
									fontStyle: `bold`,
									fontWeight: `bold`,
									fontSize: `10px`
								}}
							>
								Kontainer Penuh
							</Text>
						)}
						{dataTTB?.[0]?.kategori === `Barang Tidak Berbahaya` ? (
							``
						) : (
							<Text style={{ marginTop: `5px`, fontSize: `10px`, flex: 1 }}>
								Barang Berbahaya
							</Text>
						)}

						<Text style={{ marginTop: `10px`, fontSize: `10px`, flex: 1 }}>
							Biaya angkutan ditanggung oleh pengirim/penerima barang
						</Text>
						<Text style={{ marginTop: `10px`, fontSize: `10px`, flex: 1 }}>
							Ekspedisi tidak bertanggung jawab atas keterlambatan kapal
						</Text>
						<Text style={{ marginTop: `10px`, fontSize: `10px`, flex: 1 }}>
							Ekspedisi tidak mengganti rugi klaim disebabkan musibah
						</Text>
						<Text
							style={{
								marginTop: `10px`,
								fontSize: `10px`,
								flex: 1,
								marginRight: `100px`
							}}
						>
							Ekspedisi tidak bertanggung jawab bila barang rusak
						</Text>
						<Text
							style={{
								marginTop: `10px`,
								fontSize: `10px`,
								flex: 1,
								marginRight: `100px`
							}}
						>
							dalam keadaan packing utuh
						</Text>
					</View>
					<View style={{ marginLeft: `10%` }}>
						<Text
							style={{
								textAlign: `right`,
								fontSize: `10px`,
								marginTop: `15px`,
								fontFamily: `Helvetica-Bold`,
								marginLeft: `45%`
							}}
						>
							Jakarta,{` `}
							{moment(dataTTB?.[0]?.tanggal_diterima).format(`DD-MM-YYYY`)}
						</Text>
						<View style={{ flexDirection: `row` }}>
							<View
								style={{
									marginTop: `6px`
								}}
							>
								<Text style={{ fontSize: `10px` }}>Disetujui Pengirim</Text>
								<Text style={{ marginTop: `45px`, fontSize: `10px`, flex: 1 }}>
									(______________)
								</Text>
							</View>
							<View
								style={{
									marginTop: `6px`,
									marginLeft: `45px`
								}}
							>
								<Text style={{ fontSize: `9px` }}>Diterima oleh</Text>
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
