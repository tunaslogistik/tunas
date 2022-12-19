import { gql } from "apollo-server-micro"

export const CREATE_REFERENCE_WORKORDER = gql`
	mutation Mutation($input: CreateReference_workorderInput!) {
		createReference_workorder(input: $input) {
			code
			success
			message
		}
	}
`

export const UPDATE_REFERENCE_WORKORDER = gql`
	mutation UpdateReference_workorder($input: UpdateReference_workorderInput!) {
		updateReference_workorder(input: $input) {
			code
			success
			message
		}
	}
`

export const DELETE_REFERENCE_WORKORDER = gql`
	mutation Mutation($deleteReferenceWorkorderId: Int) {
		deleteReference_workorder(id: $deleteReferenceWorkorderId) {
			success
			code
			message
		}
	}
`
