import { Context } from "../context"

const queries = {
	daftar_biaya_tambahan: (_parent, _args, context: Context) => {
		return context.prisma.daftar_biaya_tambahan.findMany()
	}
}

const mutations = {
	createDaftar_biaya_tambahan: async (_parent, args, context: Context) => {
		try {
			const url = `https://public.accurate.id/accurate/api/sales-invoice/save.do?Scope: sales_invoice_save`
			console.log(args.input.jenis_biaya_tambahan)
			const data = {
				Scope: `sales_invoice_save`,
				id: args.input[0].id,
				detailItem: [
					{
						itemNo: args.input[0].jenis_biaya_tambahan,
						unitPrice: args.input[0].harga_biaya_tambahan
					}
				],
				branchName: `jakarta`
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
			console.log(data)
			const daftar_biaya_tambahan =
				await context.prisma.daftar_biaya_tambahan.createMany({
					data: args.input.map((item) => ({
						nomor_invoice: item.nomor_invoice,
						harga_biaya_tambahan: item.harga_biaya_tambahan,
						jenis_biaya_tambahan: item.jenis_biaya_tambahan,
						id_biaya_tambahan: item.id_biaya_tambahan,
						pengirim: item.pengirim
					})),

					//data id = response.data.r.id
					skipDuplicates: true
				})
			console.log("okay doki")
			return {
				code: `200`,
				success: true,
				message: `Successfully create new user`,
				daftar_biaya_tambahan
			}
		} catch (error) {
			console.log(error)
			throw new Error(error)
		}
	},
	updateDaftar_biaya_tambahan: async (_parent, args, context: Context) => {
		try {
			let daftar_biaya_tambahan
			console.log(args.inputs)
			await Promise.all(
				(daftar_biaya_tambahan = args.input.map(async (input) => {
					return await context.prisma.daftar_biaya_tambahan.updateMany({
						where: {
							nomor_invoice: input.nomor_invoice
						},
						data: {
							nomor_invoice: input.nomor_invoice,
							harga_biaya_tambahan: input.harga_biaya_tambahan,
							jenis_biaya_tambahan: input.jenis_biaya_tambahan,
							id_biaya_tambahan: input.id_biaya_tambahan,
							pengirim: input.pengirim
						}
					})
				}))
			)
			const url = `https://public.accurate.id/accurate/api/sales-invoice/save.do?Scope: sales_invoice_save`
			console.log(`args.input[0].id`, args.input[0].id)
			const data = {
				scope: `sales_invoice_save`,
				id: args.input[0].id,
				nomor_invoice: args.input[0].nomor_invoice,
				detailItem: [
					{
						itemNo: args.input[0].jenis_biaya_tambahan,
						id: args.input[0].id_biaya_tambahan,
						unitPrice: args.input[0].harga_biaya_tambahan
					}
				],
				branchName: `jakarta`
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
			console.log(data)

			return {
				code: `200`,
				success: true,
				message: `Successfully update user`,
				daftar_biaya_tambahan
			}
		} catch (error) {
			console.log(error)
			throw new Error(error)
		}
	},

	deleteDaftar_biaya_tambahan: async (_parent, args, context: Context) => {
		try {
			const daftar_biaya_tambahan =
				await context.prisma.daftar_biaya_tambahan.delete({
					where: { id: args.id }
				})

			return {
				code: `200`,
				success: true,
				message: `Successfully delete vechnicle`,
				daftar_biaya_tambahan
			}
		} catch (error) {
			console.log(error)
			throw new Error(error)
		}
	}
}

export const resolvers = { queries, mutations }
