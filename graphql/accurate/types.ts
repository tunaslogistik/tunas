import { gql } from "apollo-server-micro"

export const types = gql`
	type accurate {
		id: Int
		nama_barang: String
		kode_barang: String
		jenis: String
		akun_penjualan: String
		salesDiscountGlAccountId: String
		salesGlAccountId: String
		inventoryGlAccountId: String
		percentTaxable: String
		taxName: String
	}

	type accurate {
		accurate: [accurate!]
	}

	input CreateAccurateInput {
		id: Int
		nama_barang: String
		kode_barang: String
		jenis: String
		akun_penjualan: String
		salesDiscountGlAccountId: String
		salesGlAccountId: String
		inventoryGlAccountId: String
		percentTaxable: String
		taxName: String
	}

	input UpdateAccurateInput {
		id: Int
		nama_barang: String
		kode_barang: String
		jenis: String
		akun_penjualan: String
		salesDiscountGlAccountId: String
		salesGlAccountId: String
		inventoryGlAccountId: String
		percentTaxable: String
		taxName: String
	}

	type MutateAccurateResponse {
		code: String!
		success: Boolean!
		message: String!
		accurate: [accurate!]
	}
`
