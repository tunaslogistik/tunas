import { gql } from "apollo-server-micro"

export const types = gql`
	type reference_invoice {
		id: Int
		kode_tujuan: String
		kota_tujuan: String
		tanggal_tahun: String
		bulan_tahun: String
		increment: Int
	}

	type reference_invoice_by_id {
		id: Int
		kode_tujuan: String
		kota_tujuan: String
		tanggal_tahun: String
		bulan_tahun: String
		increment: Int
	}

	type reference_invoice {
		reference_invoice: [reference_invoice!]
	}

	input CreateReference_invoiceInput {
		id: Int
		kode_tujuan: String
		kota_tujuan: String
		tanggal_tahun: String
		bulan_tahun: String
		increment: Int
	}

	input UpdateReference_invoiceInput {
		id: Int
		kode_tujuan: String
		kota_tujuan: String
		tanggal_tahun: String
		bulan_tahun: String
		increment: Int
	}

	type MutateReference_invoiceResponse {
		code: String!
		success: Boolean!
		message: String!
		reference_invoice: [reference_invoice!]
	}
`
