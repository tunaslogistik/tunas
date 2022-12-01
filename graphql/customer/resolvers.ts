import { Context } from "../context"

const queries = {
	customer: (_parent, _args, context: Context) => {
		return context.prisma.customer.findMany()
	}
}

const mutations = {
	createCustomer: async (_parent, args, context: Context) => {
		try {
			const {
				kode_customer,
				idPelanggan,
				nama_customer,
				alamat,
				telepon,
				npwp,
				pic,
				term_payment,
				tipe_ppn,
				status,
				last_update,
				creator,
				updated_by
			} = args.input

			const url = `https://public.accurate.id/accurate/api/customer/save.do?Scope: customer_save`
			const data = {
				name: nama_customer,
				billStreet: alamat,
				detailContact: [
					{
						name: nama_customer,
						workPhone: telepon,
						homePhone: telepon,
						mobilePhone: telepon
					}
				]
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

			const customerNo = response.data.r.customerNo
			console.log(`itemNo`, customerNo)

			const customer = await context.prisma.customer.create({
				data: {
					kode_customer,
					idPelanggan: customerNo,
					nama_customer,
					alamat,
					telepon,
					npwp,
					pic,
					term_payment,
					tipe_ppn,
					status,
					last_update,
					creator,
					updated_by
				}
			})

			return {
				code: `200`,
				success: true,
				message: `Successfully create new user`,
				customer
			}
		} catch (error) {
			console.log(error)
			throw new Error(error)
		}
	},
	updateCustomer: async (_parent, args, context: Context) => {
		try {
			const {
				id,
				idPelanggan,
				kode_customer,
				nama_customer,
				alamat,
				telepon,
				npwp,
				pic,
				tipe_ppn,
				status,
				term_payment,
				last_update,
				creator,
				updated_by
			} = args.input
			let customer

			customer = await context.prisma.customer.update({
				where: { id },
				data: {
					id,
					idPelanggan,
					kode_customer,
					nama_customer,
					alamat,
					telepon,
					npwp,
					term_payment,
					pic,
					tipe_ppn,
					status,
					last_update,
					creator,
					updated_by
				}
			})

			return {
				code: `200`,
				success: true,
				message: `Successfully update user`,
				customer
			}
		} catch (error) {
			console.log(error)
			throw new Error(error)
		}
	},
	deleteCustomer: async (_parent, args, context: Context) => {
		try {
			const customer = await context.prisma.customer.delete({
				where: { id: args.id }
			})

			return {
				code: `200`,
				success: true,
				message: `Successfully delete vechnicle`,
				customer
			}
		} catch (error) {
			console.log(error)
			throw new Error(error)
		}
	}
}

export const resolvers = { queries, mutations }
