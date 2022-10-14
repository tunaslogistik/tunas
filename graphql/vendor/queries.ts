import { gql } from "apollo-server-micro"

export const GET_VENDOR = gql`
	query vendor {
		vendor {
			id
			kode_vendor
			nama_vendor
			alamat
			telepon
			npwp
			pic
			status
			jenis
			last_update
			creator
			updated_by
		}
	}
`
