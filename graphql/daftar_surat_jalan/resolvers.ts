import { Context } from "../context"

const queries = {
	daftar_surat_jalan: (_parent, _args, context: Context) => {
		return context.prisma.daftar_surat_jalan.findMany()
	}
}

const mutations = {
	createDaftar_surat_jalan: async (_parent, args, context: Context) => {
		try {
			const {
				id,
				nomor_surat_jalan,
				nomor_ttb,
				vendor_pelayanan,
				tanggal_surat_jalan,
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

			const daftar_surat_jalan = await context.prisma.daftar_surat_jalan.create(
				{
					data: {
						id,
						nomor_surat_jalan,
						nomor_ttb,
						vendor_pelayanan,
						tanggal_surat_jalan,
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
				}
			)

			return {
				code: `200`,
				success: true,
				message: `Successfully create new user`,
				daftar_surat_jalan
			}
		} catch (error) {
			console.log(error)
			throw new Error(error)
		}
	},
	updateDaftar_surat_jalan: async (_parent, args, context: Context) => {
		try {
			const {
				id,
				nomor_surat_jalan,
				nomor_ttb,
				vendor_pelayanan,
				tanggal_surat_jalan,
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
			let daftar_surat_jalan

			daftar_surat_jalan = await context.prisma.daftar_surat_jalan.update({
				where: { id },
				data: {
					id,
					nomor_surat_jalan,
					nomor_ttb,
					vendor_pelayanan,
					tanggal_surat_jalan,
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
				daftar_surat_jalan
			}
		} catch (error) {
			console.log(error)
			throw new Error(error)
		}
	},

	deleteDaftar_surat_jalan: async (_parent, args, context: Context) => {
		try {
			const daftar_surat_jalan = await context.prisma.daftar_surat_jalan.delete(
				{
					where: { id: args.id }
				}
			)

			return {
				code: `200`,
				success: true,
				message: `Successfully delete vechnicle`,
				daftar_surat_jalan
			}
		} catch (error) {
			console.log(error)
			throw new Error(error)
		}
	}
}

export const resolvers = { queries, mutations }
