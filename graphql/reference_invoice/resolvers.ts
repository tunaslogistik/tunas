import { Context } from "../context"

const queries = {
	reference_invoice: (_parent, _args, context: Context) => {
		return context.prisma.reference_invoice.findMany()
	},
	reference_invoice_by_id: (_parent, args, context: Context) => {
		return context.prisma.reference_invoice.findUnique({
			where: {
				id: args.id
			}
		})
	}
}

const mutations = {
	createReference_invoice: async (_parent, args, context: Context) => {
		try {
			const {
				id,
				kode_tujuan,
				kota_tujuan,
				tanggal_tahun,
				bulan_tahun,
				increment
			} = args.input

			const reference_invoice = await context.prisma.reference_invoice.create({
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
				reference_invoice
			}
		} catch (error) {
			console.log(error)
			throw new Error(error)
		}
	},
	updateReference_invoice: async (_parent, args, context: Context) => {
		try {
			const {
				id,
				kode_tujuan,
				kota_tujuan,
				bulan_tahun,
				tanggal_tahun,
				increment
			} = args.input

			let reference_invoice

			reference_invoice = await context.prisma.reference_invoice.update({
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
				reference_invoice
			}
		} catch (error) {
			console.log(error)
			throw new Error(error)
		}
	},
	deleteReference_invoice: async (_parent, args, context: Context) => {
		try {
			const reference_invoice = await context.prisma.reference_invoice.delete({
				where: { id: args.id }
			})

			return {
				code: `200`,
				success: true,
				message: `Successfully delete vechnicle`,
				reference_invoice
			}
		} catch (error) {
			console.log(error)
			throw new Error(error)
		}
	}
}

export const resolvers = { queries, mutations }
