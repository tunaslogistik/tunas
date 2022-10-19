import { gql } from "apollo-server-micro"

export const GET_PENGATURAN = gql`
	query pengaturan {
		pengaturan {
			id
			nama_pt
			alamat
			email
			telepon
			fax
			bank
			nama_rekening
			no_rekening
		}
	}
`
