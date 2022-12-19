import { gql } from "apollo-server-micro"

export const CREATE_REFERENCE_SALES_ORDER = gql`
	mutation Mutation($input: CreateReference_sales_orderInput!) {
		createReference_sales_order(input: $input) {
			code
			success
			message
		}
	}
`

export const UPDATE_REFERENCE_SALES_ORDER = gql`
	mutation UpdateReference_sales_order(
		$input: UpdateReference_sales_orderInput!
	) {
		updateReference_sales_order(input: $input) {
			code
			success
			message
		}
	}
`

export const DELETE_REFERENCE_SALES_ORDER = gql`
	mutation Mutation($deleteReferenceSalesOrderId: Int) {
		deleteReference_sales_order(id: $deleteReferenceSalesOrderId) {
			success
			code
			message
		}
	}
`
