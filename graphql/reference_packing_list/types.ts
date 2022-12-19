import { gql } from "apollo-server-micro"

export const types = gql`
	type reference_packing_list {
		id: Int
		kode_tujuan: String
		kota_tujuan: String
		tanggal_tahun: String
		bulan_tahun: String
		increment: Int
	}

	type reference_packing_list_by_id {
		id: Int
		kode_tujuan: String
		kota_tujuan: String
		tanggal_tahun: String
		bulan_tahun: String
		increment: Int
	}

	type reference_packing_list {
		reference_packing_list: [reference_packing_list!]
	}

	input CreateReference_packing_listInput {
		id: Int
		kode_tujuan: String
		kota_tujuan: String
		tanggal_tahun: String
		bulan_tahun: String
		increment: Int
	}

	input UpdateReference_packing_listInput {
		id: Int
		kode_tujuan: String
		kota_tujuan: String
		tanggal_tahun: String
		bulan_tahun: String
		increment: Int
	}

	type MutateReference_packing_listResponse {
		code: String!
		success: Boolean!
		message: String!
		reference_packing_list: [reference_packing_list!]
	}
`
