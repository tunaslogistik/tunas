import { Context } from "../context"

const queries = {
	pengaturan: (_parent, _args, context: Context) => {
		return context.prisma.pengaturan.findMany()
	}
}

const mutations = {
	createPengaturan: async (_parent, args, context: Context) => {
		try {
			const {
				id,
				nama_pt,
				alamat,
				email,
				telepon,
				fax,
				bank,
				nama_rekening,
				no_rekening
			} = args.input

			const pengaturan = await context.prisma.pengaturan.create({
				data: {
					id,
					nama_pt,
					alamat,
					email,
					telepon,
					fax,
					bank,
					nama_rekening,
					no_rekening
				}
			})

			return {
				code: `200`,
				success: true,
				message: `Successfully created`,
				pengaturan
			}
		} catch (error) {
			console.log(error)
			throw new Error(error)
		}
	},
	updatePengaturan: async (_parent, args, context: Context) => {
		try {
			const {
				id,
				nama_pt,
				alamat,
				email,
				telepon,
				fax,
				bank,
				nama_rekening,
				no_rekening
			} = args.input
			const pengaturan = await context.prisma.pengaturan.upsert({
				where: {
					id
				},
				update: {
					id,
					nama_pt,
					alamat,
					email,
					telepon,
					fax,
					bank,
					nama_rekening,
					no_rekening
				},
				create: {
					id,
					nama_pt,
					alamat,
					email,
					telepon,
					fax,
					bank,
					nama_rekening,
					no_rekening
				}
			})

			return {
				code: `200`,
				success: true,
				message: `Successfully update daftar_harga`,
				pengaturan
			}
		} catch (error) {
			console.log(error)
			throw new Error(error)
		}
	},

	deletePengaturan: async (_parent, args, context: Context) => {
		try {
			const pengaturan = await context.prisma.pengaturan.delete({
				where: { id: args.id }
			})

			return {
				code: `200`,
				success: true,
				message: `Successfully deleted`,
				pengaturan
			}
		} catch (error) {
			console.log(error)
			throw new Error(error)
		}
	}
}

export const resolvers = { queries, mutations }
