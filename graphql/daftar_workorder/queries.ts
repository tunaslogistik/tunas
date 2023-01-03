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
			komentar_kapal_sandar
			komentar_barang_terkirim
			tanggal_wo
			tanggal_container
			tanggal_muat_barang
			tanggal_menuju_pelabuhan
			tanggal_tiba_pelabuhan
			tanggal_muatan
			tanggal_destinasi
			tanggal_kapal_sandar
			tanggal_barang_terkirim
			nomor_kendaraan
			nama_supir
			nama_kenek
			wa_supir
			wa_kenek
			photo_container
			photo_container_seal
			photo_surat_jalan_stackful
			photo_surat_jalan_pabrik
			photo_surat_pengantar
			photo_seal_pelabuhan
			photo_kapal_sandar
			photo_barang_terkirim
			nama_kapal
			status
		}
	}
`

export const GET_DAFTAR_WORKORDER_BY_ID = gql`
	query daftar_workorder_by_id($id: Int) {
		daftar_workorder_by_id(id: $id) {
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
			komentar_kapal_sandar
			komentar_barang_terkirim
			tanggal_wo
			tanggal_container
			tanggal_muat_barang
			tanggal_menuju_pelabuhan
			tanggal_tiba_pelabuhan
			tanggal_muatan
			tanggal_destinasi
			tanggal_kapal_sandar
			tanggal_barang_terkirim
			nomor_kendaraan
			nama_supir
			nama_kenek
			wa_supir
			wa_kenek
			photo_container
			photo_container_seal
			photo_surat_jalan_stackful
			photo_surat_jalan_pabrik
			photo_surat_pengantar
			photo_seal_pelabuhan
			photo_kapal_sandar
			photo_barang_terkirim
			nama_kapal
			status
		}
	}
`
