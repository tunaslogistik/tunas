import { gql } from "apollo-server-micro"

export const CREATE_JENIS_PENGIRIMAN = gql`
mutation Mutation($input: CreateJenis_pengirimanInput!) {
	createJenis_pengiriman(input: $input) {
	  code
	  success
	  message
	}
  }
`

export const UPDATE_JENIS_PENGIRIMAN = gql`
mutation UpdateJenis_pengiriman($input: UpdateJenis_pengirimanInput!) {
	updateJenis_pengiriman(input: $input) {
	  code
	  success
	  message
	}
  }
`

export const DELETE_JENIS_PENGIRIMAN = gql`
mutation Mutation($deleteJenisPengirimanId: Int) {
	deleteJenis_pengiriman(id: $deleteJenisPengirimanId) {
	  success
	  code
	  message
	}
  }
`