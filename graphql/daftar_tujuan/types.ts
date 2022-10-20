import { gql } from "apollo-server-micro"

export const types = gql`
	type daftar_tujuan {
		id: Int
		kode_tujuan: String
		nama_tujuan: String
		creator: String
		updated_by: String
	}

	type daftar_tujuan_by_id {
		id: Int
		kode_tujuan: String
		nama_tujuan: String
		creator: String
		updated_by: String
	}

	type daftar_tujuan {
		daftar_tujuan: [daftar_tujuan!]
	}

	input CreateDaftar_tujuanInput {
		id: Int
		kode_tujuan: String
		nama_tujuan: String
		creator: String
		updated_by: String
	}

	input UpdateDaftar_tujuanInput {
		id: Int
		kode_tujuan: String
		nama_tujuan: String
		creator: String
		updated_by: String
	}

	type MutateDaftar_tujuanResponse {
		code: String!
		success: Boolean!
		message: String!
		daftar_tujuan: [daftar_tujuan!]
	}
`
