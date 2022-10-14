import { gql } from "apollo-server-micro"

export const CREATE_DAFTAR_HARGA = gql`
	mutation CreateDaftar_harga($input: CreateDaftar_hargaInput!) {
		createDaftar_harga(input: $input) {
			code
			success
			message
		}
	}
`

export const UPDATE_DAFTAR_HARGA = gql`
	mutation UpdateDaftar_harga($input: UpdateDaftar_hargaInput!) {
		updateDaftar_harga(input: $input) {
			code
			success
			message
		}
	}
`

export const DELETE_DAFTAR_HARGA = gql`
	mutation DeleteDaftar_harga($deleteDaftar_hargaId: Int) {
		deleteDaftar_harga(id: $deleteDaftar_hargaId) {
			code
			success
			message
		}
	}
`
