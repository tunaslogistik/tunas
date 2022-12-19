import { gql } from "apollo-server-micro"

export const CREATE_REFERENCE_INVOICE = gql`
	mutation Mutation($input: CreateReference_invoiceInput!) {
		createReference_invoice(input: $input) {
			code
			success
			message
		}
	}
`

export const UPDATE_REFERENCE_INVOICE = gql`
	mutation UpdateReference_invoice($input: UpdateReference_invoiceInput!) {
		updateReference_invoice(input: $input) {
			code
			success
			message
		}
	}
`

export const DELETE_REFERENCE_INVOICE = gql`
	mutation Mutation($deleteReferenceInvoiceId: Int) {
		deleteReference_invoice(id: $deleteReferenceInvoiceId) {
			success
			code
			message
		}
	}
`
