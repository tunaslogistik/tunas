import { gql } from "apollo-server-micro"

export const types = gql`
	type vendor {
		id: Int
		kode_vendor: String
		nama_vendor: String
		alamat: String
		telepon: String
		npwp: String
		pic: String
		status: String
		jenis: String
		last_update: String
		creator: String
		updated_by: String
	}

	type vendor {
		vendor: [vendor!]
	}

	input CreateVendorInput {
		id: Int
		kode_vendor: String
		nama_vendor: String
		alamat: String
		telepon: String
		npwp: String
		pic: String
		status: String
		jenis: String
		last_update: String
		creator: String
		updated_by: String
	}

	input UpdateVendorInput {
		id: Int
		kode_vendor: String
		nama_vendor: String
		alamat: String
		telepon: String
		npwp: String
		pic: String
		status: String
		jenis: String
		last_update: String
		creator: String
		updated_by: String
	}

	type MutateVendorResponse {
		code: String!
		success: Boolean!
		message: String!
		vendor: [vendor!]
	}
`
