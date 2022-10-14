import IconChevronDown from "@assets/icons/icon-chevron-down.svg"
import NavLink from "@components/util/NavLink.component"
import { heightMotion } from "@variables/motion.variable"
import { AnimatePresence, motion } from "framer-motion"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
interface Props {
	href: string
	redirectHref?: string
	icon?: any
	label: string
	subnav?: Subnav[]
	hasNew?: boolean
}

interface Subnav {
	key: string
	href: string
	redirectHref?: string
	label: string
}

export default function DashboardNavItem({
	href,
	redirectHref,
	icon,
	label,
	subnav,
	hasNew
}: Props) {
	const [isToggled, setIsToggled] = useState(false)
	const { asPath } = useRouter()
	const Icon = icon

	useEffect(() => {
		if (asPath === href || asPath.startsWith(href)) {
			setIsToggled(true)
		}
	}, [asPath, href])

	return (
		<li className="dashboard-nav-item">
			<div className="linker">
				<NavLink
					href={href}
					redirectHref={redirectHref}
					activeClassName="is-current"
				>
					{Icon ? (
						<button className={`link ${hasNew ? `is-updated` : ``}`}>
							<i className="icon" role="img">
								<Icon className="svg" />
							</i>
							{label}
						</button>
					) : (
						<button className={`link ${hasNew ? `is-updated` : ``}`}>
							{label}
						</button>
					)}
				</NavLink>
				{subnav?.length > 0 && (
					<button
						className={`toggle ${isToggled ? `is-toggled` : ``}`}
						onClick={() => setIsToggled(!isToggled)}
					>
						<i className="icon" role="img">
							<IconChevronDown className="svg" />
						</i>
					</button>
				)}
			</div>
			{subnav?.length > 0 && (
				<AnimatePresence>
					{isToggled && (
						<motion.ul
							className="dashboard-nav-items"
							variants={heightMotion}
							initial="hidden"
							animate="visible"
							exit="hidden"
						>
							{subnav.map((nav) => (
								<NavLink
									key={nav.key}
									href={nav.href}
									redirectHref={nav.redirectHref}
									activeClassName="is-current"
								>
									<button className="link">{nav.label}</button>
								</NavLink>
							))}
						</motion.ul>
					)}
				</AnimatePresence>
			)}
		</li>
	)
}
