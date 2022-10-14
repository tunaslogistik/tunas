import { Context } from "../context"

const queries = {
	vendor: (_parent, _args, context: Context) => {
		return context.prisma.vendor.findMany()
	}
}

const mutations = {
	createVendor: async (_parent, args, context: Context) => {
		try {
			const {
				id,
				kode_vendor,
				nama_vendor,
				alamat,
				telepon,
				npwp,
				pic,
				status,
				jenis,
				last_update,
				creator,
				updated_by
			} = args.input

			const vendor = await context.prisma.vendor.create({
				data: {
					id,
					kode_vendor,
					nama_vendor,
					alamat,
					telepon,
					npwp,
					pic,
					status,
					jenis,
					last_update,
					creator,
					updated_by
				}
			})

			return {
				code: `200`,
				success: true,
				message: `Successfully create new user`,
				vendor
			}
		} catch (error) {
			console.log(error)
			throw new Error(error)
		}
	},
	updateVendor: async (_parent, args, context: Context) => {
		try {
			const {
				id,
				kode_vendor,
				nama_vendor,
				alamat,
				telepon,
				npwp,
				pic,
				status,
				jenis,
				last_update,
				creator,
				updated_by
			} = args.input
			let vendor

			vendor = await context.prisma.vendor.update({
				where: { id },
				data: {
					id,
					kode_vendor,
					nama_vendor,
					alamat,
					telepon,
					npwp,
					pic,
					status,
					jenis,
					last_update,
					creator,
					updated_by
				}
			})

			return {
				code: `200`,
				success: true,
				message: `Successfully update user`,
				vendor
			}
		} catch (error) {
			console.log(error)
			throw new Error(error)
		}
	},
	deleteVendor: async (_parent, args, context: Context) => {
		try {
			const vendor = await context.prisma.vendor.delete({
				where: { id: args.id }
			})

			return {
				code: `200`,
				success: true,
				message: `Successfully delete vechnicle`,
				vendor
			}
		} catch (error) {
			console.log(error)
			throw new Error(error)
		}
	}
}

export const resolvers = { queries, mutations }
