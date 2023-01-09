import { Context } from "../context"

const queries = {
	daftar_ttb: (_parent, _args, context: Context) => {
		return context.prisma.daftar_ttb.findMany()
	}
}

const mutations = {
	createDaftar_ttb: async (_parent, args, context: Context) => {
		try {
			const {
				ttb_number,
				pengirim,
				kota_tujuan,
				tanggal_diterima,
				total_volume,
				nama_penerima,
				jenis_pengiriman,
				container_size,
				nomor_telepon,
				nama_barang,
				panjang,
				lebar,
				tinggi,
				koli,
				alamat_tujuan,
				status,
				kategori,
				full_container,
				pembayar,
				ppn,
				accurate,
				biaya_tambahan,
				biaya_tambahan_non_ppn
			} = args.input

			const daftar_ttb = await context.prisma.daftar_ttb.create({
				data: {
					ttb_number,
					pengirim,
					kota_tujuan,
					tanggal_diterima,
					nama_penerima,
					jenis_pengiriman,
					nomor_telepon,
					total_volume,
					container_size,
					nama_barang,
					panjang,
					lebar,
					tinggi,
					koli,
					alamat_tujuan,
					status,
					kategori,
					full_container,
					pembayar,
					ppn,
					accurate,
					biaya_tambahan,
					biaya_tambahan_non_ppn
				}
			})

			return {
				code: `200`,
				success: true,
				message: `Successfully create new user`,
				daftar_ttb
			}
		} catch (error) {
			console.log(error)
			throw new Error(error)
		}
	},

	updateDaftar_ttb: async (_parent, args, context: Context) => {
		try {
			const {
				id,
				ttb_number,
				pengirim,
				kota_tujuan,
				tanggal_diterima,
				total_volume,
				nama_penerima,
				jenis_pengiriman,
				container_size,
				nomor_telepon,
				nama_barang,
				panjang,
				lebar,
				tinggi,
				koli,
				alamat_tujuan,
				status,
				kategori,
				full_container,
				pembayar,
				ppn,
				accurate,
				biaya_tambahan,
				biaya_tambahan_non_ppn
			} = args.input
			let daftar_ttb

			daftar_ttb = await context.prisma.daftar_ttb.update({
				where: { id },
				data: {
					id,
					ttb_number,
					pengirim,
					kota_tujuan,
					tanggal_diterima,
					total_volume,
					nama_penerima,
					jenis_pengiriman,
					container_size,
					nomor_telepon,
					nama_barang,
					panjang,
					lebar,
					tinggi,
					koli,
					alamat_tujuan,
					status,
					kategori,
					full_container,
					pembayar,
					ppn,
					accurate,
					biaya_tambahan,
					biaya_tambahan_non_ppn
				}
			})

			return {
				code: `200`,
				success: true,
				message: `Successfully update user`,
				daftar_ttb
			}
		} catch (error) {
			console.log(error)
			throw new Error(error)
		}
	},
	deleteDaftar_ttb: async (_parent, args, context: Context) => {
		try {
			const daftar_ttb = await context.prisma.daftar_ttb.delete({
				where: { id: args.id }
			})

			return {
				code: `200`,
				success: true,
				message: `Successfully delete vechnicle`,
				daftar_ttb
			}
		} catch (error) {
			console.log(error)
			throw new Error(error)
		}
	}
}

export const resolvers = { queries, mutations }
