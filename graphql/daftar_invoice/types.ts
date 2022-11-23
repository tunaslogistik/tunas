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
		tanggal_keberangkatan: String
		keterangan: String
		nomor_container: String
		nomor_seal: String
		nama_barang: String
		harga: String
		harga_biaya_tambahan: String
		ppn_biaya_tambahan: String
		acurrate: String
		pengirim: String
		total_tagihan: String
	}

	type MutateDaftar_invoiceResponse {
		code: String!
		success: Boolean!
		message: String!
		daftar_invoice: [daftar_invoice!]
	}
`
