import { gql } from "apollo-server-micro"

export const CREATE_REFERENCE_SURAT_JALAN = gql`
	mutation Mutation($input: CreateReference_surat_jalanInput!) {
		createReference_surat_jalan(input: $input) {
			code
			success
			message
		}
	}
`

export const UPDATE_REFERENCE_SURAT_JALAN = gql`
	mutation UpdateReference_surat_jalan(
		$input: UpdateReference_surat_jalanInput!
	) {
		updateReference_surat_jalan(input: $input) {
			code
			success
			message
		}
	}
`

export const DELETE_REFERENCE_SURAT_JALAN = gql`
	mutation Mutation($deleteReferenceSuratJalanId: Int) {
		deleteReference_surat_jalan(id: $deleteReferenceSuratJalanId) {
			success
			code
			message
		}
	}
`
