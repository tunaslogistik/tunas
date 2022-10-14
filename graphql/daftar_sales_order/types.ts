import { gql } from "apollo-server-micro"

export const types = gql`
	type daftar_sales_order {
		id: Int
		nomor_ttb: String
		nomor_sales_order: String
		total_volume: Int
		harga: Int
		pengirim: String
		kota_tujuan: String
		total_tagihan: Int
		dp: Int
		tanggal_sales_order: String
		term_payment: String
	}

	type daftar_sales_order {
		daftar_sales_order: [daftar_sales_order!]
	}

	input CreateDaftar_sales_orderInput {
		id: Int
		nomor_ttb: String
		nomor_sales_order: String
		total_volume: Int
		pengirim: String
		harga: Int
		dp: Int
		total_tagihan: Int
		kota_tujuan: String
		tanggal_sales_order: String
		term_payment: String
	}

	input UpdateDaftar_sales_orderInput {
		id: Int
		nomor_ttb: String
		nomor_sales_order: String
		total_volume: Int
		kota_tujuan: String
		pengirim: String
		harga: Int
		dp: Int
		total_tagihan: Int
		tanggal_sales_order: String
		term_payment: String
	}

	type MutateDaftar_sales_orderResponse {
		code: String!
		success: Boolean!
		message: String!
		daftar_sales_order: [daftar_sales_order!]
	}
`
