import { Pie } from "@ant-design/plots"
import { useQuery } from "@apollo/client"
import AdminPage from "@components/admin/AdminPage.component"
import Dashboard from "@components/dashboard/Dashboard.component"
import { GET_DAFTAR_MUAT_BARANG } from "graphql/daftar_muat_barang/queries"
import { GET_DAFTAR_SALES_ORDER } from "graphql/daftar_sales_order/queries"
import { GET_DAFTAR_SURAT_JALAN } from "graphql/daftar_surat_jalan/queries"
import { GET_DAFTAR_TTB } from "graphql/daftar_ttb/queries"
import Card from "react-bootstrap/Card"
import { useForm } from "react-hook-form"

export default function Home() {
	const { data } = useQuery(GET_DAFTAR_TTB)
	const { data: dataSalesOrder } = useQuery(GET_DAFTAR_SALES_ORDER)
	const { data: dataMuatBarang } = useQuery(GET_DAFTAR_MUAT_BARANG)
	const { data: dataSuratJalan } = useQuery(GET_DAFTAR_SURAT_JALAN)
	const setForm = useForm()

	//make pie chart
	const config = {
		appendPadding: 5,
		data: [
			{ type: `Sales Order`, value: dataSalesOrder?.daftar_sales_order.length },
			{ type: `TTB`, value: data?.daftar_ttb.length },
			{ type: `Surat Jalan`, value: dataSuratJalan?.daftar_surat_jalan.length },
			{ type: `Muat Barang`, value: dataMuatBarang?.daftar_muat_barang.length }
		],
		angleField: `value`,
		colorField: `type`,
		radius: 0.8,
		label: {
			type: `inner`,
			offset: `-30%`,
			content: `{value}`,
			style: {
				textAlign: `center`,
				fontSize: 14
			}
		},
		interactions: [{ type: `element-selected` }, { type: `element-active` }]
	}

	return (
		<AdminPage setForm={setForm} authId="home" title="" legend="">
			<section className="section">
				<div className="admin-section">
					<div className="admin-section-head" style={{ marginLeft: `40%` }}>
						<h2>Dashboard</h2>
					</div>
					<div className="admin-section-body">
						<div className="row" style={{ display: `inline-block` }}>
							<Card
								style={{
									width: `18rem`,
									height: `8rem`,
									boxShadow: `0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)`
								}}
							>
								<Card.Body>
									<Card.Title
										style={{
											paddingTop: `1rem`,
											fontSize: `20px`,
											fontWeight: `bold`,
											textAlign: `center`
										}}
									>
										Total TTB
									</Card.Title>
									<Card.Text
										style={{
											fontWeight: `bold`,
											fontSize: `34px`,
											textAlign: `center`
										}}
									>
										{data?.daftar_ttb.length}
									</Card.Text>
								</Card.Body>
							</Card>
						</div>
						<div
							className="row"
							style={{ display: `inline-block`, marginLeft: `3%` }}
						>
							<Card
								style={{
									width: `18rem`,
									height: `8rem`,
									boxShadow: `0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)`
								}}
							>
								<Card.Body>
									<Card.Title
										style={{
											paddingTop: `1rem`,
											fontSize: `20px`,
											fontWeight: `bold`,
											textAlign: `center`
										}}
									>
										Total Sales Order
									</Card.Title>
									<Card.Text
										style={{
											fontWeight: `bold`,
											fontSize: `34px`,
											textAlign: `center`
										}}
									>
										{dataSalesOrder?.daftar_sales_order.length}
									</Card.Text>
								</Card.Body>
							</Card>
						</div>
						<div
							className="row"
							style={{ display: `inline-block`, marginLeft: `3%` }}
						>
							<Card
								style={{
									width: `18rem`,
									height: `8rem`,
									boxShadow: `0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)`
								}}
							>
								<Card.Body>
									<Card.Title
										style={{
											paddingTop: `1rem`,
											fontSize: `20px`,
											fontWeight: `bold`,
											textAlign: `center`
										}}
									>
										Total Muat Barang
									</Card.Title>
									<Card.Text
										style={{
											fontWeight: `bold`,
											fontSize: `34px`,
											textAlign: `center`
										}}
									>
										{dataMuatBarang?.daftar_muat_barang.length}
									</Card.Text>
								</Card.Body>
							</Card>
						</div>
						<div
							className="row"
							style={{ display: `inline-block`, marginLeft: `3%` }}
						>
							<Card
								style={{
									width: `18rem`,
									height: `8rem`,
									boxShadow: `0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)`
								}}
							>
								<Card.Body>
									<Card.Title
										style={{
											paddingTop: `1rem`,
											fontSize: `20px`,
											fontWeight: `bold`,
											textAlign: `center`
										}}
									>
										Total Surat Jalan
									</Card.Title>
									<Card.Text
										style={{
											fontWeight: `bold`,
											fontSize: `34px`,
											textAlign: `center`
										}}
									>
										{dataSuratJalan?.daftar_surat_jalan.length}
									</Card.Text>
								</Card.Body>
							</Card>
						</div>
					</div>
					<div className="row" style={{ display: `inline-block` }}>
						<Card
							style={{
								width: `80rem`,
								height: `40rem`,
								boxShadow: `0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)`
							}}
						>
							<Card.Body>
								<Card.Title
									style={{
										paddingTop: `1rem`,
										fontSize: `20px`,
										fontWeight: `bold`,
										textAlign: `center`
									}}
								>
									Rekap Data
								</Card.Title>
								<Card.Text
									style={{
										fontWeight: `bold`,
										fontSize: `34px`,
										marginLeft: `10rem`,
										textAlign: `center`
									}}
								>
									<Pie {...config} />
								</Card.Text>
							</Card.Body>
						</Card>
					</div>
				</div>
			</section>
		</AdminPage>
	)
}

Home.getLayout = function getLayout(page) {
	return <Dashboard>{page}</Dashboard>
}
