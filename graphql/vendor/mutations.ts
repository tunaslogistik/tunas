import { gql } from "apollo-server-micro"

export const CREATE_VENDOR = gql`
	mutation CreateVendor($input: CreateVendorInput!) {
		createVendor(input: $input) {
		code
		success
		message
		}
	}
`

export const UPDATE_VENDOR = gql`
	mutation UpdateVendor($input: UpdateVendorInput!) {
		updateVendor(input: $input) {
			code
			success
			message
		}
	}
`

export const DELETE_VENDOR = gql`
	mutation DeleteVendor($deleteVendorId: Int) {
		deleteVendor(id: $deleteVendorId) {
			code
			success
			message
		}
	}
`
