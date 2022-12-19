import { Context } from "../context"

const queries = {
	reference_workorder: (_parent, _args, context: Context) => {
		return context.prisma.reference_workorder.findMany()
	},
	reference_workorder_by_id: (_parent, args, context: Context) => {
		return context.prisma.reference_workorder.findUnique({
			where: {
				id: args.id
			}
		})
	}
}

const mutations = {
	createReference_workorder: async (_parent, args, context: Context) => {
		try {
			const {
				id,
				kode_tujuan,
				kota_tujuan,
				bulan_tahun,
				tanggal_tahun,
				increment
			} = args.input

			const reference_workorder =
				await context.prisma.reference_workorder.create({
					data: {
						id,
						kode_tujuan,
						kota_tujuan,
						tanggal_tahun,
						bulan_tahun,
						increment
					}
				})

			return {
				code: `200`,
				success: true,
				message: `Successfully create new daftar tujuan`,
				reference_workorder
			}
		} catch (error) {
			console.log(error)
			throw new Error(error)
		}
	},
	updateReference_workorder: async (_parent, args, context: Context) => {
		try {
			const {
				id,
				kode_tujuan,
				kota_tujuan,
				bulan_tahun,
				tanggal_tahun,
				increment
			} = args.input

			let reference_workorder

			reference_workorder = await context.prisma.reference_workorder.update({
				where: { id },
				data: {
					id,
					kode_tujuan,
					kota_tujuan,
					tanggal_tahun,
					bulan_tahun,
					increment
				}
			})

			return {
				code: `200`,
				success: true,
				message: `Successfully update user`,
				reference_workorder
			}
		} catch (error) {
			console.log(error)
			throw new Error(error)
		}
	},
	deleteReference_workorder: async (_parent, args, context: Context) => {
		try {
			const reference_workorder =
				await context.prisma.reference_workorder.delete({
					where: { id: args.id }
				})

			return {
				code: `200`,
				success: true,
				message: `Successfully delete vechnicle`,
				reference_workorder
			}
		} catch (error) {
			console.log(error)
			throw new Error(error)
		}
	}
}

export const resolvers = { queries, mutations }
