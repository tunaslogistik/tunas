import { Context } from "../context"

const queries = {
	reference_ttb: (_parent, _args, context: Context) => {
		return context.prisma.reference_ttb.findMany()
	},
	reference_ttb_by_id: (_parent, args, context: Context) => {
		return context.prisma.reference_ttb.findUnique({
			where: {
				id: args.id
			}
		})
	}
}

const mutations = {
	createReference_ttb: async (_parent, args, context: Context) => {
		try {
			const {
				id,
				kode_tujuan,
				kota_tujuan,
				bulan_tahun,
				tanggal_tahun,
				increment
			} = args.input

			const reference_ttb = await context.prisma.reference_ttb.create({
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
				reference_ttb
			}
		} catch (error) {
			console.log(error)
			throw new Error(error)
		}
	},
	updateReference_ttb: async (_parent, args, context: Context) => {
		try {
			const {
				id,
				kode_tujuan,
				kota_tujuan,
				bulan_tahun,
				tanggal_tahun,
				increment
			} = args.input

			let reference_ttb

			reference_ttb = await context.prisma.reference_ttb.update({
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
				reference_ttb
			}
		} catch (error) {
			console.log(error)
			throw new Error(error)
		}
	},
	deleteReference_ttb: async (_parent, args, context: Context) => {
		try {
			const reference_ttb = await context.prisma.reference_ttb.delete({
				where: { id: args.id }
			})

			return {
				code: `200`,
				success: true,
				message: `Successfully delete vechnicle`,
				reference_ttb
			}
		} catch (error) {
			console.log(error)
			throw new Error(error)
		}
	}
}

export const resolvers = { queries, mutations }
