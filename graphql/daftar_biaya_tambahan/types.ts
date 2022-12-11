import { gql } from "apollo-server-micro"

export const types = gql`
	type daftar_biaya_tambahan {
		id: Int
		nomor_invoice: String
		harga_biaya_tambahan: String
		jenis_biaya_tambahan: String
		id_biaya_tambahan: String
		pengirim: String
	}

	type daftar_biaya_tambahan {
		daftar_biaya_tambahan: [daftar_biaya_tambahan!]
	}

	input CreateDaftar_biaya_tambahanInput {
		id: Int
		nomor_invoice: String
		harga_biaya_tambahan: String
		jenis_biaya_tambahan: String
		id_biaya_tambahan: String
		pengirim: String
	}

	input UpdateDaftar_biaya_tambahanInput {
		id: Int
		nomor_invoice: String
		harga_biaya_tambahan: String
		jenis_biaya_tambahan: String
		id_biaya_tambahan: String
		pengirim: String
	}

	type MutateDaftar_biaya_tambahanResponse {
		code: String!
		success: Boolean!
		message: String!
		daftar_biaya_tambahan: [daftar_biaya_tambahan!]
	}
`
