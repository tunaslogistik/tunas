import { Context } from "../context"

const queries = {
	daftar_surat_jalan: (_parent, _args, context: Context) => {
		return context.prisma.daftar_surat_jalan.findMany()
	}
}

const mutations = {
	createDaftar_surat_jalan: async (_parent, args, context: Context) => {
		try {
			const {
				id,
				nomor_surat_jalan,
				nomor_ttb,
				vendor_pelayanan,
				tanggal_surat_jalan,
				koli,
				volume,
				kota_tujuan,
				total_koli,
				total_volume,
				tanggal_keberangkatan,
				nama_kapal,
				nomor_container,
				nomor_seal,
				keterangan
			} = args.input

			const daftar_surat_jalan = await context.prisma.daftar_surat_jalan.create(
				{
					data: {
						id,
						nomor_surat_jalan,
						nomor_ttb,
						vendor_pelayanan,
						tanggal_surat_jalan,
						nomor_container,
						koli,
						volume,
						kota_tujuan,
						total_koli,
						total_volume,
						nama_kapal,
						tanggal_keberangkatan,
						nomor_seal,
						keterangan
					}
				}
			)

			//post to api inside header authorization and session axios
			// const token = `Bearer 3107bce2-6641-4abf-a2c7-75fd20ce8e16`
			// const session = `f1ebe222-43a9-4191-a47b-00abda4247f7`

			// const url = `https://zeus.accurate.id/accurate/api/shipment/save.do?scope=shipment_save`
			// const data = {
			// 	name: nomor_surat_jalan
			// }
			// // make POST FUNCTION  axios
			// const axios = require(`axios`)
			// const response = await axios.post(url, data, {
			// 	headers: {
			// 		Authorization: `Bearer 3107bce2-6641-4abf-a2c7-75fd20ce8e16`,
			// 		"X-Session-ID": `f1ebe222-43a9-4191-a47b-00abda4247f7`
			// 	}
			// })
			// console.log(response.data)

			return {
				code: `200`,
				success: true,
				message: `Successfully create new user`,
				daftar_surat_jalan
			}
		} catch (error) {
			console.log(error)
			throw new Error(error)
		}
	},
	updateDaftar_surat_jalan: async (_parent, args, context: Context) => {
		try {
			const {
				id,
				nomor_surat_jalan,
				nomor_ttb,
				vendor_pelayanan,
				tanggal_surat_jalan,
				koli,
				volume,
				total_koli,
				total_volume,
				kota_tujuan,
				tanggal_keberangkatan,
				nama_kapal,
				nomor_container,
				nomor_seal,
				keterangan
			} = args.input
			let daftar_surat_jalan

			daftar_surat_jalan = await context.prisma.daftar_surat_jalan.update({
				where: { id },
				data: {
					id,
					nomor_surat_jalan,
					nomor_ttb,
					vendor_pelayanan,
					tanggal_surat_jalan,
					nomor_container,
					koli,
					volume,
					kota_tujuan,
					total_koli,
					total_volume,
					nama_kapal,
					tanggal_keberangkatan,
					nomor_seal,
					keterangan
				}
			})

			return {
				code: `200`,
				success: true,
				message: `Successfully update user`,
				daftar_surat_jalan
			}
		} catch (error) {
			console.log(error)
			throw new Error(error)
		}
	},

	deleteDaftar_surat_jalan: async (_parent, args, context: Context) => {
		try {
			const daftar_surat_jalan = await context.prisma.daftar_surat_jalan.delete(
				{
					where: { id: args.id }
				}
			)

			return {
				code: `200`,
				success: true,
				message: `Successfully delete vechnicle`,
				daftar_surat_jalan
			}
		} catch (error) {
			console.log(error)
			throw new Error(error)
		}
	}
}

export const resolvers = { queries, mutations }
