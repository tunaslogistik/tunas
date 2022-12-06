import { gql } from "apollo-server-micro"

export const GET_ACCURATE = gql`
	query accurate {
		accurate {
			id
			nama_barang
			kode_barang
			jenis
			salesDiscountGlAccountId
			salesGlAccountId
			inventoryGlAccountId
			percentTaxable
			taxName
		}
	}
`
