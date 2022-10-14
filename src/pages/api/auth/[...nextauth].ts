import { PrismaClient } from "@prisma/client"
import { confirmPasswordHash } from "@utils/password"
import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

const prisma = new PrismaClient()

export default NextAuth({
	providers: [
		CredentialsProvider({
			name: `Credentials`,
			credentials: {
				username: { label: `Username`, type: `text`, placeholder: `admin` },
				password: { label: `Password`, type: `password`, placeholder: `••••••••••••••` }
			},
			async authorize(credentials) {
				const { username, password } = credentials

				if (username === process.env.EI8_ADMIN_USERNAME && password === process.env.EI8_ADMIN_PASSWORD) {
					return {
						id: `ei8-admin`,
						username: `ei8-admin`,
						name: `Ei8 Admin`
					}
				}
				try {
					const user = await prisma.user.findFirst({
						where: {
							username: username
						}
					})

					if (user !== null) {
						const authenticated = await confirmPasswordHash(password, user.password)

						if (authenticated) {
							return {
								id: user.id,
								username: user.username,
								name: user.name
							}
						} else {
							throw new Error(`Please check your credentials!`)
						}
					} else {
						throw new Error(`Please check your credentials!`)
					}
				} catch (error) {
					throw new Error(error)
				}
			}
		})
	],
	callbacks: {
		async jwt({ token, user }) {
			if (user) {
				token.user = user
			}

			return token
		},
		async session({ session, token }) {
			if (token.user) {
				Object.assign(session.user, token.user)
			}

			return session
		}
	},
	session: {
		strategy: `jwt`,
		maxAge: 30 * 24 * 60 * 60 // 30 days
	},
	secret: process.env.ACCESS_TOKEN_KEY,
	pages: {
		signIn: `/admin`
	}
})
