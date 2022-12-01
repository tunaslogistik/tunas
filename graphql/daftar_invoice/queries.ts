import { gql } from "apollo-server-micro"

export const GET_DAFTAR_INVOICE = gql`
	query daftar_invoice {
		daftar_invoice {
			accurate
			harga
			harga_biaya_tambahan
			id
			keterangan
			koli
			nama_barang
			nama_kapal
			nomor_container
			nomor_invoice
			nomor_seal
			nomor_surat_jalan
			nomor_ttb
			pengirim
			ppn_biaya_tambahan
			tanggal_invoice
			tanggal_keberangkatan
			total_koli
			total_volume
			vendor_pelayanan
			volume
			total_tagihan
			tax
			subtotal
			subtotal_tambahan
		}
	}
`
