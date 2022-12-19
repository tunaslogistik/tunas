import { gql } from "apollo-server-micro"

export const GET_REFERENCE_WORKORDER = gql`
	query reference_workorder {
		reference_workorder {
			id
			kode_tujuan
			kota_tujuan
			tanggal_tahun
			bulan_tahun
			increment
		}
	}
`

export const GET_REFERENCE_WORKORDER_BY_ID = gql`
	query reference_workorder_by_id($id: Int) {
		reference_workorder_by_id(id: $id) {
			id
			kode_tujuan
			kota_tujuan
			tanggal_tahun
			bulan_tahun
			increment
		}
	}
`
