import { Context } from "../context"

const queries = {
	daftar_tujuan: (_parent, _args, context: Context) => {
		return context.prisma.daftar_tujuan.findMany()
	}
}

const mutations = {
	createDaftar_tujuan: async (_parent, args, context: Context) => {
		try {
			const { 
				id,
                kode_tujuan,
                nama_tujuan,
                creator    ,
                updated_by ,
			} = args.input

			const daftar_tujuan = await context.prisma.daftar_tujuan.create({
				data: {
					id,
					kode_tujuan,
					nama_tujuan,
					creator    ,
					updated_by ,
				}
			})

			return {
				code: `200`,
				success: true,
				message: `Successfully create new daftar tujuan`,
				daftar_tujuan,
			}
		} catch (error) {
			console.log(error)
			throw new Error(error)
		}
	},
	updateDaftar_tujuan: async (_parent, args, context: Context) => {
		try {
			const {  
				id,
				kode_tujuan,
				nama_tujuan,
				creator    ,
				updated_by ,   } = args.input
			let daftar_tujuan

				daftar_tujuan = await context.prisma.daftar_tujuan.update({
					where: { id},
					data: {    
						id, 
						kode_tujuan,
						nama_tujuan,
						creator    ,
						updated_by ,
					}
				})
				
			return {
				code: `200`,
				success: true,
				message: `Successfully update user`,
				daftar_tujuan
			}
		} catch (error) {
			console.log(error)
			throw new Error(error)
		}
	},
	deleteDaftar_tujuan: async (_parent, args, context: Context) => {
		try {
			const daftar_tujuan = await context.prisma.daftar_tujuan.delete({
				where: { id: args.id }
			})

			return {
				code: `200`,
				success: true,
				message: `Successfully delete vechnicle`,
				daftar_tujuan
			}
		} catch (error) {
			console.log(error)
			throw new Error(error)
		}
	},
}

export const resolvers = { queries, mutations }