import { DashboardContext } from "@contexts/DashboardContext.context"
import { ReactElement, useContext } from "react"

interface Props {
	auth: string
	except?: boolean
	yes: ReactElement
	no?: ReactElement
}

export default function Access({ auth, except, yes, no }: Props) {
	const { state } = useContext(DashboardContext)

	function authCheck(auth: string) {
		if (except) return true

		const [ability, key] = auth.split(`:`)

		if (!state?.auth?.userRole?.[ability]) return false

		if (state.auth.userRole[ability].includes(key)) {
			return true
		}

		return false
	}

	return <>{authCheck(auth) ? yes : no}</>
}
