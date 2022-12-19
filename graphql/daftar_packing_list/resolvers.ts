import { Context } from "../context"

const queries = {
	daftar_packing_list: (_parent, _args, context: Context) => {
		return context.prisma.daftar_packing_list.findMany()
	}
}

const mutations = {
	createDaftar_packing_list: async (_parent, args, context: Context) => {
		try {
			const {
				id,
				nomor_packing_list,
				nomor_muat_barang,
				nomor_ttb,
				total_ttb,
				total_koli,
				kota_tujuan,
				total_volume,
				pengirim,
				penerima,
				nomor_kendaraan,
				estimated_date,
				vendor_pelayanan,
				posisi,
				nomor_container,
				nomor_seal,
				tanggal_masuk,
				nama_barang,
				volume,
				koli,
				satuan
			} = args.input

			const daftar_packing_list =
				await context.prisma.daftar_packing_list.create({
					data: {
						id,
						nomor_packing_list,
						nomor_muat_barang,
						nomor_ttb,
						total_ttb,
						total_koli,
						kota_tujuan,
						total_volume,
						pengirim,
						penerima,
						nomor_kendaraan,
						estimated_date,
						vendor_pelayanan,
						posisi,
						nomor_container,
						nomor_seal,
						tanggal_masuk,
						nama_barang,
						volume,
						koli,
						satuan
					}
				})

			return {
				code: `200`,
				success: true,
				message: `Successfully create new user`,
				daftar_packing_list
			}
		} catch (error) {
			console.log(error)
			throw new Error(error)
		}
	}
}

export const resolvers = { queries, mutations }
