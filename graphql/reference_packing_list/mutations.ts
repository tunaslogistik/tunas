import { gql } from "apollo-server-micro"

export const CREATE_REFERENCE_PACKING_LIST = gql`
	mutation Mutation($input: CreateReference_packing_listInput!) {
		createReference_packing_list(input: $input) {
			code
			success
			message
		}
	}
`

export const UPDATE_REFERENCE_PACKING_LIST = gql`
	mutation UpdateReference_packing_list(
		$input: UpdateReference_packing_listInput!
	) {
		updateReference_packing_list(input: $input) {
			code
			success
			message
		}
	}
`

export const DELETE_REFERENCE_PACKING_LIST = gql`
	mutation Mutation($deleteReferencePackingListId: Int) {
		deleteReference_packing_list(id: $deleteReferencePackingListId) {
			success
			code
			message
		}
	}
`
