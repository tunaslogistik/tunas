import OutsideClick from "@components/util/OutsideClick.component"
import { DashboardContext } from "@contexts/DashboardContext.context"
import { getInitial } from "@utils/string"
import { slideUpMotion } from "@variables/motion.variable"
import { AnimatePresence, motion } from "framer-motion"
import { signOut } from "next-auth/react"
import Link from "next/link"
import { useContext, useState } from "react"

export default function DashboardUser({ session }) {
	const { state } = useContext(DashboardContext)
	const [isToggled, setIsToggled] = useState(false)

	return (
		<OutsideClick runFunction={() => setIsToggled(false)}>
			<div className="dashboard-user">
				<div
					onClick={() => setIsToggled(!isToggled)}
					className={`dashboard-user-avatar ${isToggled ? `is-toggled` : ``}`}
				>
					<p className="initial">{getInitial(state.auth.name)}</p>
					<p className="name">{state.auth.name}</p>
				</div>
				<AnimatePresence>
					{isToggled && (
						<motion.div
							className="dashboard-user-menu"
							variants={slideUpMotion}
							initial="hidden"
							animate="visible"
							exit="hidden"
						>
							<div className="dashboard-user-info">
								<p className="initial">{getInitial(state.auth.name)}</p>
								<div className="account">
									<p className="name">{state.auth.name}</p>
									<p className="username">{state.auth.username}</p>
								</div>
							</div>
							<div className="dashboard-user-nav">
								<ul className="items">
									<li className="item">
										<Link href={`/admin/settings/users/${state.auth.id}`}>
											<a className="link">Your Account</a>
										</Link>
									</li>
									<li className="item">
										<button onClick={() => signOut()} className="link">
											Sign out
										</button>
									</li>
								</ul>
							</div>
						</motion.div>
					)}
				</AnimatePresence>
			</div>
		</OutsideClick>
	)
}
