import { gql } from "apollo-server-micro"

export const GET_DAFTAR_MUAT_BARANG = gql`
	query daftar_muat_barang {
		daftar_muat_barang {
			id
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
			ship_name
			nomor_container
			tanggal_muat_barang
			nomor_seal
			tanggal_masuk
			nama_barang
			volume
			koli
			satuan
		}
	}
`
