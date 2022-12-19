import { gql } from "apollo-server-micro"

export const types = gql`
	type daftar_invoice {
		id: Int
		nomor_invoice: String
		nomor_surat_jalan: String
		koli: String
		volume: String
		total_koli: String
		total_volume: String
		nomor_ttb: String
		vendor_pelayanan: String
		tanggal_invoice: String
		nama_kapal: String
		harga_surat_jalan: String
		tanggal_keberangkatan: String
		keterangan: String
		nomor_container: String
		nomor_seal: String
		nama_barang: String
		harga: String
		harga_biaya_tambahan: String
		ppn_biaya_tambahan: String
		accurate: String
		pengirim: String
		total_tagihan: String
		tax: String
		subtotal: String
		jenis_biaya_tambahan: String
		id_biaya_tambahan: String
		id_biaya_utama: String
		subtotal_tambahan: String
		biaya_tambahan_sales: String
		itemNo_sales_order: String
		biaya_tambahan_join: String
		itemNo_join: String
		nama_barang_join: String
		kota_tujuan: String
	}

	type daftar_invoice {
		daftar_invoice: [daftar_invoice!]
	}

	input CreateDaftar_invoiceInput {
		id: Int
		nomor_invoice: String
		nomor_surat_jalan: String
		nomor_ttb: String
		koli: String
		volume: String
		total_koli: String
		total_volume: String
		vendor_pelayanan: String
		harga_surat_jalan: String
		nama_kapal: String
		tanggal_invoice: String
		tanggal_keberangkatan: String
		keterangan: String
		nomor_container: String
		nomor_seal: String
		nama_barang: String
		harga: String
		harga_biaya_tambahan: String
		ppn_biaya_tambahan: String
		accurate: String
		pengirim: String
		total_tagihan: String
		tax: String
		jenis_biaya_tambahan: String
		id_biaya_tambahan: String
		id_biaya_utama: String
		subtotal: String
		subtotal_tambahan: String
		biaya_tambahan_sales: String
		itemNo_sales_order: String
		biaya_tambahan_join: String
		itemNo_join: String
		nama_barang_join: String
		kota_tujuan: String
	}

	input UpdateDaftar_invoiceInput {
		id: Int
		nomor_invoice: String
		nomor_surat_jalan: String
		nomor_ttb: String
		koli: String
		volume: String
		total_koli: String
		total_volume: String
		vendor_pelayanan: String
		nama_kapal: String
		tanggal_invoice: String
		harga_surat_jalan: String
		tanggal_keberangkatan: String
		keterangan: String
		nomor_container: String
		nomor_seal: String
		nama_barang: String
		harga: String
		harga_biaya_tambahan: String
		ppn_biaya_tambahan: String
		accurate: String
		pengirim: String
		total_tagihan: String
		tax: String
		jenis_biaya_tambahan: String
		id_biaya_tambahan: String
		id_biaya_utama: String
		subtotal: String
		subtotal_tambahan: String
		biaya_tambahan_sales: String
		itemNo_sales_order: String
		biaya_tambahan_join: String
		itemNo_join: String
		nama_barang_join: String
		kota_tujuan: String
	}

	type MutateDaftar_invoiceResponse {
		code: String!
		success: Boolean!
		message: String!
		daftar_invoice: [daftar_invoice!]
	}
`
