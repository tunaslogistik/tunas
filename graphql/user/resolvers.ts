import { encryptPassword } from "@utils/password"
import { Context } from "../context"

const queries = {
	users: async (_parent, args, context: Context) => {
		const COUNT_PER_PAGE = 10
		const page = args.page || 1
		const offset = (page - 1) * COUNT_PER_PAGE

		const response = {
			user: await context.prisma.user.findMany({
				take: COUNT_PER_PAGE,
				skip: offset,
				orderBy: { createdAt: `asc` },
				include: {
					userRole: true
				}
			}),
			count: await context.prisma.user.count(),
			countPerPage: COUNT_PER_PAGE
		}

		return response
	},
	user: async (_parent, args, context: Context) => {
		const response = await context.prisma.user.findUnique({
			where: { id: args.id },
			include: {
				userRole: true
			}
		})

		return response
	},
	userRoles: async (_parent, _args, context: Context) => {
		const response = await context.prisma.userRole.findMany({
			include: {
				_count: {
					select: {
						users: true
					}
				}
			}
		})

		return response
	},
	userRole: (_parent, args, context: Context) => {
		return context.prisma.userRole.findUnique({
			where: { id: args.id },
			include: {
				users: true
			}
		})
	}
}

const mutations = {
	createUser: async (_parent, args, context: Context) => {
		try {
			const { username, email, cabang, creator, name, password, role } =
				args.input
			const hashedPassword = await encryptPassword(password)

			const user = await context.prisma.user.create({
				data: {
					username,
					email,
					cabang,
					creator,
					name,
					password: hashedPassword,
					role
				}
			})

			return {
				code: `200`,
				success: true,
				message: `Successfully create new user`,
				user
			}
		} catch (error) {
			console.log(error)
			throw new Error(error)
		}
	},
	updateUser: async (_parent, args, context: Context) => {
		try {
			const { id, username, email, cabang, creator, name, role, password } =
				args.input
			let user

			if (password) {
				const hashedPassword = await encryptPassword(password)

				user = await context.prisma.user.update({
					where: { id },
					data: {
						username,
						email,
						cabang,
						creator,
						name,
						role,
						password: hashedPassword
					}
				})
			} else {
				user = await context.prisma.user.update({
					where: { id },
					data: {
						username,
						name,
						role
					}
				})
			}

			return {
				code: `200`,
				success: true,
				message: `Successfully update user`,
				user
			}
		} catch (error) {
			console.log(error)
			throw new Error(error)
		}
	},
	deleteUser: async (_parent, args, context: Context) => {
		try {
			const user = await context.prisma.user.delete({
				where: { id: args.id }
			})

			return {
				code: `200`,
				success: true,
				message: `Successfully delete user`,
				user
			}
		} catch (error) {
			console.log(error)
			throw new Error(error)
		}
	},
	createUserRole: async (_parent, args, context: Context) => {
		try {
			const { name, read, write } = args.input
			const userRole = await context.prisma.userRole.create({
				data: {
					name,
					read,
					write
				}
			})

			return {
				code: `200`,
				success: true,
				message: `Successfully create new user role`,
				userRole
			}
		} catch (error) {
			console.log(error)
			throw new Error(error)
		}
	},
	updateUserRole: async (_parent, args, context: Context) => {
		try {
			const { id, name, read, write } = args.input
			const userRole = await context.prisma.userRole.update({
				where: { id },
				data: {
					name,
					read,
					write
				}
			})

			return {
				code: `200`,
				success: true,
				message: `Successfully update user role`,
				userRole
			}
		} catch (error) {
			console.log(error)
			throw new Error(error)
		}
	},
	deleteUserRole: async (_parent, args, context: Context) => {
		try {
			const userRole = await context.prisma.userRole.delete({
				where: { id: args.id }
			})

			return {
				code: `200`,
				success: true,
				message: `Successfully delete user role`,
				userRole
			}
		} catch (error) {
			console.log(error)
			throw new Error(error)
		}
	}
}

export const resolvers = { queries, mutations }
