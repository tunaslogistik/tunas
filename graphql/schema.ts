import { gql } from "apollo-server-micro"
import { accurate } from "./accurate"
import { customer } from "./customer"
import { daftar_biaya_tambahan } from "./daftar_biaya_tambahan"
import { daftar_harga } from "./daftar_harga"
import { daftar_invoice } from "./daftar_invoice"
import { daftar_muat_barang } from "./daftar_muat_barang"
import { daftar_packing_list } from "./daftar_packing_list"
import { daftar_sales_order } from "./daftar_sales_order"
import { daftar_surat_jalan } from "./daftar_surat_jalan"
import { daftar_surat_pengantar } from "./daftar_surat_pengantar"
import { daftar_ttb } from "./daftar_ttb"
import { daftar_tujuan } from "./daftar_tujuan"
import { daftar_workorder } from "./daftar_workorder"
import { jenis_pengiriman } from "./jenis_pengiriman"
import { vechnicle } from "./mobil"
import { navigation } from "./navigation"
import { pengaturan } from "./pengaturan"
import { reference_invoice } from "./reference_invoice"
import { reference_muat_barang } from "./reference_muat_barang"
import { reference_packing_list } from "./reference_packing_list"
import { reference_sales_order } from "./reference_sales_order"
import { reference_surat_jalan } from "./reference_surat_jalan"
import { reference_surat_pengantar } from "./reference_surat_pengantar"
import { reference_ttb } from "./reference_ttb"
import { reference_workorder } from "./reference_workorder"
import { setting } from "./setting"
import { user } from "./user"
import { vendor } from "./vendor"

export const typeDefs = gql`
	${setting.types}
	${navigation.types}
	${user.types}
	${daftar_tujuan.types}
	${vendor.types}
	${customer.types}
	${jenis_pengiriman.types}
	${vechnicle.types}
	${daftar_harga.types}
	${daftar_ttb.types}
	${daftar_sales_order.types}
	${daftar_muat_barang.types}
	${daftar_surat_pengantar.types}
	${daftar_packing_list.types}
	${pengaturan.types}
	${daftar_surat_jalan.types}
	${daftar_invoice.types}
	${daftar_workorder.types}
	${accurate.types}
	${daftar_biaya_tambahan.types}
	${reference_invoice.types}
	${reference_surat_pengantar.types}
	${reference_surat_jalan.types}
	${reference_workorder.types}
	${reference_ttb.types}
	${reference_sales_order.types}
	${reference_packing_list.types}
	${reference_muat_barang.types}

	type Query {
		settings: [Setting!]

		navigation: [Navigation!]

		users(page: Int): Users
		user(id: ID): User
		userRoles: [UserRole!]
		userRole(id: ID): UserRole

		daftar_tujuan_by_id(id: Int): daftar_tujuan
		daftar_tujuan: [daftar_tujuan!]
		reference_invoice: [reference_invoice!]
		reference_invoice_by_id(id: Int): reference_invoice
		reference_surat_pengantar: [reference_surat_pengantar!]
		reference_surat_pengantar_by_id(id: Int): reference_surat_pengantar
		reference_surat_jalan: [reference_surat_jalan!]
		reference_surat_jalan_by_id(id: Int): reference_surat_jalan
		reference_workorder: [reference_workorder!]
		reference_workorder_by_id(id: Int): reference_workorder
		reference_ttb: [reference_ttb!]
		reference_ttb_by_id(id: Int): reference_ttb
		reference_sales_order: [reference_sales_order!]
		reference_sales_order_by_id(id: Int): reference_sales_order
		reference_packing_list: [reference_packing_list!]
		reference_packing_list_by_id(id: Int): reference_packing_list
		reference_muat_barang: [reference_muat_barang!]
		reference_muat_barang_by_id(id: Int): reference_muat_barang

		vendor: [vendor!]
		customer: [customer!]
		jenis_pengiriman_by_id(id: Int): jenis_pengiriman
		jenis_pengiriman: [jenis_pengiriman!]
		vechnicle: [vechnicle!]
		daftar_harga_by_id(id: Int): daftar_harga
		daftar_harga: [daftar_harga!]
		daftar_ttb: [daftar_ttb!]
		daftar_sales_order: [daftar_sales_order!]
		daftar_muat_barang: [daftar_muat_barang!]
		daftar_surat_pengantar: [daftar_surat_pengantar!]
		daftar_packing_list: [daftar_packing_list!]
		pengaturan: [pengaturan!]
		daftar_surat_jalan: [daftar_surat_jalan!]

		daftar_invoice: [daftar_invoice!]
		daftar_workorder: [daftar_workorder!]

		daftar_biaya_tambahan: [daftar_biaya_tambahan!]

		accurate: [accurate!]
	}

	type Mutation {
		updateGeneralSettings(inputs: [SettingInput!]): MutateSettingResponse!

		createNavigation(name: String!): CDNavigationResponse!
		updateNavigation(
			inputs: [UpdateNavigationInput!]
		): MutateNavigationResponse!
		deleteNavigation(id: ID!): CDNavigationResponse!

		createUser(input: CreateUserInput!): MutateUserResponse!
		updateUser(input: UpdateUserInput!): MutateUserResponse!
		deleteUser(id: ID!): MutateUserResponse!
		createUserRole(input: CreateUserRoleInput!): MutateRoleResponse!
		updateUserRole(input: UpdateUserRoleInput!): MutateRoleResponse!
		deleteUserRole(id: ID!): MutateRoleResponse!

		createDaftar_tujuan(
			input: CreateDaftar_tujuanInput!
		): MutateDaftar_tujuanResponse!
		updateDaftar_tujuan(
			input: UpdateDaftar_tujuanInput!
		): MutateDaftar_tujuanResponse!
		deleteDaftar_tujuan(id: Int): MutateDaftar_tujuanResponse!

		createReference_invoice(
			input: CreateReference_invoiceInput!
		): MutateReference_invoiceResponse!
		updateReference_invoice(
			input: UpdateReference_invoiceInput!
		): MutateReference_invoiceResponse!
		deleteReference_invoice(id: Int): MutateReference_invoiceResponse!

		createReference_surat_pengantar(
			input: CreateReference_surat_pengantarInput!
		): MutateReference_surat_pengantarResponse!
		updateReference_surat_pengantar(
			input: UpdateReference_surat_pengantarInput!
		): MutateReference_surat_pengantarResponse!
		deleteReference_surat_pengantar(
			id: Int
		): MutateReference_surat_pengantarResponse!

		createReference_surat_jalan(
			input: CreateReference_surat_jalanInput!
		): MutateReference_surat_jalanResponse!
		updateReference_surat_jalan(
			input: UpdateReference_surat_jalanInput!
		): MutateReference_surat_jalanResponse!
		deleteReference_surat_jalan(id: Int): MutateReference_surat_jalanResponse!

		createReference_workorder(
			input: CreateReference_workorderInput!
		): MutateReference_workorderResponse!
		updateReference_workorder(
			input: UpdateReference_workorderInput!
		): MutateReference_workorderResponse!
		deleteReference_workorder(id: Int): MutateReference_workorderResponse!

		createReference_ttb(
			input: CreateReference_ttbInput!
		): MutateReference_ttbResponse!
		updateReference_ttb(
			input: UpdateReference_ttbInput!
		): MutateReference_ttbResponse!
		deleteReference_ttb(id: Int): MutateReference_ttbResponse!

		createReference_sales_order(
			input: CreateReference_sales_orderInput!
		): MutateReference_sales_orderResponse!
		updateReference_sales_order(
			input: UpdateReference_sales_orderInput!
		): MutateReference_sales_orderResponse!
		deleteReference_sales_order(id: Int): MutateReference_sales_orderResponse!

		createReference_muat_barang(
			input: CreateReference_muat_barangInput!
		): MutateReference_muat_barangResponse!
		updateReference_muat_barang(
			input: UpdateReference_muat_barangInput!
		): MutateReference_muat_barangResponse!
		deleteReference_muat_barang(id: Int): MutateReference_muat_barangResponse!

		createReference_packing_list(
			input: CreateReference_packing_listInput!
		): MutateReference_packing_listResponse!
		updateReference_packing_list(
			input: UpdateReference_packing_listInput!
		): MutateReference_packing_listResponse!
		deleteReference_packing_list(id: Int): MutateReference_packing_listResponse!

		createVendor(input: CreateVendorInput!): MutateVendorResponse!
		updateVendor(input: UpdateVendorInput!): MutateVendorResponse!
		deleteVendor(id: Int): MutateVendorResponse!

		createCustomer(input: CreateCustomerInput!): MutateCustomerResponse!
		updateCustomer(input: UpdateCustomerInput!): MutateCustomerResponse!
		deleteCustomer(id: Int): MutateCustomerResponse!

		createJenis_pengiriman(
			input: CreateJenis_pengirimanInput!
		): MutateJenis_pengirimanResponse!
		updateJenis_pengiriman(
			input: UpdateJenis_pengirimanInput!
		): MutateJenis_pengirimanResponse!
		deleteJenis_pengiriman(id: Int): MutateJenis_pengirimanResponse!

		createVechnicle(input: CreateVechnicleInput!): MutateVechnicleResponse!
		updateVechnicle(input: UpdateVechnicleInput!): MutateVechnicleResponse!
		deleteVechnicle(id: Int): MutateVechnicleResponse!

		createDaftar_harga(
			input: CreateDaftar_hargaInput!
		): MutateDaftar_hargaResponse!
		updateDaftar_harga(
			input: UpdateDaftar_hargaInput!
		): MutateDaftar_hargaResponse!
		deleteDaftar_harga(id: Int): MutateDaftar_hargaResponse!

		createDaftar_ttb(input: CreateDaftar_ttbInput!): MutateDaftar_ttbResponse!
		updateDaftar_ttb(input: UpdateDaftar_ttbInput!): MutateDaftar_ttbResponse!
		deleteDaftar_ttb(id: Int): MutateDaftar_ttbResponse!

		createDaftar_sales_order(
			input: CreateDaftar_sales_orderInput!
		): MutateDaftar_sales_orderResponse!
		updateDaftar_sales_order(
			input: UpdateDaftar_sales_orderInput!
		): MutateDaftar_sales_orderResponse!
		deleteDaftar_sales_order(id: Int): MutateDaftar_sales_orderResponse!

		createDaftar_muat_barang(
			input: CreateDaftar_muat_barangInput!
		): MutateDaftar_muat_barangResponse!
		updateDaftar_muat_barang(
			input: UpdateDaftar_muat_barangInput!
		): MutateDaftar_muat_barangResponse!
		deleteDaftar_muat_barang(id: Int): MutateDaftar_muat_barangResponse!

		createDaftar_surat_pengantar(
			input: CreateDaftar_surat_pengantarInput!
		): MutateDaftar_surat_pengantarResponse!
		updateDaftar_surat_pengantar(
			input: UpdateDaftar_surat_pengantarInput!
		): MutateDaftar_surat_pengantarResponse!
		deleteDaftar_surat_pengantar(id: Int): MutateDaftar_surat_pengantarResponse!

		createDaftar_packing_list(
			input: CreateDaftar_packing_listInput!
		): MutateDaftar_packing_listResponse!

		createPengaturan(input: CreatePengaturanInput!): MutatePengaturanResponse!
		updatePengaturan(input: UpdatePengaturanInput!): MutatePengaturanResponse!
		deletePengaturan(id: Int): MutatePengaturanResponse!

		createAccurate(input: CreateAccurateInput!): MutateAccurateResponse!
		updateAccurate(input: UpdateAccurateInput!): MutateAccurateResponse!
		deleteAccurate(id: Int): MutateAccurateResponse!

		createDaftar_surat_jalan(
			input: CreateDaftar_surat_jalanInput!
		): MutateDaftar_surat_jalanResponse!
		updateDaftar_surat_jalan(
			input: UpdateDaftar_surat_jalanInput!
		): MutateDaftar_surat_jalanResponse!
		deleteDaftar_surat_jalan(id: Int): MutateDaftar_surat_jalanResponse!

		createDaftar_invoice(
			input: [CreateDaftar_invoiceInput!]
		): MutateDaftar_invoiceResponse!
		updateDaftar_invoice(
			input: [UpdateDaftar_invoiceInput!]
		): MutateDaftar_invoiceResponse!
		deleteDaftar_invoice(id: Int): MutateDaftar_invoiceResponse!

		createDaftar_biaya_tambahan(
			input: [CreateDaftar_biaya_tambahanInput!]
		): MutateDaftar_biaya_tambahanResponse!
		updateDaftar_biaya_tambahan(
			input: [UpdateDaftar_biaya_tambahanInput!]
		): MutateDaftar_biaya_tambahanResponse!
		deleteDaftar_biaya_tambahan(id: Int): MutateDaftar_biaya_tambahanResponse!

		createDaftar_workorder(
			input: CreateDaftar_workorderInput!
		): MutateDaftar_workorderResponse!
		updateDaftar_workorder(
			input: UpdateDaftar_workorderInput!
		): MutateDaftar_workorderResponse!
		deleteDaftar_workorder(id: Int): MutateDaftar_workorderResponse!
	}
`

export const resolvers = {
	Query: {
		...setting.resolvers.queries,
		...navigation.resolvers.queries,
		...user.resolvers.queries,
		...daftar_tujuan.resolvers.queries,
		...vendor.resolvers.queries,
		...customer.resolvers.queries,
		...jenis_pengiriman.resolvers.queries,
		...vechnicle.resolvers.queries,
		...daftar_harga.resolvers.queries,
		...daftar_ttb.resolvers.queries,
		...daftar_sales_order.resolvers.queries,
		...daftar_muat_barang.resolvers.queries,
		...daftar_surat_pengantar.resolvers.queries,
		...daftar_packing_list.resolvers.queries,
		...pengaturan.resolvers.queries,
		...daftar_surat_jalan.resolvers.queries,
		...daftar_invoice.resolvers.queries,
		...daftar_workorder.resolvers.queries,
		...accurate.resolvers.queries,
		...daftar_biaya_tambahan.resolvers.queries,
		...reference_invoice.resolvers.queries,
		...reference_workorder.resolvers.queries,
		...reference_surat_jalan.resolvers.queries,
		...reference_surat_pengantar.resolvers.queries,
		...reference_packing_list.resolvers.queries,
		...reference_muat_barang.resolvers.queries,
		...reference_sales_order.resolvers.queries,
		...reference_ttb.resolvers.queries
	},
	Mutation: {
		...setting.resolvers.mutations,
		...navigation.resolvers.mutations,
		...user.resolvers.mutations,
		...daftar_tujuan.resolvers.mutations,
		...vendor.resolvers.mutations,
		...customer.resolvers.mutations,
		...jenis_pengiriman.resolvers.mutations,
		...vechnicle.resolvers.mutations,
		...daftar_harga.resolvers.mutations,
		...daftar_ttb.resolvers.mutations,
		...daftar_sales_order.resolvers.mutations,
		...daftar_muat_barang.resolvers.mutations,
		...daftar_surat_pengantar.resolvers.mutations,
		...daftar_packing_list.resolvers.mutations,
		...pengaturan.resolvers.mutations,
		...daftar_surat_jalan.resolvers.mutations,
		...daftar_invoice.resolvers.mutations,
		...daftar_workorder.resolvers.mutations,
		...accurate.resolvers.mutations,
		...daftar_biaya_tambahan.resolvers.mutations,
		...reference_invoice.resolvers.mutations,
		...reference_workorder.resolvers.mutations,
		...reference_surat_jalan.resolvers.mutations,
		...reference_surat_pengantar.resolvers.mutations,
		...reference_packing_list.resolvers.mutations,
		...reference_muat_barang.resolvers.mutations,
		...reference_sales_order.resolvers.mutations,
		...reference_ttb.resolvers.mutations
	}
}
