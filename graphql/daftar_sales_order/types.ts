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
		rekening: String
		total_tagihan: Int
		harga_sesudah_ppn: Int
		dp: Int
		tanggal_sales_order: String
		term_payment: String
		nama_barang: String
		tipe_ppn: String
		itemNo: String
		harga_satuan: String
		harga_total: Int
		total_harga_ttb: Int
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
		rekening: String
		harga: Int
		dp: Int
		total_tagihan: Int
		harga_sesudah_ppn: Int
		kota_tujuan: String
		tanggal_sales_order: String
		term_payment: String
		nama_barang: String
		tipe_ppn: String
		itemNo: String
		harga_satuan: String
		harga_total: Int
		total_harga_ttb: Int
	}

	input UpdateDaftar_sales_orderInput {
		id: Int
		nomor_ttb: String
		nomor_sales_order: String
		total_volume: Int
		kota_tujuan: String
		pengirim: String
		rekening: String
		harga: Int
		harga_sesudah_ppn: Int
		dp: Int
		total_tagihan: Int
		tanggal_sales_order: String
		term_payment: String
		tipe_ppn: String
		nama_barang: String
		itemNo: String
		harga_satuan: String
		harga_total: Int
		total_harga_ttb: Int
	}

	type MutateDaftar_sales_orderResponse {
		code: String!
		success: Boolean!
		message: String!
		daftar_sales_order: [daftar_sales_order!]
	}
`
