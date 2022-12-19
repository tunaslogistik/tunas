import { gql } from "apollo-server-micro"

export const GET_REFERENCE_SALES_ORDER = gql`
	query reference_sales_order {
		reference_sales_order {
			id
			kode_tujuan
			kota_tujuan
			tanggal_tahun
			bulan_tahun
			increment
		}
	}
`
//export by reference_sales_order id
export const GET_REFERENCE_SALES_ORDER_BY_ID = gql`
	query reference_sales_order_by_id($id: Int) {
		reference_sales_order_by_id(id: $id) {
			id
			kode_tujuan
			kota_tujuan
			tanggal_tahun
			bulan_tahun
			increment
		}
	}
`
