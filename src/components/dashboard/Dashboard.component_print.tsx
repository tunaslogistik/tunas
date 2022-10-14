import { useReactiveVar } from "@apollo/client"
import { DashboardContext } from "@contexts/DashboardContext.context"
import { useSession } from "next-auth/react"
import { useRouter } from "next/router"
import { ReactNode, useContext, useEffect } from "react"
import { toastsVar } from "src/store/apollo.store"

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
			<main className={`dashboard-main ${state.isLoading ? `is-loading` : ``}`}>
				<div className="dashboard-main-inner">{children}</div>
			</main>
		</div>
	)
}
