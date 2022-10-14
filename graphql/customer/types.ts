import { gql } from "apollo-server-micro"

export const types = gql`
	type customer {
		id: Int
		kode_customer: String
		nama_customer: String
		alamat: String
		telepon: String
		npwp: String
		term_payment: String
		pic: String
		tipe_ppn: String
		status: String
		last_update: String
		creator: String
		updated_by: String
	}

	type customer {
		customer: [customer!]
	}

	input CreateCustomerInput {
		id: Int
		kode_customer: String
		nama_customer: String
		alamat: String
		telepon: String
		npwp: String
		term_payment: String
		pic: String
		tipe_ppn: String
		status: String
		last_update: String
		creator: String
		updated_by: String
	}

	input UpdateCustomerInput {
		id: Int
		kode_customer: String
		nama_customer: String
		alamat: String
		telepon: String
		npwp: String
		term_payment: String
		pic: String
		tipe_ppn: String
		status: String
		last_update: String
		creator: String
		updated_by: String
	}

	type MutateCustomerResponse {
		code: String!
		success: Boolean!
		message: String!
		customer: [customer!]
	}
`
