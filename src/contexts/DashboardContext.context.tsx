import { useQuery } from "@apollo/client"
import {
	dashboardPagesNav,
	dashboardSettingsNav
} from "@variables/dashboardNav.variable"
import { GET_USER } from "graphql/user/queries"
import { useSession } from "next-auth/react"
import { createContext, Dispatch, ReactNode, useEffect } from "react"
import { useImmerReducer } from "use-immer"

interface Auth {
	id?: string
	username?: string
	name?: string
	userRole?: {
		id: string
		name: string
		read: string[]
		write: string[]
	}
}

interface AuthObjectsPage {
	href: string
	icon: string
	key: string
	label: string
}

interface AuthObjectsSettings {
	href: string
	key: string
	label: string
}

interface AuthObjects {
	page?: AuthObjectsPage[]
	settings?: AuthObjectsSettings[]
}

interface AppState {
	isLoading: boolean
	auth: Auth
	authObjects: AuthObjects
	authValues: string[]
	invoice: Invoice
}

interface Props {
	children: ReactNode
}

interface Invoice {
	idInvoice: string
}

type Action =
	| { type: `set_isLoading`; payload: boolean }
	| { type: `set_auth`; payload: Auth }
	| { type: `set_authObjects`; payload: AuthObjects }
	| { type: `set_authValues`; payload: string[] }
	| { type: `set_idInvoice`; payload: string }
//initial state

const initialState: AppState = {
	isLoading: false,
	auth: {},
	authObjects: {},
	authValues: [],
	invoice: { idInvoice: `` }
}

function reducer(state: AppState, action: Action) {
	switch (action.type) {
		case `set_isLoading`:
			state.isLoading = action.payload
			return
		case `set_auth`:
			state.auth = action.payload
			return
		case `set_authObjects`:
			state.authObjects = action.payload
			return
		case `set_authValues`:
			state.authValues = action.payload
			return
		case `set_idInvoice`:
			state.invoice.idInvoice = action.payload
			return
		default:
			return state
	}
}

export const DashboardContext = createContext<{
	state: AppState
	dispatch: Dispatch<Action>
}>({ state: initialState, dispatch: () => {} })

export default function DashboardContextProvider({ children }: Props) {
	const [state, dispatch] = useImmerReducer(reducer, initialState)

	const { data: session } = useSession()

	const { data } = useQuery(GET_USER, {
		variables: {
			id: session?.user?.id
		}
	})

	useEffect(() => {
		if (!session) return
		if (session.user.id === `ei8-admin`) return

		if (data?.user) {
			dispatch({ type: `set_auth`, payload: data.user })
		}
	}, [dispatch, session, data])

	// Set authorization for Ei8 Admin
	useEffect(() => {
		if (!session) return

		if (session.user.id === `ei8-admin`) {
			const payload: Auth = {
				...session.user,
				userRole: {
					id: session.user.id,
					name: session.user.name,
					read: state.authValues,
					write: state.authValues
				}
			}
			dispatch({ type: `set_auth`, payload })
		}
	}, [dispatch, session, state.authValues])

	useEffect(() => {
		const allPages = {
			page: [],
			settings: []
		}
		const allValues = []

		dashboardPagesNav.forEach((nav) => {
			allPages.page.push(nav)
			allValues.push(nav.key)

			if (nav.subnav) {
				nav.subnav.forEach((subnav) => {
					const payload = {
						...subnav,
						label: `${nav.label} / ${subnav.label}`
					}

					allPages.page.push(payload)
					allValues.push(payload.key)
				})
			}
		})

		dashboardSettingsNav.forEach((nav) => {
			allPages.settings.push(nav)
			allValues.push(nav.key)
		})

		dispatch({ type: `set_authObjects`, payload: allPages })
		dispatch({ type: `set_authValues`, payload: allValues })
	}, [dispatch])

	return (
		<DashboardContext.Provider value={{ state, dispatch }}>
			{children}
		</DashboardContext.Provider>
	)
}
