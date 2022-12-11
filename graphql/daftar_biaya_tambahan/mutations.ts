import { gql } from "apollo-server-micro"

export const CREATE_DAFTAR_BIAYA_TAMBAHAN = gql`
	mutation CreateDaftar_biaya_tambahan(
		$input: [CreateDaftar_biaya_tambahanInput!]
	) {
		createDaftar_biaya_tambahan(input: $input) {
			code
			success
			message
		}
	}
`

export const UPDATE_DAFTAR_BIAYA_TAMBAHAN = gql`
	mutation UpdateDaftar_biaya_tambahan(
		$input: [UpdateDaftar_biaya_tambahanInput!]
	) {
		updateDaftar_biaya_tambahan(input: $input) {
			code
			success
			message
		}
	}
`

export const DELETE_DAFTAR_BIAYA_TAMBAHAN = gql`
	mutation DeleteDaftar_biaya_tambahan($deleteDaftar_biaya_tambahanId: Int) {
		deleteDaftar_biaya_tambahan(id: $deleteDaftar_biaya_tambahanId) {
			code
			success
			message
		}
	}
`
