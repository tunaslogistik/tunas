import { gql } from "apollo-server-micro"

export const GET_REFERENCE_PACKING_LIST = gql`
	query reference_packing_list {
		reference_packing_list {
			id
			kode_tujuan
			kota_tujuan
			tanggal_tahun
			bulan_tahun
			increment
		}
	}
`
//export by reference_packing_list id
export const GET_REFERENCE_PACKING_LIST_BY_ID = gql`
	query reference_packing_list_by_id($id: Int) {
		reference_packing_list_by_id(id: $id) {
			id
			kode_tujuan
			kota_tujuan
			tanggal_tahun
			bulan_tahun
			increment
		}
	}
`
