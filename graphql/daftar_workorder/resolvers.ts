import { Context } from "../context"

const queries = {
	daftar_workorder: (_parent, _args, context: Context) => {
		return context.prisma.daftar_workorder.findMany()
	}
}

const mutations = {
	createDaftar_workorder: async (_parent, args, context: Context) => {
		try {
			const {
				id,
				nomor_workorder,
				kendaraan,
				nomor_container,
				nomor_seal,
				kota_tujuan,
				komentar_container,
				komentar_muat_barang,
				komentar_menuju_pelabuhan,
				komentar_tiba_pelabuhan,
				komentar_muatan,
				komentar_destinasi,
				tanggal_wo,
				tanggal_container,
				tanggal_muat_barang,
				tanggal_menuju_pelabuhan,
				tanggal_tiba_pelabuhan,
				tanggal_muatan,
				tanggal_destinasi,
				nomor_kendaraan,
				nama_supir,
				nama_kenek,
				wa_supir,
				wa_kenek,
				photo_container,
				photo_seal_pelabuhan,
				photo_surat_jalan,
				photo_muat_barang,
				photo_seal_muatan,
				photo_seal_destinasi,
				status
			} = args.input

			const daftar_workorder = await context.prisma.daftar_workorder.create({
				data: {
					id,
					nomor_workorder,
					kendaraan,
					nomor_container,
					nomor_seal,
					kota_tujuan,
					komentar_container,
					komentar_muat_barang,
					komentar_menuju_pelabuhan,
					komentar_tiba_pelabuhan,
					komentar_muatan,
					komentar_destinasi,
					tanggal_wo,
					tanggal_container,
					tanggal_muat_barang,
					tanggal_menuju_pelabuhan,
					tanggal_tiba_pelabuhan,
					tanggal_muatan,
					tanggal_destinasi,
					nomor_kendaraan,
					nama_supir,
					nama_kenek,
					wa_supir,
					wa_kenek,
					photo_container,
					photo_seal_pelabuhan,
					photo_surat_jalan,
					photo_muat_barang,
					photo_seal_muatan,
					photo_seal_destinasi,
					status
				}
			})

			return {
				code: `200`,
				success: true,
				message: `Successfully create new user`,
				daftar_workorder
			}
		} catch (error) {
			console.log(error)
			throw new Error(error)
		}
	},
	updateDaftar_workorder: async (_parent, args, context: Context) => {
		try {
			const {
				id,
				nomor_workorder,
				kendaraan,
				nomor_container,
				nomor_seal,
				kota_tujuan,
				komentar_container,
				komentar_muat_barang,
				komentar_menuju_pelabuhan,
				komentar_tiba_pelabuhan,
				komentar_muatan,
				komentar_destinasi,
				tanggal_wo,
				tanggal_container,
				tanggal_muat_barang,
				tanggal_menuju_pelabuhan,
				tanggal_tiba_pelabuhan,
				tanggal_muatan,
				tanggal_destinasi,
				nomor_kendaraan,
				nama_supir,
				nama_kenek,
				wa_supir,
				wa_kenek,
				photo_container,
				photo_seal_pelabuhan,
				photo_surat_jalan,
				photo_muat_barang,
				photo_seal_muatan,
				photo_seal_destinasi,
				status
			} = args.input
			let daftar_workorder

			daftar_workorder = await context.prisma.daftar_workorder.update({
				where: { id },
				data: {
					id,
					nomor_workorder,
					kendaraan,
					nomor_container,
					nomor_seal,
					kota_tujuan,
					komentar_container,
					komentar_muat_barang,
					komentar_menuju_pelabuhan,
					komentar_tiba_pelabuhan,
					komentar_muatan,
					komentar_destinasi,
					tanggal_wo,
					tanggal_container,
					tanggal_muat_barang,
					tanggal_menuju_pelabuhan,
					tanggal_tiba_pelabuhan,
					tanggal_muatan,
					tanggal_destinasi,
					nomor_kendaraan,
					nama_supir,
					nama_kenek,
					wa_supir,
					wa_kenek,
					photo_container,
					photo_seal_pelabuhan,
					photo_surat_jalan,
					photo_muat_barang,
					photo_seal_muatan,
					photo_seal_destinasi,
					status
				}
			})

			return {
				code: `200`,
				success: true,
				message: `Successfully update user`,
				daftar_workorder
			}
		} catch (error) {
			console.log(error)
			throw new Error(error)
		}
	},

	deleteDaftar_workorder: async (_parent, args, context: Context) => {
		try {
			const daftar_workorder = await context.prisma.daftar_workorder.delete({
				where: { id: args.id }
			})

			return {
				code: `200`,
				success: true,
				message: `Successfully delete vechnicle`,
				daftar_workorder
			}
		} catch (error) {
			console.log(error)
			throw new Error(error)
		}
	}
}

export const resolvers = { queries, mutations }
