import { gql } from "apollo-server-micro"

export const CREATE_REFERENCE_MUAT_BARANG = gql`
	mutation Mutation($input: CreateReference_muat_barangInput!) {
		createReference_muat_barang(input: $input) {
			code
			success
			message
		}
	}
`

export const UPDATE_REFERENCE_MUAT_BARANG = gql`
	mutation UpdateReference_muat_barang(
		$input: UpdateReference_muat_barangInput!
	) {
		updateReference_muat_barang(input: $input) {
			code
			success
			message
		}
	}
`

export const DELETE_REFERENCE_MUAT_BARANG = gql`
	mutation Mutation($deleteReferenceMuatBarangId: Int) {
		deleteReference_muat_barang(id: $deleteReferenceMuatBarangId) {
			success
			code
			message
		}
	}
`
