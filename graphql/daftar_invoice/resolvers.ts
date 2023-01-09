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
			console.log(`args`, args)
			const url = `https://public.accurate.id/accurate/api/sales-invoice/save.do?Scope: sales_invoice_save`
			const data = {
				Scope: `sales_invoice_save`,
				customerNo: args.input[0].pengirim,
				Number: args.input[0].nomor_invoice,
				detailItem: [
					{
						itemNo: args.input[0].accurate,
						unitPrice: args.input[0].harga_surat_jalan,
						departmentName: args.input[0].kota_tujuan,
						useTax2: String(true),
						useTax1: String(true),
						useTax3: String(true)
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
				description: args.input[0].ketbiaya_tambahan_ppnerangan
			}

			//split args.input.jenis_biaya_tambahan by ,
			const jenis_biaya_tambahan = args.input[0].itemNo_join.split(`,`)

			console.log(`jenis_biaya_tambahan`, jenis_biaya_tambahan)

			//for jenis_biaya_tambahan.length if false then value = args.input[0].biaya_tambahan_non_ppn else biaya_tambahan_ppn
			for (let i = 0; i < jenis_biaya_tambahan.length; i++) {
				if (jenis_biaya_tambahan[i] === ``) {
					jenis_biaya_tambahan[i] = args.input[0].biaya_tambahan_non_ppn
				} else {
					jenis_biaya_tambahan[i] = args.input[0].biaya_tambahan_ppn
				}
			}

			console.log(`jenis_biaya_tambahan`, jenis_biaya_tambahan)

			//split harga by ,
			const harga = args.input[0].biaya_tambahan_join.split(`,`)

			const departmentName = args.input[0].kota_tujuan

			//for jenis_biaya_tambahan.length push to data.detailItem
			for (let i = 0; i < harga.length; i++) {
				//if jenis_biaya_tambahan[i] !== "" push to data.detailItem
				if (harga[i] !== ``) {
					data.detailItem.push({
						//if jenis_biaya_tambahan[i] !== true itemNo = args.input[0].biaya_tambahan_non_ppn else biaya_tambahan_ppn
						itemNo: jenis_biaya_tambahan[i],
						unitPrice: harga[i],
						departmentName,
						useTax1:
							jenis_biaya_tambahan[i] !== args.input[0].biaya_tambahan_ppn
								? `false`
								: `true`,
						useTax2:
							jenis_biaya_tambahan[i] !== args.input[0].biaya_tambahan_ppn
								? `false`
								: `true`,
						useTax3:
							jenis_biaya_tambahan[i] !== args.input[0].biaya_tambahan_ppn
								? `false`
								: `true`
					})
				}
			}

			// make POST FUNCTION  axios
			const axios = require(`axios`)
			const response = await axios.post(url, data, {
				headers: {
					Authorization: `Bearer 8b9f1e47-3f48-47bc-87f0-ab9f3aecd515`,
					"X-Session-ID": `22f7af2e-1016-4c26-911f-91dd48b69c3b`
				}
			})

			console.log(`data`, data)

			console.log(response.data)

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
					id_biaya_utama: String(response.data.r.detailItem[0].id),
					subtotal_tambahan: item.subtotal_tambahan,
					biaya_tambahan_sales: item.biaya_tambahan_sales,
					itemNo_sales_order: item.itemNo_sales_order,
					biaya_tambahan_join: item.biaya_tambahan_join,
					itemNo_join: item.itemNo_join,
					nama_barang_join: item.nama_barang_join,
					kota_tujuan: item.kota_tujuan,
					biaya_tambahan_ppn: item.biaya_tambahan_ppn,
					biaya_tambahan_non_ppn: item.biaya_tambahan_non_ppn
				})),

				//data id = response.data.r.id
				skipDuplicates: true
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
			const url = `https://public.accurate.id/accurate/api/sales-invoice/save.do?Scope: sales_invoice_save`
			const data = {
				Scope: `sales_invoice_save`,
				customerNo: args.input[0].pengirim,
				Number: args.input[0].nomor_invoice,
				detailItem: [
					{
						itemNo: args.input[0].accurate,
						unitPrice: args.input[0].harga_surat_jalan,
						departmentName: args.input[0].kota_tujuan,
						useTax2: String(true),
						useTax1: String(true),
						useTax3: String(true)
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
				description: args.input[0].ketbiaya_tambahan_ppnerangan
			}

			//split args.input.jenis_biaya_tambahan by ,
			const jenis_biaya_tambahan = args.input[0].itemNo_join.split(`,`)

			console.log(`jenis_biaya_tambahan`, jenis_biaya_tambahan)

			//for jenis_biaya_tambahan.length if false then value = args.input[0].biaya_tambahan_non_ppn else biaya_tambahan_ppn
			for (let i = 0; i < jenis_biaya_tambahan.length; i++) {
				if (jenis_biaya_tambahan[i] === ``) {
					jenis_biaya_tambahan[i] = args.input[0].biaya_tambahan_non_ppn
				} else {
					jenis_biaya_tambahan[i] = args.input[0].biaya_tambahan_ppn
				}
			}

			console.log(`jenis_biaya_tambahan`, jenis_biaya_tambahan)

			//split harga by ,
			const harga = args.input[0].biaya_tambahan_join.split(`,`)

			const departmentName = args.input[0].kota_tujuan

			//for jenis_biaya_tambahan.length push to data.detailItem
			for (let i = 0; i < harga.length; i++) {
				//if jenis_biaya_tambahan[i] !== "" push to data.detailItem
				if (harga[i] !== ``) {
					data.detailItem.push({
						//if jenis_biaya_tambahan[i] !== true itemNo = args.input[0].biaya_tambahan_non_ppn else biaya_tambahan_ppn
						itemNo: jenis_biaya_tambahan[i],
						unitPrice: harga[i],
						departmentName,
						useTax1:
							jenis_biaya_tambahan[i] !== args.input[0].biaya_tambahan_ppn
								? `false`
								: `true`,
						useTax2:
							jenis_biaya_tambahan[i] !== args.input[0].biaya_tambahan_ppn
								? `false`
								: `true`,
						useTax3:
							jenis_biaya_tambahan[i] !== args.input[0].biaya_tambahan_ppn
								? `false`
								: `true`
					})
				}
			}

			// make POST FUNCTION  axios
			const axios = require(`axios`)
			const response = await axios.post(url, data, {
				headers: {
					Authorization: `Bearer 8b9f1e47-3f48-47bc-87f0-ab9f3aecd515`,
					"X-Session-ID": `22f7af2e-1016-4c26-911f-91dd48b69c3b`
				}
			})

			console.log(`data`, data)

			console.log(response.data)

			const idInvoice = response.data.r.id

			// console.log(response.data)
			// console.log(data)
			let daftar_invoice
			//map data from args.input update many

			console.log(`id invoices`, args.input[0].id)
			await Promise.all(
				(daftar_invoice = args.input.map(async (input) => {
					return await context.prisma.daftar_invoice.update({
						where: {
							id: args.input[0].id
						},
						data: {
							id: idInvoice,
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
							subtotal_tambahan: input.subtotal_tambahan,
							biaya_tambahan_sales: input.biaya_tambahan_sales,
							itemNo_sales_order: input.itemNo_sales_order,
							biaya_tambahan_join: input.biaya_tambahan_join,
							itemNo_join: input.itemNo_join,
							nama_barang_join: input.nama_barang_join,
							kota_tujuan: input.kota_tujuan,
							biaya_tambahan_ppn: input.biaya_tambahan_ppn,
							biaya_tambahan_non_ppn: input.biaya_tambahan_non_ppn
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

			var myHeaders = new Headers()
			myHeaders.append(
				`Authorization`,
				`Bearer 8b9f1e47-3f48-47bc-87f0-ab9f3aecd515`
			)
			myHeaders.append(`X-Session-ID`, `22f7af2e-1016-4c26-911f-91dd48b69c3b`)
			myHeaders.append(
				`Cookie`,
				`JSESSIONID=EF702D38172753496D9445A5FFDEC43B.accurate_accurateapp_accuratewwb3`
			)

			var requestOptions = {
				method: `POST`,
				headers: myHeaders
			}

			try {
				const response = await fetch(
					//from request body
					`https://public.accurate.id/accurate/api/sales-invoice/delete.do?Scope: sales_invoice_save&id=${args.id}`,
					requestOptions
				)
				const result = await response.text()
				console.log(`result`, result)
			} catch (error) {
				console.log(`error`, error)
			}

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
