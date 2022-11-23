import { gql } from "apollo-server-micro"

export const CREATE_ACCURATE = gql`
	mutation CreateAccurate($input: CreateAccurateInput!) {
		createAccurate(input: $input) {
			code
			success
			message
		}
	}
`

export const UPDATE_ACCURATE = gql`
	mutation UpdateAccurate($input: UpdateAccurateInput!) {
		updateAccurate(input: $input) {
			code
			success
			message
		}
	}
`

export const DELETE_ACCURATE = gql`
	mutation DeleteAccurate($deleteAccurateId: Int) {
		deleteAccurate(id: $deleteAccurateId) {
			code
			success
			message
		}
	}
`
