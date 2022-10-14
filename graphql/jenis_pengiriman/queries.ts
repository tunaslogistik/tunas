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
