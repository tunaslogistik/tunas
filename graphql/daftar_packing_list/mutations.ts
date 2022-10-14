import { gql } from "apollo-server-micro"

export const CREATE_DAFTAR_PACKING_LIST = gql`
	mutation CreateDaftar_muat_barang($input: CreateDaftar_packing_listInput!) {
		createDaftar_packing_list(input: $input) {
			code
			success
			message
		}
	}
`

export const UPDATE_DAFTAR_PACKING_LIST = gql`
	mutation UpdateDaftar_packing_list($input: UpdateDaftar_packing_listInput!) {
		updateDaftar_packing_list(input: $input) {
			code
			success
			message
		}
	}
`

export const DELETE_DAFTAR_PACKING_LIST = gql`
	mutation DeleteDaftar_packing_list($deleteDaftar_packing_listId: Int) {
		deleteDaftar_packing_list(id: $deleteDaftar_packing_listId) {
			code
			success
			message
		}
	}
`
