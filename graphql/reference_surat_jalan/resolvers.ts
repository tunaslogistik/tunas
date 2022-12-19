import { Context } from "../context"

const queries = {
	reference_surat_jalan: (_parent, _args, context: Context) => {
		return context.prisma.reference_surat_jalan.findMany()
	},
	reference_surat_jalan_by_id: (_parent, args, context: Context) => {
		return context.prisma.reference_surat_jalan.findUnique({
			where: {
				id: args.id
			}
		})
	}
}

const mutations = {
	createReference_surat_jalan: async (_parent, args, context: Context) => {
		try {
			const {
				id,
				kode_tujuan,
				kota_tujuan,
				tanggal_tahun,
				bulan_tahun,
				increment
			} = args.input

			const reference_surat_jalan =
				await context.prisma.reference_surat_jalan.create({
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
				reference_surat_jalan
			}
		} catch (error) {
			console.log(error)
			throw new Error(error)
		}
	},
	updateReference_surat_jalan: async (_parent, args, context: Context) => {
		try {
			const {
				id,
				kode_tujuan,
				kota_tujuan,
				bulan_tahun,
				tanggal_tahun,
				increment
			} = args.input

			let reference_surat_jalan

			reference_surat_jalan = await context.prisma.reference_surat_jalan.update(
				{
					where: { id },
					data: {
						id,
						kode_tujuan,
						kota_tujuan,
						tanggal_tahun,
						bulan_tahun,
						increment
					}
				}
			)

			return {
				code: `200`,
				success: true,
				message: `Successfully update user`,
				reference_surat_jalan
			}
		} catch (error) {
			console.log(error)
			throw new Error(error)
		}
	},
	deleteReference_surat_jalan: async (_parent, args, context: Context) => {
		try {
			const reference_surat_jalan =
				await context.prisma.reference_surat_jalan.delete({
					where: { id: args.id }
				})

			return {
				code: `200`,
				success: true,
				message: `Successfully delete vechnicle`,
				reference_surat_jalan
			}
		} catch (error) {
			console.log(error)
			throw new Error(error)
		}
	}
}

export const resolvers = { queries, mutations }
