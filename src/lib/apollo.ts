import { ApolloClient, InMemoryCache } from "@apollo/client"

const hostname = process.env.NEXT_PUBLIC_BASE_URL

const apolloClient = new ApolloClient({
	cache: new InMemoryCache(),
	uri: `${hostname}/api/graphql`
})

export default apolloClient
