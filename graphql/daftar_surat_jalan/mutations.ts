import { gql } from "apollo-server-micro"

export const CREATE_DAFTAR_SURAT_JALAN = gql`
	mutation CreateDaftar_surat_jalan($input: CreateDaftar_surat_jalanInput!) {
		createDaftar_surat_jalan(input: $input) {
			code
			success
			message
		}
	}
`

export const UPDATE_DAFTAR_SURAT_JALAN = gql`
	mutation UpdateDaftar_surat_jalan($input: UpdateDaftar_surat_jalanInput!) {
		updateDaftar_surat_jalan(input: $input) {
			code
			success
			message
		}
	}
`

export const DELETE_DAFTAR_SURAT_JALAN = gql`
	mutation DeleteDaftar_surat_jalan($deleteDaftar_surat_jalanId: Int) {
		deleteDaftar_surat_jalan(id: $deleteDaftar_surat_jalanId) {
			code
			success
			message
		}
	}
`
