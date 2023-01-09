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
		total_volume: String
		nomor_telepon: String
		nama_barang: String
		container_size: String
		panjang: String
		lebar: String
		tinggi: String
		koli: String
		alamat_tujuan: String
		status: String
		kategori: String
		full_container: String
		pembayar: String
		ppn: String
		accurate: String
		biaya_tambahan: String
		biaya_tambahan_non_ppn: String
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
		total_volume: String
		nama_barang: String
		panjang: String
		lebar: String
		tinggi: String
		koli: String
		container_size: String
		alamat_tujuan: String
		status: String
		kategori: String
		full_container: String
		pembayar: String
		ppn: String
		accurate: String
		biaya_tambahan: String
		biaya_tambahan_non_ppn: String
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
		total_volume: String
		nama_barang: String
		container_size: String
		panjang: String
		lebar: String
		tinggi: String
		koli: String
		alamat_tujuan: String
		status: String
		kategori: String
		full_container: String
		pembayar: String
		ppn: String
		accurate: String
		biaya_tambahan: String
		biaya_tambahan_non_ppn: String
	}

	type MutateDaftar_ttbResponse {
		code: String!
		success: Boolean!
		message: String!
		daftar_ttb: [daftar_ttb!]
	}
`
