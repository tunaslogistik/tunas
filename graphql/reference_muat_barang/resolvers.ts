import { Context } from "../context"

const queries = {
	reference_muat_barang: (_parent, _args, context: Context) => {
		return context.prisma.reference_muat_barang.findMany()
	},
	reference_muat_barang_by_id: (_parent, args, context: Context) => {
		return context.prisma.reference_muat_barang.findUnique({
			where: {
				id: args.id
			}
		})
	}
}

const mutations = {
	createReference_muat_barang: async (_parent, args, context: Context) => {
		try {
			const {
				id,
				kode_tujuan,
				kota_tujuan,
				bulan_tahun,
				tanggal_tahun,
				increment
			} = args.input

			const reference_muat_barang =
				await context.prisma.reference_muat_barang.create({
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
				reference_muat_barang
			}
		} catch (error) {
			console.log(error)
			throw new Error(error)
		}
	},
	updateReference_muat_barang: async (_parent, args, context: Context) => {
		try {
			const {
				id,
				kode_tujuan,
				kota_tujuan,
				bulan_tahun,
				tanggal_tahun,
				increment
			} = args.input

			let reference_muat_barang

			reference_muat_barang = await context.prisma.reference_muat_barang.update(
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
				reference_muat_barang
			}
		} catch (error) {
			console.log(error)
			throw new Error(error)
		}
	},
	deleteReference_muat_barang: async (_parent, args, context: Context) => {
		try {
			const reference_muat_barang =
				await context.prisma.reference_muat_barang.delete({
					where: { id: args.id }
				})

			return {
				code: `200`,
				success: true,
				message: `Successfully delete vechnicle`,
				reference_muat_barang
			}
		} catch (error) {
			console.log(error)
			throw new Error(error)
		}
	}
}

export const resolvers = { queries, mutations }
