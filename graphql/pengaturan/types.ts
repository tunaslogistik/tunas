import { gql } from "apollo-server-micro"

export const types = gql`
	type pengaturan {
		id: Int
		nama_pt: String
		alamat: String
		email: String
		telepon: String
		fax: String
		bank: String
		nama_rekening: String
		no_rekening: String
	}

	type pengaturan {
		pengaturan: [pengaturan!]
	}

	input CreatePengaturanInput {
		id: Int
		nama_pt: String
		alamat: String
		email: String
		telepon: String
		fax: String
		bank: String
		nama_rekening: String
		no_rekening: String
	}

	input UpdatePengaturanInput {
		id: Int
		nama_pt: String
		alamat: String
		email: String
		telepon: String
		fax: String
		bank: String
		nama_rekening: String
		no_rekening: String
	}

	type MutatePengaturanResponse {
		code: String!
		success: Boolean!
		message: String!
		pengaturan: [pengaturan!]
	}
`
