import moment from "moment"
import { Context } from "../context"

const queries = {
	daftar_invoice: (_parent, _args, context: Context) => {
		return context.prisma.daftar_invoice.findMany()
	}
}

const mutations = {
	createDaftar_invoice: async (_parent, args, context: Context) => {
		console.log(args.input[0].jenis_biaya_tambahan)
		if (
			args.input[0].jenis_biaya_tambahan === null ||
			args.input[0].jenis_biaya_tambahan === `undefined` ||
			args.input[0].jenis_biaya_tambahan === ``
		) {
			try {
				const url = `https://public.accurate.id/accurate/api/sales-invoice/save.do?Scope: sales_invoice_save`
				console.log(args.input.jenis_biaya_tambahan)
				const data = {
					Scope: `sales_invoice_save`,
					//get only 1 pengirim from args.input
					customerNo: args.input[0].pengirim,
					Number: args.input[0].nomor_invoice,
					detailItem: [
						{
							itemNo: args.input[0].accurate,
							unitPrice: args.input[0].harga_surat_jalan
						}
					],
					salesQuotation: {
						number: args.input[0].nomor_ttb
					},
					deliveryOrder: {
						number: args.input[0].nomor_surat_jalan
					},
					transDate: moment(args.input[0].tanggal_invoice).format(`DD/MM/YYYY`),
					branchName: `jakarta`,
					taxAmount: args.input[0].tax,
					description: args.input[0].keterangan
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

				const idInvoice = response.data.r.id

				args.input.id = idInvoice
				const daftar_invoice = await context.prisma.daftar_invoice.createMany({
					data: args.input.map((item) => ({
						id: idInvoice,
						nomor_invoice: item.nomor_invoice,
						nomor_surat_jalan: item.nomor_surat_jalan,
						nomor_ttb: item.nomor_ttb,
						vendor_pelayanan: item.vendor_pelayanan,
						tanggal_invoice: item.tanggal_invoice,
						koli: item.koli,
						volume: item.volume,
						total_koli: item.total_koli,
						harga_surat_jalan: item.harga_surat_jalan,
						total_volume: item.total_volume,
						tanggal_keberangkatan: item.tanggal_keberangkatan,
						nama_kapal: item.nama_kapal,
						nomor_container: item.nomor_container,
						nomor_seal: item.nomor_seal,
						nama_barang: item.nama_barang,
						harga: item.harga,
						harga_biaya_tambahan: item.harga_biaya_tambahan,
						ppn_biaya_tambahan: item.ppn_biaya_tambahan,
						keterangan: item.keterangan,
						accurate: item.accurate,
						pengirim: item.pengirim,
						total_tagihan: item.total_tagihan,
						tax: item.tax,
						subtotal: item.subtotal,
						jenis_biaya_tambahan: item.jenis_biaya_tambahan,
						id_biaya_tambahan: item.id_biaya_tambahan,
						id_biaya_utama: item.id_biaya_utama,
						subtotal_tambahan: item.subtotal_tambahan
					})),

					//data id = response.data.r.id
					skipDuplicates: true
				})
				console.log(`daftar_invoice`, daftar_invoice)
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
		} else {
			try {
				const url = `https://public.accurate.id/accurate/api/sales-invoice/save.do?Scope: sales_invoice_save`
				console.log(args.input.jenis_biaya_tambahan)
				const data = {
					Scope: `sales_invoice_save`,
					//get only 1 pengirim from args.input
					customerNo: args.input[0].pengirim,
					Number: args.input[0].nomor_invoice,
					detailItem: [
						{
							itemNo: args.input[0].accurate,
							unitPrice: args.input[0].harga_surat_jalan
						},
						{
							itemNo: args.input[0].jenis_biaya_tambahan,
							unitPrice: args.input[0].harga_biaya_tambahan
						}
					],
					salesQuotation: {
						number: args.input[0].nomor_ttb
					},
					deliveryOrder: {
						number: args.input[0].nomor_surat_jalan
					},
					transDate: moment(args.input[0].tanggal_invoice).format(`DD/MM/YYYY`),
					branchName: `jakarta`,
					taxAmount: args.input[0].tax,
					description: args.input[0].keterangan
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

				const idInvoice = response.data.r.id

				args.input.id = idInvoice
				const daftar_invoice = await context.prisma.daftar_invoice.createMany({
					data: args.input.map((item) => ({
						id: idInvoice,
						nomor_invoice: item.nomor_invoice,
						nomor_surat_jalan: item.nomor_surat_jalan,
						nomor_ttb: item.nomor_ttb,
						vendor_pelayanan: item.vendor_pelayanan,
						tanggal_invoice: item.tanggal_invoice,
						koli: item.koli,
						volume: item.volume,
						total_koli: item.total_koli,
						harga_surat_jalan: item.harga_surat_jalan,
						total_volume: item.total_volume,
						tanggal_keberangkatan: item.tanggal_keberangkatan,
						nama_kapal: item.nama_kapal,
						nomor_container: item.nomor_container,
						nomor_seal: item.nomor_seal,
						nama_barang: item.nama_barang,
						harga: item.harga,
						harga_biaya_tambahan: item.harga_biaya_tambahan,
						ppn_biaya_tambahan: item.ppn_biaya_tambahan,
						keterangan: item.keterangan,
						accurate: item.accurate,
						pengirim: item.pengirim,
						total_tagihan: item.total_tagihan,
						tax: item.tax,
						subtotal: item.subtotal,
						jenis_biaya_tambahan: item.jenis_biaya_tambahan,
						id_biaya_tambahan: item.id_biaya_tambahan,
						id_biaya_utama: item.id_biaya_utama,
						subtotal_tambahan: item.subtotal_tambahan
					})),

					//data id = response.data.r.id
					skipDuplicates: true
				})
				console.log(`daftar_invoice`, daftar_invoice)
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
		}
	},
	updateDaftar_invoice: async (_parent, args, context: Context) => {
		try {
			const url = `https://public.accurate.id/accurate/api/sales-invoice/save.do?Scope: sales_invoice_save`
			const data = {
				id: args.input[0].id,
				detailItem: [
					{
						id: args.input[0].id_biaya_utama,
						unitPrice: args.input[0].harga_surat_jalan
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
			// console.log(response.data)
			// console.log(data)
			let daftar_invoice
			//map data from args.input update many
			await Promise.all(
				(daftar_invoice = args.input.map(async (input) => {
					return await context.prisma.daftar_invoice.update({
						where: {
							id: input.id
						},
						data: {
							nomor_invoice: input.nomor_invoice,
							nomor_surat_jalan: input.nomor_surat_jalan,
							nomor_ttb: input.nomor_ttb,
							vendor_pelayanan: input.vendor_pelayanan,
							tanggal_invoice: input.tanggal_invoice,
							koli: input.koli,
							volume: input.volume,
							total_koli: input.total_koli,
							harga_surat_jalan: input.harga_surat_jalan,
							total_volume: input.total_volume,
							tanggal_keberangkatan: input.tanggal_keberangkatan,
							nama_kapal: input.nama_kapal,
							nomor_container: input.nomor_container,
							nomor_seal: input.nomor_seal,
							nama_barang: input.nama_barang,
							harga: input.harga,
							harga_biaya_tambahan: input.harga_biaya_tambahan,
							ppn_biaya_tambahan: input.ppn_biaya_tambahan,
							keterangan: input.keterangan,
							accurate: input.accurate,
							pengirim: input.pengirim,
							total_tagihan: input.total_tagihan,
							tax: input.tax,
							subtotal: input.subtotal,
							jenis_biaya_tambahan: input.jenis_biaya_tambahan,
							id_biaya_tambahan: input.id_biaya_tambahan,
							id_biaya_utama: input.id_biaya_utama,
							subtotal_tambahan: input.subtotal_tambahan
						}
					})
				}))
			)

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
