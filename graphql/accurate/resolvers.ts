import { Context } from "../context"

const queries = {
	accurate: (_parent, _args, context: Context) => {
		return context.prisma.accurate.findMany()
	}
}

const mutations = {
	createAccurate: async (_parent, args, context: Context) => {
		try {
			const {
				id,
				nama_barang,
				kode_barang,
				akun_penjualan,
				jenis,
				salesDiscountGlAccountId,
				salesGlAccountId,
				inventoryGlAccountId,
				percentTaxable,
				taxName
			} = args.input

			const url = `https://public.accurate.id/accurate/api/item/save.do?Scope: item_save`
			const data = {
				name: nama_barang,
				itemType: `SERVICE`,
				salesDiscountGlAccountId: `60`,
				salesGlAccountId: akun_penjualan,
				inventoryGlAccountId: `233`,
				itemCategoryId: `51`,
				tax1Name: taxName
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

			const itemNo = response.data.r.no

			const idB = response.data.r.id

			const accurate = await context.prisma.accurate.create({
				data: {
					id: idB,
					nama_barang,
					kode_barang: itemNo,
					akun_penjualan,
					jenis,
					salesDiscountGlAccountId,
					salesGlAccountId,
					inventoryGlAccountId,
					percentTaxable,
					taxName
				}
			})

			return {
				code: `200`,
				success: true,
				message: `Successfully created`,
				accurate
			}
		} catch (error) {
			console.log(error)
			throw new Error(error)
		}
	},
	updateAccurate: async (_parent, args, context: Context) => {
		try {
			const {
				id,
				nama_barang,
				kode_barang,
				jenis,
				salesDiscountGlAccountId,
				akun_penjualan,
				salesGlAccountId,
				inventoryGlAccountId,
				percentTaxable,
				taxName
			} = args.input
			const accurate = await context.prisma.accurate.upsert({
				where: {
					id
				},
				update: {
					id,
					nama_barang,
					kode_barang,
					jenis,
					akun_penjualan,
					salesDiscountGlAccountId,
					salesGlAccountId,
					inventoryGlAccountId,
					percentTaxable,
					taxName
				},
				create: {
					id,
					nama_barang,
					kode_barang,
					jenis,
					akun_penjualan,
					salesDiscountGlAccountId,
					salesGlAccountId,
					inventoryGlAccountId,
					percentTaxable,
					taxName
				}
			})

			return {
				code: `200`,
				success: true,
				message: `Successfully update daftar_harga`,
				accurate
			}
		} catch (error) {
			console.log(error)
			throw new Error(error)
		}
	},

	deleteAccurate: async (_parent, args, context: Context) => {
		try {
			const accurate = await context.prisma.accurate.delete({
				where: { id: args.id }
			})

			const url = `https://public.accurate.id/accurate/api/item/delete.do?Scope: item_delete`
			const data = {
				id: args.id
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

			return {
				code: `200`,
				success: true,
				message: `Successfully deleted`,
				accurate
			}
		} catch (error) {
			console.log(error)
			throw new Error(error)
		}
	}
}

export const resolvers = { queries, mutations }
