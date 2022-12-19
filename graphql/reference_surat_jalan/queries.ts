import { gql } from "apollo-server-micro"

export const GET_REFERENCE_SURAT_JALAN = gql`
	query reference_surat_jalan {
		reference_surat_jalan {
			id
			kode_tujuan
			kota_tujuan
			tanggal_tahun
			bulan_tahun
			increment
		}
	}
`
//export by reference_surat_jalan id
export const GET_REFERENCE_SURAT_JALAN_BY_ID = gql`
	query reference_surat_jalan_by_id($id: Int) {
		reference_surat_jalan_by_id(id: $id) {
			id
			kode_tujuan
			kota_tujuan
			tanggal_tahun
			bulan_tahun
			increment
		}
	}
`
