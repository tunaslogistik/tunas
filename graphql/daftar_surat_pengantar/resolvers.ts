import { Context } from "../context"

const queries = {
	daftar_surat_pengantar: (_parent, _args, context: Context) => {
		return context.prisma.daftar_surat_pengantar.findMany()
	}
}

const mutations = {
	createDaftar_surat_pengantar: async (_parent, args, context: Context) => {
		try {
			const {
				id,
				nomor_surat_jalan,
				nomor_muat_barang,
				nomor_ttb,
				total_ttb,
				total_koli,
				kota_tujuan,
				total_volume,
				pengirim,
				penerima,
				nomor_kendaraan,
				vendor_pelayanan,
				posisi,
				estimated_date,
				nomor_container,
				nomor_seal,
				tanggal_masuk,
				nama_barang,
				volume,
				koli,
				satuan
			} = args.input

			const daftar_surat_pengantar =
				await context.prisma.daftar_surat_pengantar.create({
					data: {
						id,
						nomor_surat_jalan,
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
				daftar_surat_pengantar
			}
		} catch (error) {
			console.log(error)
			throw new Error(error)
		}
	},

	deleteDaftar_surat_pengantar: async (_parent, args, context: Context) => {
		try {
			const daftar_surat_pengantar =
				await context.prisma.daftar_surat_pengantar.delete({
					where: { id: args.id }
				})

			return {
				code: `200`,
				success: true,
				message: `Successfully delete vechnicle`,
				daftar_surat_pengantar
			}
		} catch (error) {
			console.log(error)
			throw new Error(error)
		}
	}
}

export const resolvers = { queries, mutations }
