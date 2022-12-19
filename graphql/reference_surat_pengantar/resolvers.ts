import { Context } from "../context"

const queries = {
	reference_surat_pengantar: (_parent, _args, context: Context) => {
		return context.prisma.reference_surat_pengantar.findMany()
	},
	reference_surat_pengantar_by_id: (_parent, args, context: Context) => {
		return context.prisma.reference_surat_pengantar.findUnique({
			where: {
				id: args.id
			}
		})
	}
}

const mutations = {
	createReference_surat_pengantar: async (_parent, args, context: Context) => {
		try {
			const {
				id,
				kode_tujuan,
				kota_tujuan,
				bulan_tahun,
				tanggal_tahun,
				increment
			} = args.input

			const reference_surat_pengantar =
				await context.prisma.reference_surat_pengantar.create({
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
				reference_surat_pengantar
			}
		} catch (error) {
			console.log(error)
			throw new Error(error)
		}
	},
	updateReference_surat_pengantar: async (_parent, args, context: Context) => {
		try {
			const {
				id,
				kode_tujuan,
				kota_tujuan,
				bulan_tahun,
				tanggal_tahun,
				increment
			} = args.input

			let reference_surat_pengantar

			reference_surat_pengantar =
				await context.prisma.reference_surat_pengantar.update({
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
				reference_surat_pengantar
			}
		} catch (error) {
			console.log(error)
			throw new Error(error)
		}
	},
	deleteReference_surat_pengantar: async (_parent, args, context: Context) => {
		try {
			const reference_surat_pengantar =
				await context.prisma.reference_surat_pengantar.delete({
					where: { id: args.id }
				})

			return {
				code: `200`,
				success: true,
				message: `Successfully delete vechnicle`,
				reference_surat_pengantar
			}
		} catch (error) {
			console.log(error)
			throw new Error(error)
		}
	}
}

export const resolvers = { queries, mutations }
