import { gql } from "apollo-server-micro"

export const GET_REFERENCE_INVOICE = gql`
	query reference_invoice {
		reference_invoice {
			id
			kode_tujuan
			kota_tujuan
			tanggal_tahun
			bulan_tahun
			increment
		}
	}
`
//export by daftar_tujuan id
export const GET_REFERENCE_INVOICE_BY_ID = gql`
	query reference_invoice_by_id($id: Int) {
		reference_invoice_by_id(id: $id) {
			id
			kode_tujuan
			kota_tujuan
			tanggal_tahun
			bulan_tahun
			increment
		}
	}
`
