import { Context } from "../context"

const queries = {
	daftar_harga: (_parent, _args, context: Context) => {
		return context.prisma.daftar_harga.findMany()
	}
}

const mutations = {
	createDaftar_harga: async (_parent, args, context: Context) => {
		try {
			const {
				kode_asal,
				kode,
				kode_tujuan,
				jenis_pengiriman,
				harga,
				minimal_kubik,
				creator,
				updated_by
			} = args.input

			const daftar_harga = await context.prisma.daftar_harga.create({
				data: {
					kode_asal,
					kode,
					kode_tujuan,
					jenis_pengiriman,
					harga,
					minimal_kubik,
					creator,
					updated_by
				}
			})

			return {
				code: `200`,
				success: true,
				message: `Successfully create new user`,
				daftar_harga
			}
		} catch (error) {
			console.log(error)
			throw new Error(error)
		}
	},
	// make delete daftar_harga and then create new daftar_harga
	updateDaftar_harga: async (_parent, args, context: Context) => {
		try {
			const {
				id,
				kode_asal,
				kode,
				kode_tujuan,
				jenis_pengiriman,
				harga,
				minimal_kubik,
				creator,
				updated_by
			} = args.input
			const daftar_harga = await context.prisma.daftar_harga.upsert({
				where: {
					id
				},
				update: {
					id,
					kode_asal,
					kode,
					kode_tujuan,
					jenis_pengiriman,
					harga,
					minimal_kubik,
					creator,
					updated_by
				},
				create: {
					kode_asal,
					kode,
					kode_tujuan,
					jenis_pengiriman,
					harga,
					minimal_kubik,
					creator,
					updated_by
				}
			})

			return {
				code: `200`,
				success: true,
				message: `Successfully update daftar_harga`,
				daftar_harga
			}
		} catch (error) {
			console.log(error)
			throw new Error(error)
		}
	},

	deleteDaftar_harga: async (_parent, args, context: Context) => {
		try {
			const daftar_harga = await context.prisma.daftar_harga.delete({
				where: { id: args.id }
			})

			return {
				code: `200`,
				success: true,
				message: `Successfully delete vechnicle`,
				daftar_harga
			}
		} catch (error) {
			console.log(error)
			throw new Error(error)
		}
	}
}

export const resolvers = { queries, mutations }
