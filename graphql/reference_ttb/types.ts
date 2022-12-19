import { gql } from "apollo-server-micro"

export const types = gql`
	type reference_ttb {
		id: Int
		kode_tujuan: String
		kota_tujuan: String
		tanggal_tahun: String
		bulan_tahun: String
		increment: Int
	}

	type reference_ttb_by_id {
		id: Int
		kode_tujuan: String
		kota_tujuan: String
		tanggal_tahun: String
		bulan_tahun: String
		increment: Int
	}

	type reference_ttb {
		reference_ttb: [reference_ttb!]
	}

	input CreateReference_ttbInput {
		id: Int
		kode_tujuan: String
		kota_tujuan: String
		tanggal_tahun: String
		bulan_tahun: String
		increment: Int
	}

	input UpdateReference_ttbInput {
		id: Int
		kode_tujuan: String
		kota_tujuan: String
		tanggal_tahun: String
		bulan_tahun: String
		increment: Int
	}

	type MutateReference_ttbResponse {
		code: String!
		success: Boolean!
		message: String!
		reference_ttb: [reference_ttb!]
	}
`
