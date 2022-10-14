import { gql } from "apollo-server-micro"

export const CREATE_DAFTAR_SALES_ORDER = gql`
	mutation CreateDaftar_sales_order($input: CreateDaftar_sales_orderInput!) {
		createDaftar_sales_order(input: $input) {
			code
			success
			message
		}
	}
`

export const UPDATE_DAFTAR_SALES_ORDER = gql`
	mutation UpdateDaftar_sales_order($input: UpdateDaftar_sales_orderInput!) {
		updateDaftar_sales_order(input: $input) {
			code
			success
			message
		}
	}
`

export const DELETE_DAFTAR_SALES_ORDER = gql`
	mutation DeleteDaftar_sales_order($deleteDaftar_sales_orderId: Int) {
		deleteDaftar_sales_order(id: $deleteDaftar_sales_orderId) {
			code
			success
			message
		}
	}
`
