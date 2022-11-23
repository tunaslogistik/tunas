import { gql } from "apollo-server-micro"

export const GET_DAFTAR_WORKORDER = gql`
	query daftar_workorder {
		daftar_workorder {
			id
			nomor_workorder
			kendaraan
			nomor_container
			nomor_seal
			kota_tujuan
			komentar_container
			komentar_muat_barang
			komentar_menuju_pelabuhan
			komentar_tiba_pelabuhan
			komentar_muatan
			komentar_destinasi
			tanggal_wo
			tanggal_container
			tanggal_muat_barang
			tanggal_menuju_pelabuhan
			tanggal_tiba_pelabuhan
			tanggal_muatan
			tanggal_destinasi
			nomor_kendaraan
			nama_supir
			nama_kenek
			wa_supir
			wa_kenek
			photo_container
			photo_seal_pelabuhan
			photo_surat_jalan
			photo_muat_barang
			photo_seal_muatan
			photo_seal_destinasi
			status
		}
	}
`
