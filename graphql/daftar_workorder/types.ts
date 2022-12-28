import { gql } from "apollo-server-micro"

export const types = gql`
	type daftar_workorder {
		id: Int
		nomor_workorder: String
		kendaraan: String
		nomor_container: String
		nomor_seal: String
		kota_tujuan: String
		komentar_container: String
		komentar_muat_barang: String
		komentar_menuju_pelabuhan: String
		komentar_tiba_pelabuhan: String
		komentar_muatan: String
		komentar_destinasi: String
		komentar_kapal_sandar: String
		komentar_barang_terkirim: String
		tanggal_wo: String
		tanggal_container: String
		tanggal_muat_barang: String
		tanggal_menuju_pelabuhan: String
		tanggal_tiba_pelabuhan: String
		tanggal_muatan: String
		tanggal_destinasi: String
		tanggal_kapal_sandar: String
		tanggal_barang_terkirim: String
		nomor_kendaraan: String
		nama_supir: String
		nama_kenek: String
		wa_supir: String
		wa_kenek: String
		photo_container: String
		photo_container_seal: String
		photo_surat_jalan_stackful: String
		photo_surat_jalan_pabrik: String
		photo_surat_pengantar: String
		photo_seal_pelabuhan: String
		photo_kapal_sandar: String
		photo_barang_terkirim: String
		nama_kapal: String
		status: String
	}

	type daftar_workorder {
		daftar_workorder: [daftar_workorder!]
	}

	input CreateDaftar_workorderInput {
		id: Int
		nomor_workorder: String
		kendaraan: String
		nomor_container: String
		nomor_seal: String
		kota_tujuan: String
		komentar_container: String
		komentar_muat_barang: String
		komentar_menuju_pelabuhan: String
		komentar_tiba_pelabuhan: String
		komentar_muatan: String
		komentar_destinasi: String
		komentar_kapal_sandar: String
		komentar_barang_terkirim: String
		tanggal_wo: String
		tanggal_container: String
		tanggal_muat_barang: String
		tanggal_menuju_pelabuhan: String
		tanggal_tiba_pelabuhan: String
		tanggal_muatan: String
		tanggal_destinasi: String
		tanggal_kapal_sandar: String
		tanggal_barang_terkirim: String
		nomor_kendaraan: String
		nama_supir: String
		nama_kenek: String
		wa_supir: String
		wa_kenek: String
		photo_container: String
		photo_container_seal: String
		photo_surat_jalan_stackful: String
		photo_surat_jalan_pabrik: String
		photo_surat_pengantar: String
		photo_seal_pelabuhan: String
		photo_kapal_sandar: String
		photo_barang_terkirim: String
		nama_kapal: String
		status: String
	}

	input UpdateDaftar_workorderInput {
		id: Int
		nomor_workorder: String
		kendaraan: String
		nomor_container: String
		nomor_seal: String
		kota_tujuan: String
		komentar_container: String
		komentar_muat_barang: String
		komentar_menuju_pelabuhan: String
		komentar_tiba_pelabuhan: String
		komentar_muatan: String
		komentar_destinasi: String
		komentar_kapal_sandar: String
		komentar_barang_terkirim: String
		tanggal_wo: String
		tanggal_container: String
		tanggal_muat_barang: String
		tanggal_menuju_pelabuhan: String
		tanggal_tiba_pelabuhan: String
		tanggal_muatan: String
		tanggal_destinasi: String
		tanggal_kapal_sandar: String
		tanggal_barang_terkirim: String
		nomor_kendaraan: String
		nama_supir: String
		nama_kenek: String
		wa_supir: String
		wa_kenek: String
		photo_container: String
		photo_container_seal: String
		photo_surat_jalan_stackful: String
		photo_surat_jalan_pabrik: String
		photo_surat_pengantar: String
		photo_seal_pelabuhan: String
		photo_kapal_sandar: String
		photo_barang_terkirim: String
		nama_kapal: String
		status: String
	}

	type MutateDaftar_workorderResponse {
		code: String!
		success: Boolean!
		message: String!
		daftar_workorder: [daftar_workorder!]
	}
`
