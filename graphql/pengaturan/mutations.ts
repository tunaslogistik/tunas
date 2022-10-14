import { gql } from "apollo-server-micro"

export const CREATE_PENGATURAN = gql`
	mutation CreatePengaturan($input: CreatePengaturanInput!) {
		createPengaturan(input: $input) {
			code
			success
			message
		}
	}
`

export const UPDATE_PENGATURAN = gql`
	mutation UpdatePengaturan($input: UpdatePengaturanInput!) {
		updatePengaturan(input: $input) {
			code
			success
			message
		}
	}
`

export const DELETE_PENGATURAN = gql`
	mutation DeletePengaturan($deletePengaturanId: Int) {
		deletePengaturan(id: $deletePengaturanId) {
			code
			success
			message
		}
	}
`
