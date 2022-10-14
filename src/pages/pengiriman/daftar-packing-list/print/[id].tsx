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
import { GET_DAFTAR_MUAT_BARANG } from "graphql/daftar_muat_barang/queries"
import { GET_DAFTAR_SURAT_JALAN } from "graphql/daftar_surat_jalan/queries"
import { GET_DAFTAR_TUJUAN } from "graphql/daftar_tujuan/queries"
import moment from "moment"
import { useRouter } from "next/router"
import { useRef } from "react"
import { useForm } from "react-hook-form"
import { GET_CUSTOMER } from "../../../../../graphql/customer/queries"
import { GET_DAFTAR_SALES_ORDER } from "../../../../../graphql/daftar_sales_order/queries"
import { GET_DAFTAR_TTB } from "../../../../../graphql/daftar_ttb/queries"

const GET_DATA = gql`
	query daftar_packing_list {
		daftar_packing_list {
			id
			nomor_muat_barang
			nomor_ttb
			total_ttb
			total_koli
			koli
			pengirim
			kota_tujuan
			total_volume
			nomor_kendaraan
			vendor_pelayanan
			posisi
			nomor_container
			nomor_seal
			estimated_date
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
		paddingBottom: 84
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
		borderRight: `1px solid black`,
		borderLeft: `1px solid black`,
		borderTop: `1px solid black`,
		marginRight: `40px`
	},
	tblHeading: {
		marginTop: `12px`,
		marginLeft: `12px`,
		marginBottom: `12px`,
		fontSize: `8px`
	},
	tblHeaders: {
		display: `flex`,
		flexDirection: `row`,
		justifyContent: `space-between`,
		borderBottom: `1px solid #000000`
	},
	tblHeader: {
		display: `flex`,
		flexDirection: `row`,
		justifyContent: `space-between`
	},
	tblHeader2: {
		display: `flex`,
		flexDirection: `row`,
		backgroundColor: `#E4E4E4`,
		justifyContent: `space-between`,
		borderTop: `1px solid #000000`
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

	const componentRef = useRef()
	const setForm = useForm()
	const router = useRouter()
	const id = router.query.id
	// GET DATA ttb number where id eqaul to id
	const daftar_packing_list = data?.daftar_packing_list.find(
		(item) => item.id === parseInt(id as string)
	)
	// GET DAFTAR MUAT BARANG
	const { data: dataMuatBarang } = useQuery(GET_DAFTAR_MUAT_BARANG)

	//get daftar_packing_list nomor muat barang
	const nomor_muat_barang = daftar_packing_list?.nomor_muat_barang

	//get all data where equal nomor muat barang equal to nomor muat barang
	const data_packing_list = data?.daftar_packing_list.filter(
		(item) => item.nomor_muat_barang === nomor_muat_barang
	)
	//get ttb number
	const { data: dataTtb } = useQuery(GET_DAFTAR_TTB)

	//get sales order
	const { data: dataSalesOrder } = useQuery(GET_DAFTAR_SALES_ORDER)

	//get customer
	const { data: dataCustomer } = useQuery(GET_CUSTOMER)

	//get daftar tujuan
	const { data: dataTujuan } = useQuery(GET_DAFTAR_TUJUAN)

	//get daftar SURAT JALAN
	const { data: dataSuratJalan } = useQuery(GET_DAFTAR_SURAT_JALAN)

	//loop to filter datattb by all daftar_packing_list
	const datadaftarTTB = dataTtb?.daftar_ttb.filter((item) =>
		data_packing_list?.map((item) => item.nomor_ttb).includes(item.ttb_number)
	)
	//datadaftarTTB map
	const dataTTB = datadaftarTTB?.map((item) => {
		return {
			id: item.id,
			ttb_number: item.ttb_number,
			pengirim: item.pengirim,
			nomor_telepon: item.nomor_telepon,
			koli: item.koli,
			alamat_tujuan: item.alamat_tujuan,
			tanggal_diterima: moment(item.tanggal_diterima).format(`YYYY-MM-DD`),
			kota_tujuan: dataTujuan?.daftar_tujuan.find(
				(item2) => item2.kode_tujuan === item.kota_tujuan
			)?.nama_tujuan,
			volume_m3: item.total_volume,
			jenis_pengiriman: item.jenis_pengiriman,
			nama_penerima: item.nama_penerima,
			nama_barang: item.nama_barang,
			count: datadaftarTTB?.filter(
				(item2) => item2.nama_barang === item.nama_barang
			).length,
			nomor_so: dataSalesOrder?.daftar_sales_order?.find(
				(item2) => item2.nomor_ttb === item.ttb_number
			)?.nomor_sales_order,
			nama_kapal: dataSuratJalan?.daftar_surat_jalan?.find(
				(item2) => item2.nomor_ttb === item.ttb_number
			)?.nama_kapal,
			nomor_container: dataMuatBarang?.daftar_muat_barang?.find(
				(item2) => item2.nomor_ttb === item.ttb_number
			)?.nomor_container,
			nomor_seal: dataMuatBarang?.daftar_muat_barang?.find(
				(item2) => item2.nomor_ttb === item.ttb_number
			)?.nomor_seal,
			status: item.status,
			estimated_date: daftar_packing_list?.estimated_date
		}
	})

	console.log(`da`, dataTTB)

	//sum count
	const sumCount = dataTTB?.reduce((acc, item) => {
		return acc + item.count
	}, 0)

	console.log(`dataTTB`, data_packing_list)

	//filter data by sales order by nomor_sales_order ttb
	const salesOrder = dataSalesOrder?.daftar_sales_order.filter(
		(item) => item.nomor_ttb === dataTTB?.[0]?.ttb_number
	)

	//filter data customer
	const dataCustomerFilter = dataCustomer?.customer.filter(
		(item) => item.nama_customer === dataTTB?.[0]?.pengirim
	)

	const nomor_packing_list = daftar_packing_list?.nomor_muat_barang.slice(3)
	//add 4 letter to nomor_surat_jalan
	const nomor_surat_jalan2 = `PL-${nomor_packing_list}`

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
							marginLeft: `166px`
						}}
					>
						<Text
							style={{
								fontFamily: `Helvetica-Bold`
							}}
						>
							PACKING LIST
						</Text>
						<Text
							style={{
								fontFamily: `Helvetica-Bold`,
								marginLeft: `35px`,
								paddingTop: `2px`,
								fontSize: `10px`
							}}
						>
							{nomor_surat_jalan2}
						</Text>
					</View>
				</View>
				<View
					style={{
						flexDirection: `row`,
						border: `1px solid #000000`,
						marginTop: `40px`,
						marginLeft: `40px`,
						marginRight: `40px`
					}}
				>
					<View style={{ padding: `10px` }}>
						<Text
							style={{
								fontSize: `10px`,
								fontFamily: `Helvetica-Bold`
							}}
						>
							APABILA ALAMAT YANG TERTERA DI PACKING LIST KELUAR KOTA SURABAYA,
							MOHON BANTUANNYA UNTUK KONFIRMASI DULU KE TKP/JKT.
						</Text>
					</View>
				</View>
				<View style={styles.table}>
					<View style={styles.tblHeaders}>
						<Text
							style={{
								width: `215px`,
								fontSize: `10px`,
								textAlign: `left`,
								fontFamily: `Helvetica-Bold`,
								padding: `10px`,
								borderRight: `1px solid #000000`
							}}
						>
							{dataTTB?.[0]?.nama_kapal}
						</Text>
						<View
							style={{
								borderRight: `1px solid #000000`,
								flexDirection: `column`,
								width: `430px`,
								fontFamily: `Helvetica-Bold`,
								fontSize: `10px`,
								textAlign: `center`
							}}
						>
							<Text
								style={{ padding: `5px`, borderBottom: `1px solid #000000` }}
							>{`ETD ${moment(dataTTB?.[0]?.estimated_date).format(
								`DD/MM/YYYY`
							)}`}</Text>
							<Text style={{ padding: `5px` }}>
								{dataTTB?.[0]?.kota_tujuan}
							</Text>
						</View>
						<Text
							style={{
								width: `150px`,
								fontSize: `10px`,
								textAlign: `center`,
								fontFamily: `Helvetica-Bold`,
								padding: `10px`,
								paddingRight: `15px`,
								paddingLeft: `15px`,
								borderRight: `1px solid #000000`
							}}
						>
							ETA SANDAR
						</Text>
						<Text
							style={{
								width: `150px`,
								fontSize: `10px`,
								fontFamily: `Helvetica-Bold`,
								textAlign: `center`,
								padding: `10px`,
								borderRight: `1px solid #000000`
							}}
						>
							TGL DOORING
						</Text>
						<Text
							style={{
								width: `100px`,
								fontSize: `10px`,
								fontFamily: `Helvetica-Bold`,
								textAlign: `center`,
								padding: `10px`
							}}
						>
							KET
						</Text>
					</View>
					<View style={styles.tblHeader}>
						<Text
							style={{
								width: `215px`,
								fontSize: `10px`,
								textAlign: `center`,
								fontFamily: `Helvetica-Bold`,
								padding: `10px`,
								borderRight: `1px solid #000000`
							}}
						>
							Penerima / Alamat
						</Text>
						<Text
							style={{
								width: `115px`,
								fontSize: `10px`,
								fontFamily: `Helvetica-Bold`,
								textAlign: `center`,
								padding: `10px`,
								borderRight: `1px solid #000000`
							}}
						>
							QTY
						</Text>
						<Text
							style={{
								width: `315px`,
								fontSize: `10px`,
								fontFamily: `Helvetica-Bold`,
								textAlign: `left`,
								padding: `10px`,
								borderRight: `1px solid #000000`
							}}
						>
							Barang
						</Text>
						<Text
							style={{
								width: `150px`,
								fontSize: `10px`,
								textAlign: `center`,
								padding: `10px`,
								borderRight: `1px solid #000000`
							}}
						></Text>
						<Text
							style={{
								width: `150px`,
								fontSize: `10px`,
								textAlign: `center`,
								padding: `10px`,
								borderRight: `1px solid #000000`
							}}
						></Text>
						<Text
							style={{
								width: `100px`,
								fontSize: `10px`,
								textAlign: `center`,
								padding: `10px`
							}}
						></Text>
					</View>
					<View style={styles.tblHeader2}>
						<Text
							style={{
								width: `215px`,
								fontSize: `10px`,
								fontFamily: `Helvetica-Bold`,
								textAlign: `left`,
								padding: `10px`
							}}
						>
							{`${dataTTB?.[0]?.nomor_container} / ${dataTTB?.[0]?.nomor_seal}`}
						</Text>
						<Text
							style={{
								width: `215px`,
								fontSize: `10px`,
								textAlign: `center`,
								padding: `10px`
							}}
						></Text>
						<Text
							style={{
								width: `215px`,
								fontSize: `10px`,
								textAlign: `center`,
								padding: `10px`
							}}
						></Text>
						<Text
							style={{
								width: `100px`,
								fontSize: `10px`,
								textAlign: `center`,
								padding: `10px`
							}}
						></Text>
						<Text
							style={{
								width: `100px`,
								fontSize: `10px`,
								textAlign: `center`,
								padding: `10px`
							}}
						></Text>
					</View>
					<View style={styles.tblBody}>
						{dataTTB?.map((item, index) => (
							<View style={styles.tblRow} key={index}>
								<Text
									style={{
										width: `215px`,
										fontSize: `10px`,
										fontFamily: `Helvetica-Bold`,
										textAlign: `left`,
										padding: `10px`,
										borderRight: `1px solid #000000`,
										borderBottom: `1px solid #000000`
									}}
								>
									{`${item.nama_penerima} / ${item.alamat_tujuan}`}
									{`\n`}
									<Text
										style={{
											fontSize: `8px`,
											fontFamily: `Helvetica`
										}}
									>{`T. ${item.nomor_telepon}`}</Text>
								</Text>
								<Text
									style={{
										width: `115px`,
										fontSize: `10px`,
										textAlign: `center`,
										fontFamily: `Helvetica-Bold`,
										padding: `10px`,
										borderRight: `1px solid #000000`,
										borderBottom: `1px solid #000000`
									}}
								>
									{item.koli}
								</Text>
								<Text
									style={{
										width: `315px`,
										fontSize: `10px`,
										fontFamily: `Helvetica-Bold`,
										textAlign: `left`,
										padding: `10px`,
										borderRight: `1px solid #000000`,
										borderBottom: `1px solid #000000`
									}}
								>
									{item.nama_barang}
									{`/`}
									{`\n`}
									<Text
										style={{
											fontSize: `8px`,
											fontFamily: `Helvetica`
										}}
									>{`${item.ttb_number?.slice(4)}/`}</Text>
									{`\n`}
									<Text
										style={{
											fontSize: `8px`,
											fontFamily: `Helvetica`
										}}
									>{`P. ${item.tanggal_diterima}`}</Text>
								</Text>
								<Text
									style={{
										width: `150px`,
										fontSize: `10px`,
										textAlign: `left`,
										padding: `10px`,
										borderRight: `1px solid #000000`,
										borderBottom: `1px solid #000000`
									}}
								></Text>
								<Text
									style={{
										width: `150px`,
										fontSize: `10px`,
										textAlign: `left`,
										padding: `10px`,
										borderRight: `1px solid #000000`,
										borderBottom: `1px solid #000000`
									}}
								></Text>
								<Text
									style={{
										width: `100px`,
										fontSize: `10px`,
										textAlign: `left`,
										padding: `10px`,
										borderBottom: `1px solid #000000`
									}}
								></Text>
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
