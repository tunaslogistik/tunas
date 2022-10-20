import { gql } from "apollo-server-micro"

export const types = gql`
	type daftar_harga {
		id: Int
		kode_asal: String
		kode: String
		kode_tujuan: String
		jenis_pengiriman: String
		harga: Int
		minimal_kubik: String
		creator: String
		updated_by: String
	}

	type daftar_harga_by_id {
		id: Int
		kode_asal: String
		kode: String
		kode_tujuan: String
		jenis_pengiriman: String
		harga: Int
		minimal_kubik: String
		creator: String
		updated_by: String
	}

	type daftar_harga {
		daftar_harga: [daftar_harga!]
	}

	input CreateDaftar_hargaInput {
		id: Int
		kode_asal: String
		kode: String
		kode_tujuan: String
		jenis_pengiriman: String
		harga: Int
		minimal_kubik: String
		creator: String
		updated_by: String
	}

	input UpdateDaftar_hargaInput {
		id: Int
		kode_asal: String
		kode: String
		kode_tujuan: String
		jenis_pengiriman: String
		harga: Int
		minimal_kubik: String
		creator: String
		updated_by: String
	}

	type MutateDaftar_hargaResponse {
		code: String!
		success: Boolean!
		message: String!
		daftar_harga: [daftar_harga!]
	}
`
