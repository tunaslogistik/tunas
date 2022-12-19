import { gql } from "apollo-server-micro"

export const types = gql`
	type reference_surat_pengantar {
		id: Int
		kode_tujuan: String
		kota_tujuan: String
		tanggal_tahun: String
		bulan_tahun: String
		increment: Int
	}

	type reference_surat_pengantar_by_id {
		id: Int
		kode_tujuan: String
		kota_tujuan: String
		tanggal_tahun: String
		bulan_tahun: String
		increment: Int
	}

	type reference_surat_pengantar {
		reference_surat_pengantar: [reference_surat_pengantar!]
	}

	input CreateReference_surat_pengantarInput {
		id: Int
		kode_tujuan: String
		kota_tujuan: String
		tanggal_tahun: String
		bulan_tahun: String
		increment: Int
	}

	input UpdateReference_surat_pengantarInput {
		id: Int
		kode_tujuan: String
		kota_tujuan: String
		tanggal_tahun: String
		bulan_tahun: String
		increment: Int
	}

	type MutateReference_surat_pengantarResponse {
		code: String!
		success: Boolean!
		message: String!
		reference_surat_pengantar: [reference_surat_pengantar!]
	}
`
