import { gql } from "apollo-server-micro"

export const CREATE_REFERENCE_SURAT_PENGANTAR = gql`
	mutation Mutation($input: CreateReference_surat_pengantarInput!) {
		createReference_surat_pengantar(input: $input) {
			code
			success
			message
		}
	}
`

export const UPDATE_REFERENCE_SURAT_PENGANTAR = gql`
	mutation UpdateReference_surat_pengantar(
		$input: UpdateReference_surat_pengantarInput!
	) {
		updateReference_surat_pengantar(input: $input) {
			code
			success
			message
		}
	}
`

export const DELETE_REFERENCE_SURAT_PENGANTAR = gql`
	mutation Mutation($deleteReferenceSuratPengantarId: Int) {
		deleteReference_surat_pengantar(id: $deleteReferenceSuratPengantarId) {
			success
			code
			message
		}
	}
`
