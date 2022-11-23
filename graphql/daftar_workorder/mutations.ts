import { gql } from "apollo-server-micro"

export const CREATE_DAFTAR_WORKORDER = gql`
	mutation CreateDaftar_workorder($input: CreateDaftar_workorderInput!) {
		createDaftar_workorder(input: $input) {
			code
			success
			message
		}
	}
`

export const UPDATE_DAFTAR_WORKORDER = gql`
	mutation UpdateDaftar_workorder($input: UpdateDaftar_workorderInput!) {
		updateDaftar_workorder(input: $input) {
			code
			success
			message
		}
	}
`

export const DELETE_DAFTAR_WORKORDER = gql`
	mutation DeleteDaftar_workorder($deleteDaftar_workorderId: Int) {
		deleteDaftar_workorder(id: $deleteDaftar_workorderId) {
			code
			success
			message
		}
	}
`
