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
//export by daftar_tujuan id
export const GET_DAFTAR_TUJUAN_BY_ID = gql`
	query daftar_tujuan_by_id($id: Int) {
		daftar_tujuan_by_id(id: $id) {
			id
			kode_tujuan
			nama_tujuan
			updated_by
			creator
		}
	}
`
