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
			harga_sebelum_ppn
			total_tagihan
			dp
			tanggal_sales_order
			term_payment
		}
	}
`
