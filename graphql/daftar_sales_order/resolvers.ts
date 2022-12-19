import { Context } from "../context"

const queries = {
	daftar_sales_order: (_parent, _args, context: Context) => {
		return context.prisma.daftar_sales_order.findMany()
	}
}

const mutations = {
	createDaftar_sales_order: async (_parent, args, context: Context) => {
		try {
			const {
				id,
				nomor_ttb,
				nomor_sales_order,
				total_volume,
				harga,
				pengirim,
				kota_tujuan,
				rekening,
				total_tagihan,
				harga_sesudah_ppn,
				dp,
				tanggal_sales_order,
				term_payment,
				nama_barang,
				itemNo,
				harga_satuan,
				harga_total,
				tipe_ppn,
				total_harga_ttb
			} = args.input

			const daftar_sales_order = await context.prisma.daftar_sales_order.create(
				{
					data: {
						id,
						nomor_ttb,
						nomor_sales_order,
						total_volume,
						pengirim,
						kota_tujuan,
						rekening,
						harga_sesudah_ppn,
						dp,
						harga,
						total_tagihan,
						tanggal_sales_order,
						term_payment,
						nama_barang,
						itemNo,
						harga_satuan,
						harga_total,
						tipe_ppn,
						total_harga_ttb
					}
				}
			)

			return {
				code: `200`,
				success: true,
				message: `Successfully create new user`,
				daftar_sales_order
			}
		} catch (error) {
			console.log(error)
			throw new Error(error)
		}
	},

	updateDaftar_sales_order: async (_parent, args, context: Context) => {
		try {
			const {
				id,
				nomor_ttb,
				nomor_sales_order,
				total_volume,
				harga,
				total_tagihan,
				kota_tujuan,
				rekening,
				dp,
				harga_sesudah_ppn,
				pengirim,
				tanggal_sales_order,
				term_payment,
				nama_barang,
				itemNo,
				harga_satuan,
				harga_total,
				tipe_ppn,
				total_harga_ttb
			} = args.input
			let daftar_sales_order

			daftar_sales_order = await context.prisma.daftar_sales_order.update({
				where: { id },
				data: {
					id,
					nomor_ttb,
					nomor_sales_order,
					total_volume,
					kota_tujuan,
					rekening,
					harga,
					total_tagihan,
					dp,
					harga_sesudah_ppn,
					pengirim,
					tanggal_sales_order,
					term_payment,
					nama_barang,
					itemNo,
					harga_satuan,
					harga_total,
					tipe_ppn,
					total_harga_ttb
				}
			})

			return {
				code: `200`,
				success: true,
				message: `Successfully update user`,
				daftar_sales_order
			}
		} catch (error) {
			console.log(error)
			throw new Error(error)
		}
	},
	deleteDaftar_sales_order: async (_parent, args, context: Context) => {
		try {
			const daftar_sales_order = await context.prisma.daftar_sales_order.delete(
				{
					where: { id: args.id }
				}
			)

			return {
				code: `200`,
				success: true,
				message: `Successfully delete vechnicle`,
				daftar_sales_order
			}
		} catch (error) {
			console.log(error)
			throw new Error(error)
		}
	}
}

export const resolvers = { queries, mutations }
