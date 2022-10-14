import { gql } from "apollo-server-micro"

export const CREATE_DAFTAR_SURAT_PENGANTAR = gql`
	mutation CreateDaftar_surat_pengantar(
		$input: CreateDaftar_surat_pengantarInput!
	) {
		createDaftar_surat_pengantar(input: $input) {
			code
			success
			message
		}
	}
`

export const UPDATE_DAFTAR_SURAT_PENGANTAR = gql`
	mutation UpdateDaftar_surat_pengantar(
		$input: UpdateDaftar_surat_pengantarInput!
	) {
		updateDaftar_surat_pengantar(input: $input) {
			code
			success
			message
		}
	}
`

export const DELETE_DAFTAR_SURAT_PENGANTAR = gql`
	mutation DeleteDaftar_surat_pengantar($deleteDaftar_surat_pengantarId: Int) {
		deleteDaftar_surat_pengantar(id: $deleteDaftar_surat_pengantarId) {
			code
			success
			message
		}
	}
`
