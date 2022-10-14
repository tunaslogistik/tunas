import { gql } from "apollo-server-micro"

export const CREATE_DAFTAR_TUJUAN = gql`
mutation Mutation($input: CreateDaftar_tujuanInput!) {
	createDaftar_tujuan(input: $input) {
	  code
	  success
	  message
	}
  }
`

export const UPDATE_DAFTAR_TUJUAN = gql`
mutation UpdateDaftar_tujuan($input: UpdateDaftar_tujuanInput!) {
	updateDaftar_tujuan(input: $input) {
	  code
	  success
	  message
	}
  }
`

export const DELETE_DAFTAR_TUJUAN = gql`
mutation Mutation($deleteDaftarTujuanId: Int) {
	deleteDaftar_tujuan(id: $deleteDaftarTujuanId) {
	  success
	  code
	  message
	}
  }
`