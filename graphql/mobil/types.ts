import { gql } from "apollo-server-micro"

export const types = gql`
	type vechnicle {
                id          :Int
                nomor_kendaraan    :String   
                tipe_kendaraan :String
                nama_supir     :String
                nama_kenek     :String
                status         :String
                last_update    :String
                creator        :String
                updated_by     :String
	}

	type vechnicle {
	        vechnicle: [vechnicle!]
	}

	input CreateVechnicleInput {
                id          :Int
                nomor_kendaraan    :String   
                tipe_kendaraan :String
                nama_supir     :String
                nama_kenek     :String
                status         :String
                last_update    :String
                creator        :String
                updated_by     :String
	}

	input UpdateVechnicleInput {
                id          :Int
                nomor_kendaraan    :String   
                tipe_kendaraan :String
                nama_supir     :String
                nama_kenek     :String
                status         :String
                last_update    :String
                creator        :String
                updated_by     :String
	}

	type MutateVechnicleResponse {
        code: String!
        success: Boolean!
        message: String!
        vechnicle: [vechnicle!]
	}

`