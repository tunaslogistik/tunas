import IconDashboard from "@assets/icons/icon-dashboard.svg"
import IconData from "@assets/icons/icon-data.svg"
import IconFinance from "@assets/icons/icon-finance.svg"
import IconOrder from "@assets/icons/icon-order.svg"
import IconSend from "@assets/icons/icon-send.svg"
import IconSettings from "@assets/icons/icon-setting.svg"

interface Nav {
	key: string
	href: string
	redirectHref?: string
	label: string
	icon?: any
	subnav?: Subnav[]
}

interface Subnav {
	key: string
	href: string
	redirectHref?: string
	label: string
}

export const dashboardPagesNav: Nav[] = [
	{
		key: `dashboard`,
		href: `/dashboard`,
		label: `Dashboard`,
		icon: IconDashboard
	},
	{
		key: `order`,
		href: `/order`,
		redirectHref: `/order/daftar-ttb`,
		label: `Order`,
		icon: IconOrder,
		subnav: [
			{
				key: `order-daftarttb`,
				href: `/order/daftar-ttb`,
				label: `Daftar TTB`
			},
			{
				key: `order-salesorder`,
				href: `/order/daftar-sales-order`,
				label: `Daftar Sales Order`
			}
		]
	},

	{
		key: `pengiriman`,
		href: `/pengiriman`,
		redirectHref: `/pengiriman/daftar-muat-barang`,
		label: `Pengiriman`,
		icon: IconSend,
		subnav: [
			{
				key: `pengiriman-muatbarang`,
				href: `/pengiriman/daftar-muat-barang`,
				label: `Daftar Muat Barang`
			},

			{
				key: `pengiriman-suratpengantar`,
				href: `/pengiriman/daftar-surat-pengantar`,
				label: `Daftar Surat Pengantar`
			},
			{
				key: `pengiriman-suratjalan`,
				href: `/pengiriman/daftar-surat-jalan`,
				label: `Daftar Surat Jalan`
			},
			{
				key: `pengiriman-packinglist`,
				href: `/pengiriman/daftar-packing-list`,
				label: `Daftar Packing List`
			}
		]
	},
	{
		key: `keuangan`,
		href: `#`,
		label: `Keuangan`,
		icon: IconFinance,
		subnav: [
			{
				key: `keuangan-invoice`,
				href: `/keuangan/daftar-invoice`,
				label: `Daftar Invoice`
			}
		]
	},
	{
		key: `data`,
		href: `/data`,
		redirectHref: `/data/daftar-tujuan`,
		label: `Master Data`,
		icon: IconData,
		subnav: [
			{
				key: `data-daftartujuan`,
				href: `/data/daftar-tujuan`,
				label: `Daftar Kota`
			},
			{
				key: `data-daftarharga`,
				href: `/data/daftar-harga`,
				label: `Daftar Harga`
			},
			{
				key: `jenis-pengiriman`,
				href: `/data/jenis-pengiriman`,
				label: `Jenis Pengiriman`
			},
			{
				key: `data-mobildansupir`,
				href: `/data/kendaraan`,
				label: `Kendaraan`
			},

			{
				key: `data-customer`,
				href: `/data/customer`,
				label: `Customer`
			},
			{
				key: `data-vendor`,
				href: `/data/vendor`,
				label: `Vendor`
			}
		]
	}
]

export const dashboardSettingsNav = [
	{
		key: `settings-users`,
		href: `/admin/settings/users`,
		label: `Users`
	},
	{
		key: `Pengaturan`,
		href: `/admin/rekening`,
		label: `Pengaturan`,
		icon: IconSettings
	}
	// {
	// 	key: `settings-navigation`,
	// 	href: `/admin/settings/navigation`,
	// 	label: `Navigation`
	// }
]
