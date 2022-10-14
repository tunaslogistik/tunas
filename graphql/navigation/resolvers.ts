
import { Context } from "../context"

const queries = {
	navigation: (_parent, _args, context: Context) => {
		return context.prisma.navigation.findMany({
			include: {
				menu: true
			}
		})
	}
}

const mutations = {
	updateNavigation: async (_parent, args, context: Context) => {
		let navigation = []

		try {
			await Promise.all(
				navigation = args.inputs.map(async (input) => {
					return await context.prisma.navigation.update({
						where: {
							id: input.id
						},
						data: {
							menu: {
								deleteMany: {},
								createMany: {
									data: input.menu
								}
							}
						},
						include: {
							menu: true
						}
					})
				})
			)

			return {
				code: `200`,
				success: true,
				message: `Succesfully update navigation`,
				navigation
			}
		} catch (error) {
			console.log(error)
			throw new Error(error)
		}
	}
}

export const resolvers = { queries, mutations }