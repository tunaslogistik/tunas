import { gql } from "apollo-server-micro"

export const GET_DAFTAR_INVOICE = gql`
	query daftar_invoice {
		daftar_invoice {
			id
			nomor_surat_jalan
			nomor_invoice
			nomor_ttb
			vendor_pelayanan
			tanggal_surat_jalan
			nomor_container
			koli
			volume
			nama_kapal
			total_koli
			total_volume
			tanggal_keberangkatan
			nomor_container
			nomor_seal
			keterangan
		}
	}
`
