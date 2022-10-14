import { useReactiveVar } from "@apollo/client"
import { DashboardContext } from "@contexts/DashboardContext.context"
import { useContext, useEffect } from "react"
import { loadingVar } from "src/store/apollo.store"

export default function useLoading() {
	const { dispatch } = useContext(DashboardContext)
	const loading = useReactiveVar(loadingVar)

	useEffect(() => {
		if (loading > 0) {
			dispatch({ type: `set_isLoading`, payload: true })
		} else {
			dispatch({ type: `set_isLoading`, payload: false })
		}
	}, [ dispatch, loading ])

	function setLoading(loading: boolean) {
		if (loading) {
			loadingVar(loadingVar() + 1)
		} else {
			loadingVar(loadingVar() - 1)
		}
	}

	return {
		setLoading
	}
}