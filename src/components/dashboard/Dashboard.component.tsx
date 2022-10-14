import { useReactiveVar } from "@apollo/client"
import DashboardUser from "@components/dashboard/DashboardUser.component"
import EiNotification from "@components/ei/EiNotification.component"
import Access from "@components/util/Access.component"
import { DashboardContext } from "@contexts/DashboardContext.context"
import {
	dashboardPagesNav,
	dashboardSettingsNav
} from "@variables/dashboardNav.variable"
import { useSession } from "next-auth/react"
import Image from "next/image"
import { useRouter } from "next/router"
import { ReactNode, useContext, useEffect } from "react"
import { toastsVar } from "src/store/apollo.store"
import DashboardNavItem from "./DashboardNavItem.component"

interface Props {
	children: ReactNode
	isLoading?: boolean
}

export default function Dashboard({ children }: Props) {
	const { state } = useContext(DashboardContext)
	const toasts = useReactiveVar(toastsVar)

	const { data: session, status } = useSession()
	const router = useRouter()

	useEffect(() => {
		if (!session && status !== `loading`) {
			router.push(`/admin`)
		}
	}, [router, session, status])

	if (typeof window !== `undefined` && status === `loading`) {
		return null
	}

	// AccessDenied component can be added here
	if (!session) {
		return null
	}

	return (
		<div className="dashboard">
			{toasts.length > 0 && (
				<div className="dashboard-toast">
					<div className="dashboard-toast-items">
						{toasts.map((toast, i) => (
							<div key={`notification-${i}`} className="dashboard-toast-item">
								<EiNotification
									text={toast.text}
									footnote={toast.footnote}
									type={toast.type}
									align={toast.align}
									autohide={toast.autohide}
								/>
							</div>
						))}
					</div>
				</div>
			)}
			<header className="dashboard-header">
				<div className="dashboard-header-inner">
					<section className="section section-brand">
						<div className="dashboard-brand">
							<div className="dashboard-brand-logo">
								<div className="favicon">
									<Image
										src="/assets/favicon.svg"
										alt="Favicon"
										width={32}
										height={32}
									/>
								</div>
							</div>
						</div>
					</section>
					<section className="section section-primary">
						<div className="dashboard-nav">
							<ul className="dashboard-nav-items">
								{dashboardPagesNav.map((nav) => (
									<Access
										key={nav.key}
										auth={`read:${nav.key}`}
										yes={
											<DashboardNavItem
												href={nav.href}
												redirectHref={nav.redirectHref}
												label={nav.label}
												icon={nav.icon}
												subnav={nav.subnav}
											/>
										}
									/>
								))}
							</ul>
						</div>
					</section>
					<section className="section section-primary">
						<div className="dashboard-nav dashboard-nav-settings">
							{/* <p className="dashboard-nav-label">Settings</p> */}
							<ul className="dashboard-nav-items">
								{dashboardSettingsNav.map((nav) => (
									<Access
										key={nav.key}
										auth={`read:${nav.key}`}
										yes={<DashboardNavItem href={nav.href} label={nav.label} />}
									/>
								))}
							</ul>
						</div>
					</section>
					<section className="section section-end">
						<DashboardUser session={session} />
					</section>
				</div>
			</header>
			<main className={`dashboard-main ${state.isLoading ? `is-loading` : ``}`}>
				<div className="dashboard-main-inner">{children}</div>
			</main>
		</div>
	)
}
