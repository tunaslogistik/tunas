import { Context } from "../context"

const queries = {
	jenis_pengiriman: (_parent, _args, context: Context) => {
		return context.prisma.jenis_pengiriman.findMany()
	},
	jenis_pengiriman_by_id: (_parent, { id }, context: Context) => {
		return context.prisma.jenis_pengiriman.findUnique({
			where: {
				id: id
			}
		})
	}
}

const mutations = {
	createJenis_pengiriman: async (_parent, args, context: Context) => {
		try {
			const { nama_pengiriman, creator, updated_by } = args.input

			const jenis_pengiriman = await context.prisma.jenis_pengiriman.create({
				data: {
					nama_pengiriman,
					creator,
					updated_by
				}
			})

			return {
				code: `200`,
				success: true,
				message: `Successfully create new daftar tujuan`,
				jenis_pengiriman
			}
		} catch (error) {
			console.log(error)
			throw new Error(error)
		}
	},
	updateJenis_pengiriman: async (_parent, args, context: Context) => {
		try {
			const { id, nama_pengiriman, creator, updated_by } = args.input
			let jenis_pengiriman

			jenis_pengiriman = await context.prisma.jenis_pengiriman.update({
				where: { id },
				data: {
					id,
					nama_pengiriman,
					creator,
					updated_by
				}
			})

			return {
				code: `200`,
				success: true,
				message: `Successfully update user`,
				jenis_pengiriman
			}
		} catch (error) {
			console.log(error)
			throw new Error(error)
		}
	},
	deleteJenis_pengiriman: async (_parent, args, context: Context) => {
		try {
			const jenis_pengiriman = await context.prisma.jenis_pengiriman.delete({
				where: { id: args.id }
			})

			return {
				code: `200`,
				success: true,
				message: `Successfully delete vechnicle`,
				jenis_pengiriman
			}
		} catch (error) {
			console.log(error)
			throw new Error(error)
		}
	}
}

export const resolvers = { queries, mutations }
