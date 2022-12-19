import { Context } from "../context"

const queries = {
	reference_sales_order: (_parent, _args, context: Context) => {
		return context.prisma.reference_sales_order.findMany()
	},
	reference_sales_order_by_id: (_parent, args, context: Context) => {
		return context.prisma.reference_sales_order.findUnique({
			where: {
				id: args.id
			}
		})
	}
}

const mutations = {
	createReference_sales_order: async (_parent, args, context: Context) => {
		try {
			const {
				id,
				kode_tujuan,
				kota_tujuan,
				bulan_tahun,
				tanggal_tahun,
				increment
			} = args.input

			const reference_sales_order =
				await context.prisma.reference_sales_order.create({
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
				reference_sales_order
			}
		} catch (error) {
			console.log(error)
			throw new Error(error)
		}
	},
	updateReference_sales_order: async (_parent, args, context: Context) => {
		try {
			const {
				id,
				kode_tujuan,
				kota_tujuan,
				bulan_tahun,
				tanggal_tahun,
				increment
			} = args.input

			let reference_sales_order

			reference_sales_order = await context.prisma.reference_sales_order.update(
				{
					where: { id },
					data: {
						id,
						kode_tujuan,
						kota_tujuan,
						bulan_tahun,
						tanggal_tahun,
						increment
					}
				}
			)

			return {
				code: `200`,
				success: true,
				message: `Successfully update user`,
				reference_sales_order
			}
		} catch (error) {
			console.log(error)
			throw new Error(error)
		}
	},
	deleteReference_sales_order: async (_parent, args, context: Context) => {
		try {
			const reference_sales_order =
				await context.prisma.reference_sales_order.delete({
					where: { id: args.id }
				})

			return {
				code: `200`,
				success: true,
				message: `Successfully delete vechnicle`,
				reference_sales_order
			}
		} catch (error) {
			console.log(error)
			throw new Error(error)
		}
	}
}

export const resolvers = { queries, mutations }
