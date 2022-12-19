import { gql } from "apollo-server-micro"

export const GET_DAFTAR_PACKING_LIST = gql`
	query daftar_packing_list {
		daftar_packing_list {
			id
			nomor_packing_list
			nomor_muat_barang
			nomor_ttb
			total_ttb
			total_koli
			kota_tujuan
			pengirim
			penerima
			total_volume
			nomor_kendaraan
			estimated_date
			vendor_pelayanan
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
