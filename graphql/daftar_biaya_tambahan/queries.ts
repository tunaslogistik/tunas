import { gql } from "apollo-server-micro"

export const GET_DAFTAR_BIAYA_TAMBAHAN = gql`
	query daftar_biaya_tambahan {
		daftar_biaya_tambahan {
			id
			jenis_biaya_tambahan
			id_biaya_tambahan
			pengirim
			nomor_invoice
			harga_biaya_tambahan
		}
	}
`
