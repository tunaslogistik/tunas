import { gql } from "apollo-server-micro"

export const GET_DAFTAR_TTB = gql`
	query daftar_ttb {
		daftar_ttb {
			id
			ttb_number
			pengirim
			kota_tujuan
			tanggal_diterima
			nama_penerima
			total_volume
			jenis_pengiriman
			nomor_telepon
			nama_barang
			panjang
			container_size
			lebar
			tinggi
			koli
			pembayar
			ppn
			accurate
			alamat_tujuan
			status
			kategori
			full_container
			pembayar
			ppn
			accurate
		}
	}
`
