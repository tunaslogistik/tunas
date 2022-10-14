import { ApolloError } from "@apollo/client"
import { ReactNode } from "react"

interface Props {
	children: ReactNode
	loading: boolean
	error: ApolloError
}

export default function QueryResult({ children, loading, error }: Props) {
	if (error) {
		console.dir(error.networkError)
		return <p>ERROR: {error.message}</p>
	}

	// TODO: better loading visual
	if (loading) {
		return <div className={`${loading ? `is-loading` : ``}`}></div>
	}

	return <>{children}</>
}
