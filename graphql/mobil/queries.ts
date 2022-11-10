import { gql } from "apollo-server-micro"

export const GET_VECHNICLE = gql`
	query vechnicle {
		vechnicle {
			id
			nomor_kendaraan
			tipe_kendaraan
			nama_supir
			nama_kenek
			nomor_supir
			nomor_kenek
			status
			last_update
			creator
			updated_by
		}
	}
`
