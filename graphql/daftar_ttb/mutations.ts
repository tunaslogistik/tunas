import { gql } from "apollo-server-micro"

export const CREATE_DAFTAR_TTB = gql`
	mutation CreateDaftar_ttb($input: CreateDaftar_ttbInput!) {
		createDaftar_ttb(input: $input) {
			code
			success
			message
		}
	}
`

export const UPDATE_DAFTAR_TTB = gql`
	mutation UpdateDaftar_ttb($input: UpdateDaftar_ttbInput!) {
		updateDaftar_ttb(input: $input) {
			code
			success
			message
		}
	}
`

export const DELETE_DAFTAR_TTB = gql`
	mutation DeleteDaftar_ttb($deleteDaftar_ttbId: Int) {
		deleteDaftar_ttb(id: $deleteDaftar_ttbId) {
			code
			success
			message
		}
	}
`
