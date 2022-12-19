import { gql } from "apollo-server-micro"

export const GET_REFERENCE_MUAT_BARANG = gql`
	query reference_muat_barang {
		reference_muat_barang {
			id
			kode_tujuan
			kota_tujuan
			tanggal_tahun
			bulan_tahun
			increment
		}
	}
`
//export by reference_muat_barang id
export const GET_REFERENCE_MUAT_BARANG_BY_ID = gql`
	query reference_muat_barang_by_id($id: Int) {
		reference_muat_barang_by_id(id: $id) {
			id
			kode_tujuan
			kota_tujuan
			tanggal_tahun
			bulan_tahun
			increment
		}
	}
`
