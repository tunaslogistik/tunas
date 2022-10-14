import { gql } from "apollo-server-micro"

export const GET_DAFTAR_TUJUAN = gql`
	query daftar_tujuan {
		daftar_tujuan {
			id
			kode_tujuan
			nama_tujuan
			updated_by
			creator
		}
	}
`
