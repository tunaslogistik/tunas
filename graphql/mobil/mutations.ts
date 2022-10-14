import { gql } from "apollo-server-micro"

export const CREATE_VECHNICLE = gql`
	mutation CreateVechnicle($input: CreateVechnicleInput!) {
		createVechnicle(input: $input) {
		code
		success
		message
		}
	}
`

export const UPDATE_VECHNICLE = gql`
	mutation UpdateVechnicle($input: UpdateVechnicleInput!) {
		updateVechnicle(input: $input) {
			code
			success
			message
		}
	}
`

export const DELETE_VECHNICLE = gql`
	mutation DeleteVechnicle($deleteVechnicleId: Int) {
		deleteVechnicle(id: $deleteVechnicleId) {
			code
			success
			message
		}
	}
`
