import { gql } from "apollo-server-micro"

export const GET_CUSTOMER = gql`
	query customer {
		customer {
			kode_customer
			idPelanggan
			nama_customer
			alamat
			telepon
			npwp
			pic
			term_payment
			tipe_ppn
			status
			last_update
			creator
			updated_by
		}
	}
`
