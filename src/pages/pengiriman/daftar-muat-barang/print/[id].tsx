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

const GET_DATA = gql`
	query daftar_muat_barang {
		daftar_muat_barang {
			id
			nomor_muat_barang
			nomor_ttb
			total_ttb
			koli
			total_koli
			pengirim
			penerima
			kota_tujuan
			total_volume
			nomor_kendaraan
			vendor_pelayanan
			nama_barang
			posisi
			nomor_container
			nomor_seal
			tanggal_masuk
			volume
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
		fontSize: `8px`
	},
	tblHeader: {
		display: `flex`,
		flexDirection: `row`,
		justifyContent: `space-between`
	},
	tblBody: { borderTop: `1px solid #000000` },
	tblBodys: {
		backgroundColor: `#E4E4E4`,
		borderTop: `1px solid #000000`
	},
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
	const daftar_muat_barang = data?.daftar_muat_barang.find(
		(item) => item.id === parseInt(id as string)
	)

	const nomor_muat_barang = daftar_muat_barang?.nomor_muat_barang

	//get daftar_muat_barangfilter where posisi = kepala
	const kepalaArray2 = data?.daftar_muat_barang.filter((item) => {
		return (
			item.nomor_muat_barang === nomor_muat_barang && item.posisi === `Kepala`
		)
	})

	//replace  - with / in nomor ttb in kepalaArray2
	const kepalaArray = kepalaArray2?.map((item) => {
		return {
			...item,
			ttb: item.nomor_ttb
		}
	})

	//get data where poisisi is kepala and nomor muat barang same daftar_muat_barang
	const tengahArray2 = data?.daftar_muat_barang.filter((item) => {
		return (
			item.nomor_muat_barang === nomor_muat_barang && item.posisi === `Tengah`
		)
	})

	//replace / to | in nomor_ttb in tengahArray
	const tengahArray = tengahArray2?.map((item) => {
		return {
			...item,
			nomor_ttb: item.nomor_ttb.replace(/\//g, `|`)
		}
	})

	//get data where poisisi is kepala and nomor muat barang same daftar_muat_barang
	const bawahArray2 = data?.daftar_muat_barang.filter((item) => {
		return (
			item.nomor_muat_barang === nomor_muat_barang && item.posisi === `Bawah`
		)
	})

	//replace - to _ in nomor_ttb in bawahArray
	const bawahArray = bawahArray2?.map((item) => {
		return {
			...item,
			nomor_ttb: item.nomor_ttb.replace(/\//g, `|`)
		}
	})

	const MyDocument = () => (
		<Document>
			<Page style={styles.body}>
				<View style={{ flexDirection: `row` }} fixed>
					<View
						style={{
							marginTop: `40px`,
							marginLeft: `40px`,
							marginBottom: `50px`,
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
							marginTop: `40px`,
							marginLeft: `63px`
						}}
					>
						<Text
							style={{
								fontFamily: `Helvetica-Bold`,
								fontSize: `17px`
							}}
						>
							MUAT BARANG (STOWAGE)
						</Text>
						<Text
							style={{
								fontFamily: `Helvetica-Bold`,
								marginLeft: `113px`,
								paddingTop: `2px`,
								fontSize: `12px`
							}}
						>
							{daftar_muat_barang?.nomor_muat_barang}
						</Text>
					</View>
				</View>
				<View
					style={{
						flexDirection: `row`,
						marginLeft: `40px`,
						marginRight: `40px`,
						paddingBottom: `40px`
					}}
				>
					<View
						style={{
							paddingRight: `40px`,
							fontSize: `12px`,
							marginRight: `40px`,
							borderRight: `1px solid #000000`,
							borderLeft: `1px solid #000000`,
							borderTop: `1px solid #000000`,
							borderBottom: `1px solid #000000`,
							width: `455px`,
							height: `150px`
						}}
					>
						<View
							style={{
								flexDirection: `row`
							}}
						>
							<Text
								style={{
									marginTop: `16px`,
									marginLeft: `16px`,
									fontSize: `10px`,
									fontWeight: `heavy`,
									marginRight: `80px`
								}}
							>
								Tanggal:
							</Text>
							<Text
								style={{
									marginTop: `16px`,
									marginLeft: `1px`,
									fontSize: `10px`,
									fontFamily: `Helvetica-Bold`,
									marginRight: `116px`
								}}
							>
								{moment(daftar_muat_barang?.tanggal_muat).format(`DD/MM/YYYY`)}
							</Text>
						</View>
						<View
							style={{
								flexDirection: `row`
							}}
						>
							<Text
								style={{
									marginLeft: `16px`,
									marginTop: `5px`,
									fontSize: `10px`,
									fontWeight: `heavy`,
									marginRight: `80px`
								}}
							>
								No. Kontainer:
							</Text>
							<Text
								style={{
									marginLeft: `1px`,
									fontSize: `10px`,
									marginTop: `5px`,
									fontFamily: `Helvetica-Bold`,
									marginRight: `116px`
								}}
							>
								{daftar_muat_barang?.nomor_container}
							</Text>
						</View>
						<View
							style={{
								flexDirection: `row`,
								marginTop: `5px`
							}}
						>
							<Text
								style={{
									marginLeft: `16px`,
									fontSize: `10px`,
									fontWeight: `heavy`,
									marginRight: `80px`
								}}
							>
								No. Kendaraan:
							</Text>
							<Text
								style={{
									marginLeft: `1px`,
									fontSize: `10px`,
									fontFamily: `Helvetica-Bold`,
									marginRight: `116px`
								}}
							>
								{daftar_muat_barang?.nomor_kendaraan}
							</Text>
						</View>
						<View
							style={{
								flexDirection: `row`,
								marginTop: `5px`
							}}
						>
							<Text
								style={{
									marginLeft: `16px`,
									fontSize: `10px`,
									fontWeight: `heavy`,
									marginRight: `80px`
								}}
							>
								Pelayaran:
							</Text>
							<Text
								style={{
									marginLeft: `1px`,
									fontSize: `10px`,
									fontFamily: `Helvetica-Bold`,
									marginRight: `100px`
								}}
							>
								{daftar_muat_barang?.vendor_pelayanan}
							</Text>
						</View>
						<View
							style={{
								flexDirection: `row`,
								marginTop: `5px`
							}}
						>
							<Text
								style={{
									marginLeft: `16px`,
									fontSize: `10px`,
									fontWeight: `heavy`,
									marginRight: `80px`
								}}
							>
								No. Seal:
							</Text>
							<Text
								style={{
									marginLeft: `1px`,
									fontSize: `10px`,
									fontFamily: `Helvetica-Bold`,
									marginRight: `116px`
								}}
							>
								{daftar_muat_barang?.nomor_seal}
							</Text>
						</View>
						<View
							style={{
								flexDirection: `row`,
								marginTop: `5px`
							}}
						>
							<Text
								style={{
									marginLeft: `16px`,
									fontSize: `10px`,
									fontWeight: `heavy`,
									marginRight: `80px`
								}}
							>
								Tujuan:
							</Text>
							<Text
								style={{
									marginLeft: `1px`,
									fontSize: `10px`,
									fontFamily: `Helvetica-Bold`,
									marginRight: `116px`
								}}
							>
								{daftar_muat_barang?.kota_tujuan}
							</Text>
						</View>
						<View
							style={{
								flexDirection: `row`,
								marginTop: `5px`
							}}
						>
							<Text
								style={{
									marginLeft: `16px`,
									fontSize: `10px`,
									fontWeight: `heavy`,
									marginRight: `80px`
								}}
							>
								Jumlah:
							</Text>
							<Text
								style={{
									marginLeft: `1px`,
									fontSize: `10px`,
									fontFamily: `Helvetica-Bold`,
									marginRight: `116px`
								}}
							>
								{daftar_muat_barang?.total_koli}
							</Text>
						</View>
						<View
							style={{
								flexDirection: `row`,
								marginTop: `5px`
							}}
						>
							<Text
								style={{
									marginLeft: `16px`,
									fontSize: `10px`,
									fontWeight: `heavy`,
									marginRight: `80px`,
									marginBottom: `20px`
								}}
							>
								Volume:
							</Text>
							<Text
								style={{
									marginLeft: `1px`,
									fontSize: `10px`,
									fontFamily: `Helvetica-Bold`,
									marginRight: `116px`,
									marginBottom: `20px`
								}}
							>
								{daftar_muat_barang?.total_volume}
							</Text>
						</View>
					</View>
					<View
						style={{
							marginLeft: `10px`,
							width: `415px`,
							height: `133px`,
							borderBottom: `1px solid #000000`,
							borderLeft: `1px solid #000000`,
							borderRight: `1px solid #000000`,
							borderTop: `1px solid #000000`
						}}
					>
						<Text
							style={{
								fontSize: `10px`,
								padding: `10px`,
								borderBottom: `1px solid #000000`,
								textAlign: `center`,
								fontFamily: `Helvetica-Bold`
							}}
						>
							Gudang Logistik
						</Text>
						<View
							style={{
								flexDirection: `row`
							}}
						>
							<Text
								style={{
									fontSize: `10px`,
									fontFamily: `Helvetica-Bold`,
									paddingLeft: `6px`,
									paddingRight: `6px`,
									paddingTop: `80px`,
									borderRight: `1px solid #000000`,
									height: `100px`
								}}
							>
								{`(__________)`}
							</Text>
							<Text
								style={{
									fontSize: `10px`,
									fontFamily: `Helvetica-Bold`,
									paddingLeft: `6px`,
									paddingRight: `6px`,
									paddingTop: `80px`,
									borderRight: `1px solid #000000`,
									height: `100px`
								}}
							>
								{`(__________)`}
							</Text>
							<Text
								style={{
									fontSize: `10px`,
									paddingLeft: `6px`,
									paddingRight: `6px`,
									fontFamily: `Helvetica-Bold`,
									paddingTop: `80px`,
									height: `100px`
								}}
							>
								{`(__________)`}
							</Text>
						</View>
					</View>
				</View>
				<View style={styles.table}>
					<View style={styles.tblHeader}>
						<Text
							style={{
								width: `390px`,
								fontSize: `8px`,
								textAlign: `center`,
								fontFamily: `Helvetica-Bold`,
								padding: `10px`,
								borderRight: `1px solid #000000`
							}}
						>
							TGL MASUK
						</Text>
						<Text
							style={{
								width: `355px`,
								fontSize: `8px`,
								textAlign: `left`,
								fontFamily: `Helvetica-Bold`,
								padding: `10px`,
								borderRight: `1px solid #000000`
							}}
						>
							PENGIRIM
						</Text>
						<Text
							style={{
								width: `450px`,
								fontSize: `8px`,
								textAlign: `left`,
								fontFamily: `Helvetica-Bold`,
								padding: `10px`,
								borderRight: `1px solid #000000`
							}}
						>
							PENERIMA
						</Text>
						<Text
							style={{
								width: `450px`,
								fontSize: `8px`,
								textAlign: `left`,
								fontFamily: `Helvetica-Bold`,
								padding: `10px`,
								borderRight: `1px solid #000000`
							}}
						>
							NO. TTB
						</Text>
						<Text
							style={{
								width: `355px`,
								fontSize: `8px`,
								textAlign: `center`,
								fontFamily: `Helvetica-Bold`,
								padding: `10px`,
								borderRight: `1px solid #000000`
							}}
						>
							JUMLAH
						</Text>
						<Text
							style={{
								width: `250px`,
								fontSize: `8px`,
								textAlign: `center`,
								padding: `10px`,
								fontFamily: `Helvetica-Bold`,
								borderRight: `1px solid #000000`
							}}
						>
							VOL M³
						</Text>
						<Text
							style={{
								width: `415px`,
								fontSize: `8px`,
								textAlign: `center`,
								fontFamily: `Helvetica-Bold`,
								padding: `10px`
							}}
						>
							KETERANGAN
						</Text>
					</View>
					<View style={styles.tblBodys}>
						<View style={styles.tblRow}>
							<Text
								style={{
									width: `390px`,
									fontSize: `8px`,
									textAlign: `center`,
									padding: `10px`
								}}
							></Text>
							<Text
								style={{
									width: `355px`,
									fontSize: `8px`,
									textAlign: `center`,
									padding: `10px`
								}}
							></Text>
							<Text
								style={{
									width: `355px`,
									fontSize: `8px`,
									textAlign: `center`,
									padding: `10px`
								}}
							></Text>
							<Text
								style={{
									width: `250px`,
									fontSize: `8px`,
									textAlign: `center`,
									padding: `10px`
								}}
							></Text>
							<Text
								style={{
									width: `415px`,
									fontSize: `8px`,
									textAlign: `center`,
									fontFamily: `Helvetica-Bold`,
									padding: `10px`
								}}
							>
								Depan(Kepala)
							</Text>
							<Text
								style={{
									width: `355px`,
									fontSize: `8px`,
									textAlign: `center`,
									padding: `10px`
								}}
							></Text>
							<Text
								style={{
									width: `250px`,
									fontSize: `8px`,
									textAlign: `center`,
									padding: `10px`
								}}
							></Text>
							<Text
								style={{
									width: `415px`,
									fontSize: `8px`,
									textAlign: `center`,
									padding: `10px`
								}}
							></Text>
						</View>
					</View>
					<View style={styles.tblBody}>
						{kepalaArray?.map((item, index) => (
							<View style={styles.tblRow} key={index}>
								<Text
									style={{
										width: `390px`,
										fontSize: `8px`,
										textAlign: `center`,
										padding: `10px`,
										borderRight: `1px solid #000000`
									}}
								>
									{moment(daftar_muat_barang?.tanggal_muat).format(
										`DD/MM/YYYY`
									)}
								</Text>
								<Text
									style={{
										width: `355px`,
										fontSize: `8px`,
										textAlign: `left`,
										padding: `10px`,
										borderRight: `1px solid #000000`
									}}
								>
									{item.pengirim}
								</Text>
								<Text
									style={{
										width: `450px`,
										fontSize: `8px`,
										textAlign: `left`,
										padding: `10px`,
										borderRight: `1px solid #000000`
									}}
								>
									{item.penerima}
								</Text>
								<Text
									style={{
										width: `450px`,
										fontSize: `8px`,
										textAlign: `left`,
										paddingTop: `10px`,
										paddingRight: `10px`,
										paddingBottom: `10px`,
										paddingLeft: `3px`,
										flexWrap: `wrap`,
										borderRight: `1px solid #000000`
									}}
								>
									{item?.nomor_ttb}
								</Text>
								<Text
									style={{
										width: `355px`,
										fontSize: `8px`,
										textAlign: `left`,
										padding: `10px`,
										borderRight: `1px solid #000000`
									}}
								>
									{item.koli}
								</Text>
								<Text
									style={{
										width: `250px`,
										fontSize: `8px`,
										textAlign: `left`,
										padding: `10px`,
										borderRight: `1px solid #000000`
									}}
								>
									{item.volume}
								</Text>
								<Text
									style={{
										width: `415px`,
										fontSize: `8px`,
										textAlign: `left`,
										padding: `10px`
									}}
								>
									{item.nama_barang}
								</Text>
							</View>
						))}
					</View>
					<View style={styles.tblBodys}>
						<View style={styles.tblRow}>
							<Text
								style={{
									width: `390px`,
									fontSize: `8px`,
									textAlign: `center`,
									padding: `10px`
								}}
							></Text>
							<Text
								style={{
									width: `355px`,
									fontSize: `8px`,
									textAlign: `center`,
									padding: `10px`
								}}
							></Text>
							<Text
								style={{
									width: `355px`,
									fontSize: `8px`,
									textAlign: `center`,
									padding: `10px`
								}}
							></Text>
							<Text
								style={{
									width: `250px`,
									fontSize: `8px`,
									textAlign: `center`,
									padding: `10px`
								}}
							></Text>
							<Text
								style={{
									width: `415px`,
									fontSize: `8px`,
									fontFamily: `Helvetica-Bold`,
									textAlign: `center`,
									padding: `10px`
								}}
							>
								Tengah
							</Text>
							<Text
								style={{
									width: `355px`,
									fontSize: `8px`,
									textAlign: `center`,
									padding: `10px`
								}}
							></Text>
							<Text
								style={{
									width: `250px`,
									fontSize: `8px`,
									textAlign: `center`,
									padding: `10px`
								}}
							></Text>
							<Text
								style={{
									width: `415px`,
									fontSize: `8px`,
									textAlign: `center`,
									padding: `10px`
								}}
							></Text>
						</View>
					</View>
					<View style={styles.tblBody}>
						{tengahArray?.map((item, index) => (
							<View style={styles.tblRow} key={index}>
								<Text
									style={{
										width: `390px`,
										fontSize: `8px`,
										textAlign: `left`,
										padding: `10px`,
										borderRight: `1px solid #000000`
									}}
								>
									{moment(daftar_muat_barang?.tanggal_muat).format(
										`DD/MM/YYYY`
									)}
								</Text>
								<Text
									style={{
										width: `355px`,
										fontSize: `8px`,
										textAlign: `left`,
										padding: `10px`,
										borderRight: `1px solid #000000`
									}}
								>
									{item.pengirim}
								</Text>
								<Text
									style={{
										width: `450px`,
										fontSize: `8px`,
										textAlign: `left`,
										padding: `10px`,
										borderRight: `1px solid #000000`
									}}
								>
									{item.penerima}
								</Text>
								<Text
									style={{
										width: `450px`,
										fontSize: `8px`,
										textAlign: `left`,
										paddingTop: `10px`,
										paddingRight: `10px`,
										paddingBottom: `10px`,
										paddingLeft: `3px`,
										borderRight: `1px solid #000000`
									}}
								>
									{item.nomor_ttb}
								</Text>
								<Text
									style={{
										width: `355px`,
										fontSize: `8px`,
										textAlign: `left`,
										padding: `10px`,
										borderRight: `1px solid #000000`
									}}
								>
									{item.koli}
								</Text>
								<Text
									style={{
										width: `250px`,
										fontSize: `8px`,
										textAlign: `left`,
										padding: `10px`,
										borderRight: `1px solid #000000`
									}}
								>
									{item.volume}
								</Text>
								<Text
									style={{
										width: `415px`,
										fontSize: `8px`,
										textAlign: `left`,
										padding: `10px`
									}}
								>
									{item.nama_barang}
								</Text>
							</View>
						))}
					</View>
					<View style={styles.tblBodys}>
						<View style={styles.tblRow}>
							<Text
								style={{
									width: `390px`,
									fontSize: `8px`,
									textAlign: `center`,
									padding: `10px`
								}}
							></Text>
							<Text
								style={{
									width: `355px`,
									fontSize: `8px`,
									textAlign: `center`,
									padding: `10px`
								}}
							></Text>
							<Text
								style={{
									width: `355px`,
									fontSize: `8px`,
									textAlign: `center`,
									padding: `10px`
								}}
							></Text>
							<Text
								style={{
									width: `250px`,
									fontSize: `8px`,
									textAlign: `center`,
									padding: `10px`
								}}
							></Text>
							<Text
								style={{
									width: `715px`,
									fontSize: `8px`,
									textAlign: `center`,
									fontFamily: `Helvetica-Bold`,
									padding: `10px`
								}}
							>
								Belakang(Pintu)
							</Text>
							<Text
								style={{
									width: `355px`,
									fontSize: `8px`,
									textAlign: `center`,
									padding: `10px`
								}}
							></Text>
							<Text
								style={{
									width: `250px`,
									fontSize: `8px`,
									textAlign: `center`,
									padding: `10px`
								}}
							></Text>
							<Text
								style={{
									width: `415px`,
									fontSize: `8px`,
									textAlign: `center`,
									padding: `10px`
								}}
							></Text>
						</View>
					</View>
					<View style={styles.tblBody}>
						{bawahArray?.map((item, index) => (
							<View style={styles.tblRow} key={index}>
								<Text
									style={{
										width: `390px`,
										fontSize: `8px`,
										textAlign: `center`,
										padding: `10px`,
										borderRight: `1px solid #000000`
									}}
								>
									{moment(daftar_muat_barang?.tanggal_muat).format(
										`DD/MM/YYYY`
									)}
								</Text>
								<Text
									style={{
										width: `355px`,
										fontSize: `8px`,
										textAlign: `left`,
										padding: `10px`,
										borderRight: `1px solid #000000`
									}}
								>
									{item.pengirim}
								</Text>
								<Text
									style={{
										width: `450px`,
										fontSize: `8px`,
										textAlign: `left`,
										padding: `10px`,
										borderRight: `1px solid #000000`
									}}
								>
									{item.penerima}
								</Text>
								<Text
									style={{
										width: `450px`,
										fontSize: `8px`,
										textAlign: `left`,
										paddingTop: `10px`,
										paddingRight: `10px`,
										paddingBottom: `10px`,
										paddingLeft: `3px`,
										borderRight: `1px solid #000000`
									}}
								>
									{item.nomor_ttb}
								</Text>
								<Text
									style={{
										width: `355px`,
										fontSize: `8px`,
										textAlign: `left`,
										padding: `10px`,
										borderRight: `1px solid #000000`
									}}
								>
									{item.koli}
								</Text>
								<Text
									style={{
										width: `250px`,
										fontSize: `8px`,
										textAlign: `left`,
										padding: `10px`,
										borderRight: `1px solid #000000`
									}}
								>
									{item.volume}
								</Text>
								<Text
									style={{
										width: `415px`,
										fontSize: `8px`,
										textAlign: `left`,
										padding: `10px`
									}}
								>
									{item.nama_barang}
								</Text>
							</View>
						))}
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
