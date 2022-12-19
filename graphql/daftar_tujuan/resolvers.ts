import { Context } from "../context"

const queries = {
	daftar_tujuan: (_parent, _args, context: Context) => {
		return context.prisma.daftar_tujuan.findMany()
	},
	daftar_tujuan_by_id: (_parent, args, context: Context) => {
		return context.prisma.daftar_tujuan.findUnique({
			where: {
				id: args.id
			}
		})
	}
}

const mutations = {
	createDaftar_tujuan: async (_parent, args, context: Context) => {
		try {
			const { id, kode_tujuan, nama_tujuan, creator, updated_by } = args.input
			const url = `https://public.accurate.id/accurate/api/department/save.do?Scope: department_save`
			const data = {
				scope: `department_save`,
				name: nama_tujuan,
				description: nama_tujuan
			}
			// make POST FUNCTION  axios
			const axios = require(`axios`)
			const response = await axios.post(url, data, {
				headers: {
					Authorization: `Bearer 8b9f1e47-3f48-47bc-87f0-ab9f3aecd515`,
					"X-Session-ID": `22f7af2e-1016-4c26-911f-91dd48b69c3b`
				}
			})
			console.log(response.data)
			const daftar_tujuan = await context.prisma.daftar_tujuan.create({
				data: {
					id: response.data.s ? response.data.r.id : id,
					kode_tujuan,
					nama_tujuan,
					creator,
					updated_by
				}
			})

			return {
				code: `200`,
				success: true,
				message: `Successfully create new daftar tujuan`,
				daftar_tujuan
			}
		} catch (error) {
			console.log(error)
			throw new Error(error)
		}
	},
	updateDaftar_tujuan: async (_parent, args, context: Context) => {
		try {
			const { id, kode_tujuan, nama_tujuan, creator, updated_by } = args.input
			let daftar_tujuan

			const url = `https://public.accurate.id/accurate/api/department/save.do?Scope: department_save`
			const data = {
				scope: `department_save`,
				id: id,
				name: nama_tujuan,
				description: nama_tujuan
			}
			// make POST FUNCTION  axios
			const axios = require(`axios`)
			const response = await axios.post(url, data, {
				headers: {
					Authorization: `Bearer 8b9f1e47-3f48-47bc-87f0-ab9f3aecd515`,
					"X-Session-ID": `22f7af2e-1016-4c26-911f-91dd48b69c3b`
				}
			})
			console.log(response.data)

			const idB = response.data.r.id

			daftar_tujuan = await context.prisma.daftar_tujuan.update({
				where: { id },
				data: {
					id: idB,
					kode_tujuan,
					nama_tujuan,
					creator,
					updated_by
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
	}
}

export const resolvers = { queries, mutations }
