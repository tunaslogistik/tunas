import { gql } from "apollo-server-micro"

export const types = gql`
	type reference_surat_jalan {
		id: Int
		kode_tujuan: String
		kota_tujuan: String
		tanggal_tahun: String
		bulan_tahun: String
		increment: Int
	}

	type reference_surat_jalan_by_id {
		id: Int
		kode_tujuan: String
		kota_tujuan: String
		tanggal_tahun: String
		bulan_tahun: String
		increment: Int
	}

	type reference_surat_jalan {
		reference_surat_jalan: [reference_surat_jalan!]
	}

	input CreateReference_surat_jalanInput {
		id: Int
		kode_tujuan: String
		kota_tujuan: String
		tanggal_tahun: String
		bulan_tahun: String
		increment: Int
	}

	input UpdateReference_surat_jalanInput {
		id: Int
		kode_tujuan: String
		kota_tujuan: String
		tanggal_tahun: String
		bulan_tahun: String
		increment: Int
	}

	type MutateReference_surat_jalanResponse {
		code: String!
		success: Boolean!
		message: String!
		reference_surat_jalan: [reference_surat_jalan!]
	}
`
