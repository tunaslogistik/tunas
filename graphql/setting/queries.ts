import { gql } from "apollo-server-micro"

export const GET_SETTINGS = gql`
	query Settings {
		settings {
			name
			value
		}
	}
`