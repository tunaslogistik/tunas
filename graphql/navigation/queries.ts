import { gql } from "apollo-server-micro"

export const GET_NAVIGATION = gql`
	query Navigation {
		navigation {
			id
			name
			menu {
				id
				label
				url
			}
		}
	}
`