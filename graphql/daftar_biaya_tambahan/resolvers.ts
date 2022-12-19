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

			// get detail  from response.data.r.detailItem: [ [Object], [Object] ],

			//make the object visible in console.log
			console.log(`detail`, response.data.r.detailItem)

			console.log(`id 1`, response.data.r.detailItem[0].id)
			console.log(`id 2`, response.data.r.detailItem[1].id)

			const daftar_biaya_tambahan =
				await context.prisma.daftar_biaya_tambahan.createMany({
					data: args.input.map((item) => ({
						nomor_invoice: item.nomor_invoice,
						harga_biaya_tambahan: item.harga_biaya_tambahan,
						jenis_biaya_tambahan: item.jenis_biaya_tambahan,
						id_biaya_tambahan: String(response.data.r.detailItem[1].id),
						pengirim: item.pengirim
					})),

					//data id = response.data.r.id
					skipDuplicates: true
				})
			console.log(`okay doki`, daftar_biaya_tambahan)
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
			const url = `https://public.accurate.id/accurate/api/sales-invoice/save.do?Scope: sales_invoice_save`
			console.log(`args.input[0].id`, args.input[0].id)
			const data = {
				scope: `sales_invoice_save`,
				id: args.input[0].id,
				detailItem: [
					{
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
