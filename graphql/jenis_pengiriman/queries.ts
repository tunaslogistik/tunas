import { gql } from "apollo-server-micro"

export const GET_JENIS_PENGIRIMAN = gql`
	query Jenis_pengiriman {
		jenis_pengiriman {
			id
			nama_pengiriman
			updated_by
			creator
		}
	}
`
export const GET_JENIS_PENGIRIMAN_BY_ID = gql`
	query jenis_pengiriman_by_id($id: Int) {
		jenis_pengiriman_by_id(id: $id) {
			id
			nama_pengiriman
			updated_by
			creator
		}
	}
`
