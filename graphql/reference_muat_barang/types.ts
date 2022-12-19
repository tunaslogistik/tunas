import { gql } from "apollo-server-micro"

export const types = gql`
	type reference_muat_barang {
		id: Int
		kode_tujuan: String
		kota_tujuan: String
		tanggal_tahun: String
		bulan_tahun: String
		increment: Int
	}

	type reference_muat_barang_by_id {
		id: Int
		kode_tujuan: String
		kota_tujuan: String
		tanggal_tahun: String
		bulan_tahun: String
		increment: Int
	}

	type reference_muat_barang {
		reference_muat_barang: [reference_muat_barang!]
	}

	input CreateReference_muat_barangInput {
		id: Int
		kode_tujuan: String
		kota_tujuan: String
		tanggal_tahun: String
		bulan_tahun: String
		increment: Int
	}

	input UpdateReference_muat_barangInput {
		id: Int
		kode_tujuan: String
		kota_tujuan: String
		tanggal_tahun: String
		bulan_tahun: String
		increment: Int
	}

	type MutateReference_muat_barangResponse {
		code: String!
		success: Boolean!
		message: String!
		reference_muat_barang: [reference_muat_barang!]
	}
`
