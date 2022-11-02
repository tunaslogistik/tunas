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
import { GET_DAFTAR_SALES_ORDER } from "../../../../../graphql/daftar_sales_order/queries"
import { GET_DAFTAR_TTB } from "../../../../../graphql/daftar_ttb/queries"
import { GET_DAFTAR_TUJUAN } from "../../../../../graphql/daftar_tujuan/queries"

const GET_DATA = gql`
	query daftar_surat_jalan {
		daftar_surat_jalan {
			id
			nomor_surat_jalan
			nomor_ttb
			vendor_pelayanan
			koli
			volume
			total_koli
			nama_kapal
			total_volume
			tanggal_surat_jalan
			tanggal_keberangkatan
			nomor_container
			nomor_seal
			keterangan
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
		maxHeight: `500px`,
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
	const daftar_surat_jalan_id = data?.daftar_surat_jalan?.filter((item) => {
		return item.id === parseInt(id as string)
	})

	// get all data where nomor_surat_jalan equal to daftar_surat_jalan[0].nomor_surat_jalan
	const daftar_surat_jalan = data?.daftar_surat_jalan?.filter((item) => {
		return (
			item.nomor_surat_jalan === daftar_surat_jalan_id?.[0]?.nomor_surat_jalan
		)
	})

	//get ttb number
	const { data: dataTtb } = useQuery(GET_DAFTAR_TTB)

	//get sales order
	const { data: dataSalesOrder } = useQuery(GET_DAFTAR_SALES_ORDER)

	//get customer
	const { data: dataCustomer } = useQuery(GET_CUSTOMER)
	//get muat barang
	// const { data: dataMuatBarang } = useQuery(GET_DAFTAR_MUAT_BARANG)

	//get tujuan
	const { data: dataTujuan } = useQuery(GET_DAFTAR_TUJUAN)

	//return nomor ttb from daftar surat jalan
	const nomor_ttb = daftar_surat_jalan?.map((item) => {
		return item.nomor_ttb
	})

	console.log(`nomor ttb`, nomor_ttb)
	//filter data by ttb number in nomor_ttb daftar_surat_jalan
	const datadaftarTTB = dataTtb?.daftar_ttb?.filter((item) => {
		return nomor_ttb?.includes(item.ttb_number)
	})

	//datadaftarTTB map
	const dataTTB = datadaftarTTB?.map((item) => {
		return {
			id: item.id,
			ttb_number: item.ttb_number,
			pengirim: item.pengirim,
			nomor_telepon: item.nomor_telepon,
			alamat_tujuan: item.alamat_tujuan,
			kode_tujuan: item.kota_tujuan,
			//find from data tujuan
			kota_tujuan: dataTujuan?.daftar_tujuan?.find((item2) => {
				return item2.kota_tujuan === item.kode_tujuan
			})?.nama_tujuan,
			panjang: item.panjang,
			lebar: item.lebar,
			volume_m3: item.total_volume,
			jenis_pengiriman: item.jenis_pengiriman,
			penerima: item.nama_penerima,
			koli: daftar_surat_jalan?.find((item2) => {
				return item2.nomor_ttb === item.ttb_number
			})?.koli,
			total_koli: daftar_surat_jalan?.find((item2) => {
				return item2.nomor_ttb === item.ttb_number
			})?.total_koli,
			total_volume: daftar_surat_jalan?.find((item2) => {
				return item2.nomor_ttb === item.ttb_number
			})?.total_volume,
			//volume = panjang * lebar * tinggi * koli from ttb
			volume: item.panjang * item.lebar * item.tinggi * item.koli,
			nama_barang: item.nama_barang,
			count: datadaftarTTB?.filter(
				(item2) => item2.nama_barang === item.nama_barang
			).length,
			nomor_so: dataSalesOrder?.daftar_sales_order?.find(
				(item2) => item2.nomor_ttb === item.ttb_number
			)?.nomor_sales_order,
			status: item.status
		}
	})
	//sum koli
	const sumKoli = dataTTB?.reduce((acc, item) => {
		return parseInt(acc) + parseInt(item.koli)
	}, 0)

	// console.log(`dataTTB`, dataTTB)

	// const muatBarang = dataMuatBarang?.daftar_muat_barang.filter(
	// 	(item) => item.nomor_ttb === dataTTB?.[0]?.ttb_number
	// )

	//filter data customer
	const dataCustomerFilter = dataCustomer?.customer.filter(
		(item) => item.nama_customer === dataTTB?.[0]?.pengirim
	)
	const MyDocument = () => (
		<Document>
			<Page style={styles.body}>
				<View style={{ flexDirection: `row` }} fixed>
					<View
						style={{
							marginTop: `40px`,
							marginLeft: `40px`,
							fontSize: `12px`,
							marginBottom: `50px`
						}}
					>
						<Text style={{ fontFamily: `Helvetica-Bold` }}>
							PT TUNAS KREASI PERKASA LOGISTIK
						</Text>
						<Text style={{ fontSize: `10px` }}>
							Telp: 6630638 (Hunting) Fax: 6630639
						</Text>
						<Text style={{ fontSize: `10px`, flex: 1 }}>
							Email: kreasiperkasa@gmail.com
						</Text>
					</View>
					<View
						style={{
							marginTop: `40px`,
							marginLeft: `27%`
						}}
					>
						<Text
							style={{
								fontFamily: `Helvetica-Bold`
							}}
						>
							SURAT JALAN
						</Text>
						<Text
							style={{
								fontFamily: `Helvetica-Bold`,
								width: `125px`,
								textAlign: `right`,
								paddingTop: `4px`,
								fontSize: `10px`
							}}
						>
							{daftar_surat_jalan?.[0]?.nomor_surat_jalan}
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
						<Text
							style={{
								paddingTop: `2px`,
								fontSize: `10px`,
								flex: 1
							}}
						>
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
								fontStyle: `bold`,
								fontSize: `10px`,
								fontFamily: `Helvetica-Bold`
							}}
						>
							{dataTTB?.[0]?.penerima}
						</Text>
						<Text
							style={{
								fontFamily: `Helvetica-Bold`,
								paddingTop: `2px`,
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
								fontSize: `11px`,
								paddingTop: `3px`,
								borderRight: `1px solid #000000`
							}}
						>
							No.Kontainer : {`             `}
							<Text style={{ fontFamily: `Helvetica-Bold` }}>
								{daftar_surat_jalan?.[0]?.nomor_container}
							</Text>
						</Text>
						<Text>{`\n`}</Text>
						<Text>{`\n`}</Text>
						<Text
							style={{
								width: `215px`,
								fontSize: `11px`,
								paddingTop: `40px`,
								borderRight: `1px solid #000000`
							}}
						>
							No.Seal : {`                     `}
							<Text style={{ paddingTop: `4px`, fontFamily: `Helvetica-Bold` }}>
								{daftar_surat_jalan?.[0]?.nomor_seal}
							</Text>
						</Text>
						<Text>{`\n`}</Text>
						<Text>{`\n`}</Text>
						<Text
							style={{
								width: `215px`,
								fontSize: `11px`,
								padding: `100px`,
								paddingTop: `4px`,
								borderRight: `1px solid #000000`
							}}
						>
							Nama Kapal : {`              `}
							<Text style={{ fontFamily: `Helvetica-Bold` }}>
								{daftar_surat_jalan?.[0]?.nama_kapal}
							</Text>
						</Text>
						<Text>{`\n`}</Text>
						<Text>{`\n`}</Text>
						<Text
							style={{
								width: `215px`,
								fontSize: `11px`,
								padding: `10px`,
								paddingTop: `4px`,
								borderRight: `1px solid #000000`
							}}
						>
							Tgl Pengiriman : {`         `}
							<Text style={{ fontFamily: `Helvetica-Bold` }}>
								{moment(daftar_surat_jalan?.[0]?.tanggal_keberangkatan).format(
									`DD-MM-YYYY`
								)}
							</Text>
						</Text>
						<Text>{`\n`}</Text>
						<Text>{`\n`}</Text>
						<Text
							style={{
								width: `215px`,
								fontSize: `11px`,
								padding: `10px`,
								paddingTop: `4px`,
								borderRight: `1px solid #000000`
							}}
						>
							Tgl Keberangkatan : {`   `}
							<Text style={{ fontFamily: `Helvetica-Bold` }}>
								{moment(dataTTB?.[0]?.tanggal_diterima).format(`DD-MM-YYYY`)}
							</Text>
						</Text>
						<Text>{`\n`}</Text>
						<Text>{`\n`}</Text>
						<Text
							style={{
								width: `215px`,
								fontSize: `11px`,
								padding: `10px`,
								paddingTop: `4px`,
								borderRight: `1px solid #000000`
							}}
						>
							Tujuan : {`                       `}
							<Text style={{ fontFamily: `Helvetica-Bold` }}>
								{dataTTB?.[0]?.kota_tujuan}
							</Text>
						</Text>
					</Text>
					<View style={styles.tblHeader}>
						<Text
							style={{
								width: `255px`,
								fontSize: `10px`,
								textAlign: `left`,
								padding: `10px`,
								fontFamily: `Helvetica-Bold`,
								borderRight: `1px solid #000000`
							}}
						>
							NAMA BARANG
						</Text>
						<Text
							style={{
								width: `215px`,
								fontSize: `10px`,
								textAlign: `center`,
								padding: `10px`,
								fontFamily: `Helvetica-Bold`,
								borderRight: `1px solid #000000`
							}}
						>
							NO. TTB
						</Text>
						<Text
							style={{
								width: `215px`,
								fontSize: `10px`,
								textAlign: `center`,
								padding: `10px`,
								fontFamily: `Helvetica-Bold`,
								borderRight: `1px solid #000000`
							}}
						>
							NO. SO
						</Text>
						<Text
							style={{
								width: `100px`,
								fontSize: `10px`,
								textAlign: `center`,
								fontFamily: `Helvetica-Bold`,
								padding: `10px`,
								borderRight: `1px solid #000000`
							}}
						>
							KOLI
						</Text>
						<Text
							style={{
								width: `100px`,
								fontSize: `9px`,
								textAlign: `center`,
								fontFamily: `Helvetica-Bold`,
								padding: `10px`
							}}
						>
							VOL M³
						</Text>
					</View>
					<View style={styles.tblBody}>
						{dataTTB?.map((item, index) => (
							<View style={styles.tblRow} key={index}>
								<Text
									style={{
										width: `255px`,
										fontSize: `10px`,
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
										fontSize: `10px`,
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
										fontSize: `10px`,
										textAlign: `center`,
										padding: `10px`,
										borderRight: `1px solid #000000`
									}}
								>
									{item.nomor_so}
								</Text>
								<Text
									style={{
										width: `100px`,
										fontSize: `10px`,
										textAlign: `right`,
										padding: `10px`,
										borderRight: `1px solid #000000`
									}}
								>
									{item.koli}
								</Text>
								<Text
									style={{
										width: `100px`,
										fontSize: `10px`,
										textAlign: `right`,
										padding: `10px`
									}}
								>
									{item.volume}
								</Text>
							</View>
						))}
						<View style={styles.tblRow2} key="">
							<Text
								style={{
									width: `400px`,
									fontSize: `11px`,
									textAlign: `center`,
									borderRight: `1px solid #000000`
								}}
							>
								{}
							</Text>
							<Text
								style={{
									width: `103px`,
									fontSize: `11px`,
									textAlign: `center`,
									padding: `10px`,
									fontFamily: `Helvetica-Bold`
								}}
							>
								Total
							</Text>
							<Text style={styles.tableText2}></Text>
							<Text
								style={{
									width: `85px`,
									padding: `10px`,
									fontSize: `11px`,
									textAlign: `right`,
									fontFamily: `Helvetica-Bold`,
									borderRight: `1px solid #000000`
								}}
							>
								{sumKoli}
							</Text>
							<Text
								style={{
									width: `85px`,
									padding: `10px`,
									fontSize: `11px`,
									textAlign: `right`,
									fontFamily: `Helvetica-Bold`
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
							fontSize: `12px`,
							width: `300px`
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
								marginTop: `15px`,
								marginLeft: `130px`
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
			<div className="section">
				<PDFViewer width="2000" height="1000">
					<MyDocument />
				</PDFViewer>
			</div>
		</AdminPage>
	)
}

Home.getLayout = function getLayout(page) {
	return <Dashboard>{page}</Dashboard>
}
