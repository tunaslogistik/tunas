import { ApolloProvider } from "@apollo/client"
import DashboardContextProvider from "@contexts/DashboardContext.context"
import apolloClient from "@lib/apollo"
import { AnimatePresence } from "framer-motion"
import { NextPage } from "next"
import { SessionProvider } from "next-auth/react"
import { AppProps } from "next/app"
import { ReactNode } from "react"

// prettier-ignore
import "@styles/admin.scss"
import "@styles/app.scss"
import "@styles/global.scss"
import { Session } from "next-auth"

type Page<P = {}> = NextPage<P> & {
	getLayout?: (page: ReactNode) => ReactNode
}

type Props = AppProps<{ session: Session }> & {
	Component: Page
}
export default function App({ Component, pageProps, router }: Props) {
	const getLayout = Component.getLayout ?? ((page: ReactNode) => page)

	return (
		<ApolloProvider client={apolloClient}>
			<SessionProvider session={pageProps.session} refetchInterval={0}>
				<DashboardContextProvider>
					<div className="app">
						{getLayout(
							<AnimatePresence
								exitBeforeEnter
								onExitComplete={() => window.scrollTo(0, 0)}
							>
								<Component key={`page${router.route}`} {...pageProps} />
							</AnimatePresence>
						)}
					</div>
				</DashboardContextProvider>
			</SessionProvider>
		</ApolloProvider>
	)
}
