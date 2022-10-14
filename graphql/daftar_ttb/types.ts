import { gql } from "apollo-server-micro"

export const types = gql`
	type daftar_ttb {
		id: Int
		ttb_number: String
		pengirim: String
		kota_tujuan: String
		tanggal_diterima: String
		nama_penerima: String
		jenis_pengiriman: String
		total_volume: Int
		nomor_telepon: String
		nama_barang: String
		panjang: Int
		lebar: Int
		tinggi: Int
		koli: Int
		alamat_tujuan: String
		status: String
		kategori: String
		full_container: String
	}

	type daftar_ttb {
		daftar_ttb: [daftar_ttb!]
	}

	input CreateDaftar_ttbInput {
		id: Int
		ttb_number: String
		pengirim: String
		kota_tujuan: String
		tanggal_diterima: String
		nama_penerima: String
		jenis_pengiriman: String
		nomor_telepon: String
		total_volume: Int
		nama_barang: String
		panjang: Int
		lebar: Int
		tinggi: Int
		koli: Int
		alamat_tujuan: String
		status: String
		kategori: String
		full_container: String
	}

	input UpdateDaftar_ttbInput {
		id: Int
		ttb_number: String
		pengirim: String
		kota_tujuan: String
		tanggal_diterima: String
		nama_penerima: String
		jenis_pengiriman: String
		nomor_telepon: String
		total_volume: Int
		nama_barang: String
		panjang: Int
		lebar: Int
		tinggi: Int
		koli: Int
		alamat_tujuan: String
		status: String
		kategori: String
		full_container: String
	}

	type MutateDaftar_ttbResponse {
		code: String!
		success: Boolean!
		message: String!
		daftar_ttb: [daftar_ttb!]
	}
`
