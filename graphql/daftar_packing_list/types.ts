import { gql } from "apollo-server-micro"

export const types = gql`
	type daftar_packing_list {
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

	type daftar_packing_list {
		daftar_packing_list: [daftar_packing_list!]
	}

	input CreateDaftar_packing_listInput {
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
		estimated_date: String
		nomor_seal: String
		tanggal_masuk: String
		nama_barang: String
		volume: String
		koli: String
		satuan: String
	}

	type MutateDaftar_packing_listResponse {
		code: String!
		success: Boolean!
		message: String!
		daftar_packing_list: [daftar_packing_list!]
	}
`
