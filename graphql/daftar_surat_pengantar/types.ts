import { gql } from "apollo-server-micro"

export const types = gql`
	type daftar_surat_pengantar {
		id: Int
		nomor_surat_jalan: String
		nomor_muat_barang: String
		nomor_ttb: String
		total_ttb: String
		total_koli: String
		pengirim: String
		penerima: String
		kota_tujuan: String
		total_volume: String
		nomor_kendaraan: String
		vendor_pelayanan: String
		posisi: String
		nomor_container: String
		nomor_seal: String
		estimated_date: String
		tanggal_masuk: String
		nama_barang: String
		volume: String
		koli: String
		satuan: String
	}

	type daftar_surat_pengantar {
		daftar_surat_pengantar: [daftar_surat_pengantar!]
	}

	input CreateDaftar_surat_pengantarInput {
		id: Int
		nomor_surat_jalan: String
		nomor_muat_barang: String
		nomor_ttb: String
		total_ttb: String
		total_koli: String
		pengirim: String
		penerima: String
		kota_tujuan: String
		total_volume: String
		nomor_kendaraan: String
		vendor_pelayanan: String
		posisi: String
		nomor_container: String
		estimated_date: String
		nomor_seal: String
		tanggal_masuk: String
		nama_barang: String
		volume: String
		koli: String
		satuan: String
	}

	input UpdateDaftar_surat_pengantarInput {
		id: Int
		nomor_surat_jalan: String
		nomor_muat_barang: String
		nomor_ttb: String
		total_ttb: String
		total_koli: String
		kota_tujuan: String
		pengirim: String
		penerima: String
		total_volume: String
		nomor_kendaraan: String
		vendor_pelayanan: String
		posisi: String
		estimated_date: String
		nomor_container: String
		nomor_seal: String
		tanggal_masuk: String
		nama_barang: String
		volume: String
		koli: String
		satuan: String
	}

	type MutateDaftar_surat_pengantarResponse {
		code: String!
		success: Boolean!
		message: String!
		daftar_surat_pengantar: [daftar_surat_pengantar!]
	}
`
