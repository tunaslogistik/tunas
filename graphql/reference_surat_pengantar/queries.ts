import { gql } from "apollo-server-micro"

export const GET_REFERENCE_SURAT_PENGANTAR = gql`
	query reference_surat_pengantar {
		reference_surat_pengantar {
			id
			kode_tujuan
			kota_tujuan
			tanggal_tahun
			bulan_tahun
			increment
		}
	}
`
//export by reference_surat_pengantar id
export const GET_REFERENCE_SURAT_PENGANTAR_BY_ID = gql`
	query reference_surat_pengantar_by_id($id: Int) {
		reference_surat_pengantar_by_id(id: $id) {
			id
			kode_tujuan
			kota_tujuan
			tanggal_tahun
			bulan_tahun
			increment
		}
	}
`
