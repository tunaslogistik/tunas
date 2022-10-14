import { gql } from "apollo-server-micro"

export const UPDATE_NAVIGATION = gql`
	mutation UpdateNavigation($inputs: [UpdateNavigationInput!]) {
		updateNavigation(inputs: $inputs) {
			code
			success
			message
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
	}
`
