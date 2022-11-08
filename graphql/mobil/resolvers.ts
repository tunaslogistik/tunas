import { Context } from "../context"

const queries = {
	vechnicle: (_parent, _args, context: Context) => {
		return context.prisma.vechnicle.findMany()
	}
}

const mutations = {
	createVechnicle: async (_parent, args, context: Context) => {
		try {
			const {
				nomor_kendaraan,
				tipe_kendaraan,
				nama_supir,
				nama_kenek,
				nomor_supir,
				nomor_kenek,
				status,
				last_update,
				creator,
				updated_by
			} = args.input

			const vechnicle = await context.prisma.vechnicle.create({
				data: {
					nomor_kendaraan,
					tipe_kendaraan,
					nama_supir,
					nama_kenek,
					nomor_supir,
					nomor_kenek,
					status,
					last_update,
					creator,
					updated_by
				}
			})

			return {
				code: `200`,
				success: true,
				message: `Successfully create new user`,
				vechnicle
			}
		} catch (error) {
			console.log(error)
			throw new Error(error)
		}
	},
	updateVechnicle: async (_parent, args, context: Context) => {
		try {
			const {
				id,
				nomor_kendaraan,
				tipe_kendaraan,
				nama_supir,
				nama_kenek,
				nomor_supir,
				nomor_kenek,
				status,
				last_update,
				creator,
				updated_by
			} = args.input
			let vechnicle

			vechnicle = await context.prisma.vechnicle.update({
				where: { id },
				data: {
					id,
					nomor_kendaraan,
					tipe_kendaraan,
					nama_supir,
					nama_kenek,
					nomor_supir,
					nomor_kenek,
					status,
					last_update,
					creator,
					updated_by
				}
			})

			return {
				code: `200`,
				success: true,
				message: `Successfully update user`,
				vechnicle
			}
		} catch (error) {
			console.log(error)
			throw new Error(error)
		}
	},
	deleteVechnicle: async (_parent, args, context: Context) => {
		try {
			const vechnicle = await context.prisma.vechnicle.delete({
				where: { id: args.id }
			})

			return {
				code: `200`,
				success: true,
				message: `Successfully delete vechnicle`,
				vechnicle
			}
		} catch (error) {
			console.log(error)
			throw new Error(error)
		}
	}
}

export const resolvers = { queries, mutations }
