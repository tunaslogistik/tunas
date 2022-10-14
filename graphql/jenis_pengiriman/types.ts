import { gql } from "apollo-server-micro"

export const types = gql`
	type jenis_pengiriman {
                id          :Int    
                nama_pengiriman :String
                creator     :String
                updated_by  :String
	}

	type jenis_pengiriman {
	        jenis_pengiriman: [jenis_pengiriman!]
	}

	input CreateJenis_pengirimanInput {
                id          :Int
                nama_pengiriman :String
                creator     :String
                updated_by  :String
	}

	input UpdateJenis_pengirimanInput {
                id          :Int    
                nama_pengiriman :String
                creator     :String
                updated_by  :String
	}

	type MutateJenis_pengirimanResponse {
        code: String!
        success: Boolean!
        message: String!
        jenis_pengiriman: [jenis_pengiriman!]
	}

`