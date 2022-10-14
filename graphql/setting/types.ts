import { gql } from "apollo-server-micro"

export const types = gql`
	type Setting {
		name: String!
		value: String!
	}

	type MutateSettingResponse {
		code: String!
		success: Boolean!
		message: String!
		settings: [Setting!]
	}

	input SettingInput {
		name: String!
		value: String!
	}
`