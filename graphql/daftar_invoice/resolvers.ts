import moment from "moment"
import { Context } from "../context"

const queries = {
	daftar_invoice: (_parent, _args, context: Context) => {
		return context.prisma.daftar_invoice.findMany()
	}
}

const mutations = {
	createDaftar_invoice: async (_parent, args, context: Context) => {
		try {
			const {
				id,
				nomor_invoice,
				nomor_surat_jalan,
				nomor_ttb,
				vendor_pelayanan,
				tanggal_invoice,
				koli,
				volume,
				total_koli,
				total_volume,
				tanggal_keberangkatan,
				nama_kapal,
				nomor_container,
				nomor_seal,
				nama_barang,
				harga,
				harga_biaya_tambahan,
				ppn_biaya_tambahan,
				keterangan,
				accurate,
				pengirim,
				total_tagihan,
				tax,
				subtotal,
				subtotal_tambahan
			} = args.input

			//post to api inside header authorization and session axios
			// const token = `Bearer 8b9f1e47-3f48-47bc-87f0-ab9f3aecd515`
			// const session = `22f7af2e-1016-4c26-911f-91dd48b69c3b`

			const url = `https://public.accurate.id/accurate/api/sales-invoice/save.do?Scope: sales_invoice_save`
			const data = {
				Scope: `sales_invoice_save`,
				customerNo: pengirim,
				Number: nomor_invoice,
				detailItem: [
					{
						itemNo: accurate,
						unitPrice: subtotal
					}
				],
				tax1: {
					pphPs4Type: null,
					purchaseTaxGlAccountId: 75,
					rate: 1.0,
					pph23Type: null,
					optLock: 0,
					description: `PPN 1%`,
					salesTaxGlAccountId: 154,
					pph15Type: null,
					id: 100,
					taxCode: `PPN`,
					taxType: `PPN`,
					taxInfo: `PPN 1%`
				},
				salesQuotation: {
					number: nomor_ttb
				},
				deliveryOrder: {
					number: nomor_surat_jalan
				},
				orderDownPaymentNumber: `Test_orderDownPaymentNumber_01`,
				reverseInvoice: `false`,
				taxDate: `31/03/2016`,
				taxNumber: `0`,
				transDate: moment(tanggal_invoice).format(`DD/MM/YYYY`),
				branchName: `jakarta`,
				taxAmount: tax
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
			console.log(accurate)
			console.log(nomor_surat_jalan)

			const idInvoice = response.data.r.id

			const daftar_invoice = await context.prisma.daftar_invoice.create({
				data: {
					id: idInvoice,
					nomor_invoice,
					nomor_surat_jalan,
					nomor_ttb,
					vendor_pelayanan,
					tanggal_invoice,
					nomor_container,
					koli,
					volume,
					total_koli,
					total_volume,
					nama_kapal,
					tanggal_keberangkatan,
					nomor_seal,
					nama_barang,
					harga,
					harga_biaya_tambahan,
					ppn_biaya_tambahan,
					keterangan,
					accurate,
					pengirim,
					total_tagihan,
					tax,
					subtotal,
					subtotal_tambahan
				}
			})

			return {
				code: `200`,
				success: true,
				message: `Successfully create new user`,
				daftar_invoice
			}
		} catch (error) {
			console.log(error)
			throw new Error(error)
		}
	},
	updateDaftar_invoice: async (_parent, args, context: Context) => {
		try {
			const {
				id,
				nomor_invoice,
				nomor_surat_jalan,
				nomor_ttb,
				vendor_pelayanan,
				tanggal_invoice,
				koli,
				volume,
				total_koli,
				total_volume,
				tanggal_keberangkatan,
				nama_kapal,
				nomor_container,
				nomor_seal,
				nama_barang,
				harga,
				harga_biaya_tambahan,
				ppn_biaya_tambahan,
				keterangan,
				accurate,
				pengirim,
				total_tagihan,
				tax,
				subtotal,
				subtotal_tambahan
			} = args.input
			let daftar_invoice

			daftar_invoice = await context.prisma.daftar_invoice.update({
				where: { id },
				data: {
					id,
					nomor_invoice,
					nomor_surat_jalan,
					nomor_ttb,
					vendor_pelayanan,
					tanggal_invoice,
					nomor_container,
					koli,
					volume,
					total_koli,
					total_volume,
					nama_kapal,
					tanggal_keberangkatan,
					nomor_seal,
					nama_barang,
					harga,
					harga_biaya_tambahan,
					ppn_biaya_tambahan,
					keterangan,
					accurate,
					pengirim,
					total_tagihan,
					tax,
					subtotal,
					subtotal_tambahan
				}
			})

			return {
				code: `200`,
				success: true,
				message: `Successfully update user`,
				daftar_invoice
			}
		} catch (error) {
			console.log(error)
			throw new Error(error)
		}
	},

	deleteDaftar_invoice: async (_parent, args, context: Context) => {
		try {
			const daftar_invoice = await context.prisma.daftar_invoice.delete({
				where: { id: args.id }
			})

			return {
				code: `200`,
				success: true,
				message: `Successfully delete vechnicle`,
				daftar_invoice
			}
		} catch (error) {
			console.log(error)
			throw new Error(error)
		}
	}
}

export const resolvers = { queries, mutations }
