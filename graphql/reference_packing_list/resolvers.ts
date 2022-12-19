import { Context } from "../context"

const queries = {
	reference_packing_list: (_parent, _args, context: Context) => {
		return context.prisma.reference_packing_list.findMany()
	},
	reference_packing_list_by_id: (_parent, args, context: Context) => {
		return context.prisma.reference_packing_list.findUnique({
			where: {
				id: args.id
			}
		})
	}
}

const mutations = {
	createReference_packing_list: async (_parent, args, context: Context) => {
		try {
			const {
				id,
				kode_tujuan,
				kota_tujuan,
				bulan_tahun,
				tanggal_tahun,
				increment
			} = args.input

			const reference_packing_list =
				await context.prisma.reference_packing_list.create({
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
				reference_packing_list
			}
		} catch (error) {
			console.log(error)
			throw new Error(error)
		}
	},
	updateReference_packing_list: async (_parent, args, context: Context) => {
		try {
			const {
				id,
				kode_tujuan,
				kota_tujuan,
				bulan_tahun,
				tanggal_tahun,
				increment
			} = args.input

			let reference_packing_list

			reference_packing_list =
				await context.prisma.reference_packing_list.update({
					where: { id },
					data: {
						id,
						kode_tujuan,
						kota_tujuan,
						bulan_tahun,
						tanggal_tahun,
						increment
					}
				})

			return {
				code: `200`,
				success: true,
				message: `Successfully update user`,
				reference_packing_list
			}
		} catch (error) {
			console.log(error)
			throw new Error(error)
		}
	},
	deleteReference_packing_list: async (_parent, args, context: Context) => {
		try {
			const reference_packing_list =
				await context.prisma.reference_packing_list.delete({
					where: { id: args.id }
				})

			return {
				code: `200`,
				success: true,
				message: `Successfully delete vechnicle`,
				reference_packing_list
			}
		} catch (error) {
			console.log(error)
			throw new Error(error)
		}
	}
}

export const resolvers = { queries, mutations }
