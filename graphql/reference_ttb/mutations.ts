import { gql } from "apollo-server-micro"

export const CREATE_REFERENCE_TTB = gql`
	mutation Mutation($input: CreateReference_ttbInput!) {
		createReference_ttb(input: $input) {
			code
			success
			message
		}
	}
`

export const UPDATE_REFERENCE_TTB = gql`
	mutation UpdateReference_ttb($input: UpdateReference_ttbInput!) {
		updateReference_ttb(input: $input) {
			code
			success
			message
		}
	}
`

export const DELETE_REFERENCE_TTB = gql`
	mutation Mutation($deleteReferenceTtbId: Int) {
		deleteReference_ttb(id: $deleteReferenceTtbId) {
			success
			code
			message
		}
	}
`
