import { gql } from "apollo-server-micro"

export const CREATE_CUSTOMER = gql`
	mutation CreateCustomer($input: CreateCustomerInput!) {
		createCustomer(input: $input) {
			code
			success
			message
		}
	}
`

export const UPDATE_CUSTOMER = gql`
	mutation UpdateCustomer($input: UpdateCustomerInput!) {
		updateCustomer(input: $input) {
			code
			success
			message
		}
	}
`

export const DELETE_CUSTOMER = gql`
	mutation DeleteCustomer($deleteCustomerId: Int) {
		deleteCustomer(id: $deleteCustomerId) {
			code
			success
			message
		}
	}
`