import { gql } from "apollo-server-micro"

export const types = gql`
	type daftar_surat_jalan {
		id: Int
		nomor_surat_jalan: String
		koli: String
		volume: String
		total_koli: String
		total_volume: String
		nomor_ttb: String
		vendor_pelayanan: String
		tanggal_surat_jalan: String
		nama_kapal: String
		tanggal_keberangkatan: String
		keterangan: String
		nomor_container: String
		nomor_seal: String
	}

	type daftar_surat_jalan {
		daftar_surat_jalan: [daftar_surat_jalan!]
	}

	input CreateDaftar_surat_jalanInput {
		id: Int
		nomor_surat_jalan: String
		nomor_ttb: String
		koli: String
		volume: String
		total_koli: String
		total_volume: String
		vendor_pelayanan: String
		nama_kapal: String
		tanggal_surat_jalan: String
		tanggal_keberangkatan: String
		keterangan: String
		nomor_container: String
		nomor_seal: String
	}

	input UpdateDaftar_surat_jalanInput {
		id: Int
		nomor_surat_jalan: String
		nomor_ttb: String
		koli: String
		volume: String
		total_koli: String
		total_volume: String
		vendor_pelayanan: String
		nama_kapal: String
		tanggal_surat_jalan: String
		tanggal_keberangkatan: String
		keterangan: String
		nomor_container: String
		nomor_seal: String
	}

	type MutateDaftar_surat_jalanResponse {
		code: String!
		success: Boolean!
		message: String!
		daftar_surat_jalan: [daftar_surat_jalan!]
	}
`
