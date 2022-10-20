import { Context } from "../context"

const queries = {
	daftar_invoice: (_parent, _args, context: Context) => {
		return context.prisma.daftar_invoice.findMany()
	}
}

const mutations = {
	createDaftar_invoice: async (_parent, args, context: Context) => {
		try {
			const {
				id,
				nomor_invoice,
				nomor_surat_jalan,
				nomor_ttb,
				vendor_pelayanan,
				tanggal_invoice,
				koli,
				volume,
				total_koli,
				total_volume,
				tanggal_keberangkatan,
				nama_kapal,
				nomor_container,
				nomor_seal,
				keterangan
			} = args.input

			const daftar_invoice = await context.prisma.daftar_invoice.create({
				data: {
					id,
					nomor_invoice,
					nomor_surat_jalan,
					nomor_ttb,
					vendor_pelayanan,
					tanggal_invoice,
					nomor_container,
					koli,
					volume,
					total_koli,
					total_volume,
					nama_kapal,
					tanggal_keberangkatan,
					nomor_seal,
					keterangan
				}
			})

			return {
				code: `200`,
				success: true,
				message: `Successfully create new user`,
				daftar_invoice
			}
		} catch (error) {
			console.log(error)
			throw new Error(error)
		}
	},
	updateDaftar_invoice: async (_parent, args, context: Context) => {
		try {
			const {
				id,
				nomor_invoice,
				nomor_surat_jalan,
				nomor_ttb,
				vendor_pelayanan,
				tanggal_invoice,
				koli,
				volume,
				total_koli,
				total_volume,
				tanggal_keberangkatan,
				nama_kapal,
				nomor_container,
				nomor_seal,
				keterangan
			} = args.input
			let daftar_invoice

			daftar_invoice = await context.prisma.daftar_invoice.update({
				where: { id },
				data: {
					id,
					nomor_invoice,
					nomor_surat_jalan,
					nomor_ttb,
					vendor_pelayanan,
					tanggal_invoice,
					nomor_container,
					koli,
					volume,
					total_koli,
					total_volume,
					nama_kapal,
					tanggal_keberangkatan,
					nomor_seal,
					keterangan
				}
			})

			return {
				code: `200`,
				success: true,
				message: `Successfully update user`,
				daftar_invoice
			}
		} catch (error) {
			console.log(error)
			throw new Error(error)
		}
	},

	deleteDaftar_invoice: async (_parent, args, context: Context) => {
		try {
			const daftar_invoice = await context.prisma.daftar_invoice.delete({
				where: { id: args.id }
			})

			return {
				code: `200`,
				success: true,
				message: `Successfully delete vechnicle`,
				daftar_invoice
			}
		} catch (error) {
			console.log(error)
			throw new Error(error)
		}
	}
}

export const resolvers = { queries, mutations }
