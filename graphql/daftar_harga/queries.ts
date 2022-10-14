import { gql } from "apollo-server-micro"

export const GET_DAFTAR_HARGA = gql`
	query daftar_harga{
		daftar_harga{
            id
            kode_asal
            kode
            kode_tujuan
            jenis_pengiriman
            harga
            minimak_kubik
            creator
            updated_by
	}
`
