import { gql } from "apollo-server-micro"

export const types = gql`
	type daftar_muat_barang {
		id: Int
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
		tanggal_muat_barang: String
		nama_barang: String
		volume: String
		koli: String
		satuan: String
	}

	type daftar_muat_barang {
		daftar_muat_barang: [daftar_muat_barang!]
	}

	input CreateDaftar_muat_barangInput {
		id: Int
		nomor_muat_barang: String
		nomor_ttb: String
		total_ttb: String
		total_koli: String
		pengirim: String
		penerima: String
		kota_tujuan: String
		total_volume: String
		nomor_kendaraan: String
		tanggal_muat_barang: String
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

	input UpdateDaftar_muat_barangInput {
		id: Int
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
		tanggal_muat_barang: String
		estimated_date: String
		posisi: String
		nomor_container: String
		nomor_seal: String
		tanggal_masuk: String
		nama_barang: String
		volume: String
		koli: String
		satuan: String
	}

	type MutateDaftar_muat_barangResponse {
		code: String!
		success: Boolean!
		message: String!
		daftar_muat_barang: [daftar_muat_barang!]
	}
`
