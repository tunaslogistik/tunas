import { gql } from "apollo-server-micro"

export const GET_USERS = gql`
	query Users($page: Int) {
		users(page: $page) {
			user {
				id
				username
				name
				role
				userRole {
					id
					name
				}
			}
			count
			countPerPage
		}
	}
`
export const GET_USER = gql`
	query User($id: ID) {
		user(id: $id) {
			id
			username
			name
			userRole {
				id
				name
				read
				write
			}
		}
	}
`

export const GET_USER_ROLES = gql`
	query UserRoles {
		userRoles {
			id
			name
			read
			write
			_count {
				users
			}
		}
	}
`

export const GET_USER_ROLE = gql`
	query UserRole($id: ID) {
		userRole(id: $id) {
			id
			name
			read
			write
		}
	}
`