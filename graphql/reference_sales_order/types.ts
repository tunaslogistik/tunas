import { gql } from "apollo-server-micro"

export const types = gql`
	type reference_sales_order {
		id: Int
		kode_tujuan: String
		kota_tujuan: String
		tanggal_tahun: String
		bulan_tahun: String
		increment: Int
	}

	type reference_sales_order_by_id {
		id: Int
		kode_tujuan: String
		kota_tujuan: String
		tanggal_tahun: String
		bulan_tahun: String
		increment: Int
	}

	type reference_sales_order {
		reference_sales_order: [reference_sales_order!]
	}

	input CreateReference_sales_orderInput {
		id: Int
		kode_tujuan: String
		kota_tujuan: String
		tanggal_tahun: String
		bulan_tahun: String
		increment: Int
	}

	input UpdateReference_sales_orderInput {
		id: Int
		kode_tujuan: String
		kota_tujuan: String
		tanggal_tahun: String
		bulan_tahun: String
		increment: Int
	}

	type MutateReference_sales_orderResponse {
		code: String!
		success: Boolean!
		message: String!
		reference_sales_order: [reference_sales_order!]
	}
`
