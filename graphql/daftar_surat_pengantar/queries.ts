import { gql } from "apollo-server-micro"

export const GET_DAFTAR_SURAT_PENGANTAR = gql`
	query daftar_surat_pengantar {
		daftar_surat_pengantar {
			id
			nomor_surat_jalan
			nomor_muat_barang
			nomor_ttb
			total_ttb
			total_koli
			kota_tujuan
			pengirim
			penerima
			total_volume
			nomor_kendaraan
			vendor_pelayanan
			estimated_date
			posisi
			nomor_container
			nomor_seal
			tanggal_masuk
			nama_barang
			volume
			koli
			satuan
		}
	}
`
