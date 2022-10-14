import { gql } from "apollo-server-micro"

export const types = gql`
	type User {
		id: ID!
		username: String!
		email: String
		cabang: String
		creator: String
		name: String
		role: String!
		createdAt: String
		userRole: UserRole!
	}

	type Users {
		user: [User!]
		count: Int!
		countPerPage: Int!
	}

	input CreateUserInput {
		username: String!
		email: String
		cabang: String
		creator: String
		name: String
		password: String!
		role: String!
	}

	input UpdateUserInput {
		id: String!
		username: String!
		email: String
		cabang: String
		creator: String
		name: String
		password: String
		role: String!
	}

	type MutateUserResponse {
		code: String!
		success: Boolean!
		message: String!
		user: User
	}

	type UserRole {
		id: ID!
		name: String!
		read: [String]
		write: [String]
		users: [User!]
		_count: UserRoleCount
	}

	type UserRoleCount {
		users: Int
	}

	input CreateUserRoleInput {
		name: String!
		read: [String]
		write: [String]
	}

	input UpdateUserRoleInput {
		id: ID!
		name: String!
		read: [String]
		write: [String]
	}

	type MutateRoleResponse {
		code: String!
		success: Boolean!
		message: String!
		userRole: UserRole
	}
`