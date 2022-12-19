import { gql } from "apollo-server-micro"

export const GET_DAFTAR_SALES_ORDER = gql`
	query daftar_sales_order {
		daftar_sales_order {
			id
			nomor_ttb
			nomor_sales_order
			total_volume
			harga
			pengirim
			rekening
			kota_tujuan
			harga_sesudah_ppn
			total_tagihan
			dp
			tanggal_sales_order
			term_payment
			nama_barang
			itemNo
			tipe_ppn
			harga_satuan
			harga_total
			total_harga_ttb
		}
	}
`
