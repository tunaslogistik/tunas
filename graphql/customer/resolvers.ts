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

			const customer = await context.prisma.customer.create({
				data: {
					kode_customer,
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
