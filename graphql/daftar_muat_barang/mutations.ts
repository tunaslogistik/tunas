import { gql } from "apollo-server-micro"

export const CREATE_DAFTAR_MUAT_BARANG = gql`
	mutation CreateDaftar_muat_barang($input: CreateDaftar_muat_barangInput!) {
		createDaftar_muat_barang(input: $input) {
			code
			success
			message
		}
	}
`

export const UPDATE_DAFTAR_MUAT_BARANG = gql`
	mutation UpdateDaftar_muat_barang($input: UpdateDaftar_muat_barangInput!) {
		updateDaftar_muat_barang(input: $input) {
			code
			success
			message
		}
	}
`

export const DELETE_DAFTAR_MUAT_BARANG = gql`
	mutation DeleteDaftar_muat_barang($deleteDaftar_muat_barangId: Int) {
		deleteDaftar_muat_barang(id: $deleteDaftar_muat_barangId) {
			code
			success
			message
		}
	}
`
