import { gql } from "apollo-server-micro"

export const CREATE_DAFTAR_INVOICE = gql`
	mutation CreateDaftar_invoice($input: CreateDaftar_invoiceInput!) {
		createDaftar_invoice(input: $input) {
			code
			success
			message
		}
	}
`

export const UPDATE_DAFTAR_INVOICE = gql`
	mutation UpdateDaftar_invoice($input: UpdateDaftar_invoiceInput!) {
		updateDaftar_invoice(input: $input) {
			code
			success
			message
		}
	}
`

export const DELETE_DAFTAR_INVOICE = gql`
	mutation DeleteDaftar_invoice($deleteDaftar_invoiceId: Int) {
		deleteDaftar_invoice(id: $deleteDaftar_invoiceId) {
			code
			success
			message
		}
	}
`
