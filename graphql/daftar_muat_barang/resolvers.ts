import { Context } from "../context"

const queries = {
	daftar_muat_barang: (_parent, _args, context: Context) => {
		return context.prisma.daftar_muat_barang.findMany()
	}
}

const mutations = {
	createDaftar_muat_barang: async (_parent, args, context: Context) => {
		try {
			const {
				nomor_muat_barang,
				nomor_ttb,
				total_ttb,
				total_koli,
				kota_tujuan,
				total_volume,
				pengirim,
				penerima,
				estimated_date,
				nomor_kendaraan,
				vendor_pelayanan,
				posisi,
				nomor_container,
				nomor_seal,
				tanggal_muat_barang,
				tanggal_masuk,
				nama_barang,
				volume,
				koli,
				satuan
			} = args.input

			const daftar_muat_barang = await context.prisma.daftar_muat_barang.create(
				{
					data: {
						nomor_muat_barang,
						pengirim,
						penerima,
						nomor_ttb,
						total_ttb,
						tanggal_masuk,
						tanggal_muat_barang,
						nama_barang,
						volume,
						koli,
						satuan,
						estimated_date,
						total_koli,
						kota_tujuan,
						total_volume,
						nomor_kendaraan,
						vendor_pelayanan,
						posisi,
						nomor_container,
						nomor_seal
					}
				}
			)

			return {
				code: `200`,
				success: true,
				message: `Successfully create new user`,
				daftar_muat_barang
			}
		} catch (error) {
			console.log(error)
			throw new Error(error)
		}
	},

	updateDaftar_muat_barang: async (_parent, args, context: Context) => {
		try {
			const {
				id,
				nomor_muat_barang,
				nomor_ttb,
				total_ttb,
				total_koli,
				kota_tujuan,
				total_volume,
				pengirim,
				penerima,
				estimated_date,
				tanggal_muat_barang,
				nomor_kendaraan,
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
			let daftar_muat_barang

			daftar_muat_barang = await context.prisma.daftar_muat_barang.update({
				where: { id },
				data: {
					id,
					nomor_muat_barang,
					nomor_ttb,
					total_ttb,
					total_koli,
					kota_tujuan,
					total_volume,
					pengirim,
					penerima,
					estimated_date,
					tanggal_muat_barang,
					nomor_kendaraan,
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
				message: `Successfully update user`,
				daftar_muat_barang
			}
		} catch (error) {
			console.log(error)
			throw new Error(error)
		}
	},
	deleteDaftar_muat_barang: async (_parent, args, context: Context) => {
		try {
			const daftar_muat_barang = await context.prisma.daftar_muat_barang.delete(
				{
					where: { id: args.id }
				}
			)

			return {
				code: `200`,
				success: true,
				message: `Successfully delete vechnicle`,
				daftar_muat_barang
			}
		} catch (error) {
			console.log(error)
			throw new Error(error)
		}
	}
}

export const resolvers = { queries, mutations }
