import { gql } from "apollo-server-micro"

export const CREATE_USER = gql`
	mutation CreateUser($input: CreateUserInput!) {
		createUser(input: $input) {
			code
			success
			message
			user {
				id
				username
				name
				role
			}
		}
	}
`

export const UPDATE_USER = gql`
	mutation UpdateUser($input: UpdateUserInput!) {
		updateUser(input: $input) {
			code
			success
			message
			user {
				id
				username
				name
				role
			}
		}
	}
`

export const DELETE_USER = gql`
	mutation DeleteUser($id: ID!) {
		deleteUser(id: $id) {
			code
			success
			message
			user {
				id
				username
				name
				role
				createdAt
			}
		}
	}
`

export const CREATE_USER_ROLE = gql`
	mutation CreateUserRole($input: CreateUserRoleInput!) {
		createUserRole(input: $input) {
			code
			success
			message
			userRole {
				name
			}
		}
	}
`

export const UPDATE_USER_ROLE = gql`
	mutation UpdateUserRole($input: UpdateUserRoleInput!) {
		updateUserRole(input: $input) {
			code
			success
			message
			userRole {
				id
				name
			}
		}
	}
`

export const DELETE_USER_ROLE = gql`
	mutation DeleteUserRole($id: ID!) {
		deleteUserRole(id: $id) {
			code
			success
			message
			userRole {
				id
				name
			}
		}
	}
`
