import { gql } from "apollo-server-micro"

export const GET_DAFTAR_SURAT_JALAN = gql`
	query daftar_surat_jalan {
		daftar_surat_jalan {
			id
			nomor_surat_jalan
			nomor_ttb
			vendor_pelayanan
			tanggal_surat_jalan
			nomor_container
			koli
			volume
			kota_tujuan
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
