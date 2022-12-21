import { ApolloClient, InMemoryCache } from "@apollo/client"

const hostname = process.env.NEXT_PUBLIC_BASE_URL

const apolloClient = new ApolloClient({
	cache: new InMemoryCache(),
	uri: `${hostname}/api/graphql`,
	//no cache policy
	defaultOptions: {
		watchQuery: {
			fetchPolicy: `no-cache`,
			errorPolicy: `ignore`
		},
		query: {
			fetchPolicy: `no-cache`,
			errorPolicy: `all`
		}
	}
})

export default apolloClient
