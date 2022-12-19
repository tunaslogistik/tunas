import { gql } from "apollo-server-micro"

export const GET_REFERENCE_TTB = gql`
	query reference_ttb {
		reference_ttb {
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
export const GET_REFERENCE_TTB_BY_ID = gql`
	query reference_ttb_by_id($id: Int) {
		reference_ttb_by_id(id: $id) {
			id
			kode_tujuan
			kota_tujuan
			tanggal_tahun
			bulan_tahun
			increment
		}
	}
`
