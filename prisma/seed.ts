import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

const users = [
	{
		name: `Benny Jien`,
		username: `bennyjien`,
		password: `$2b$10$AantRulvuVA5tutvfb1z.Ok71JGhPT0DakOJE0UQ874uPWd/N1Xx2`,
		email: `benny@mail.com`,
		cabang: `Jakarta`,
		creator: `bennyjien`,
		role: `superadmin`
	}
]

const userRoles = [
	{
		id: `superadmin`,
		name: `Super Admin`,
		read: [
			`home`,
			`about`,
			`consultation`,
			`works`,
			`settings-general`,
			`settings-navigation`,
			`settings-users`
		],
		write: [
			`home`,
			`about`,
			`consultation`,
			`works`,
			`settings-general`,
			`settings-navigation`,
			`settings-users`
		]
	},
	{
		id: `admin`,
		name: `Admin`,
		read: [
			`home`,
			`about`,
			`consultation`,
			`works`,
			`settings-general`,
			`settings-navigation`,
			`settings-users`
		],
		write: [ `home`, `about`, `consultation`, `works` ]
	},
	{
		id: `user`,
		name: `User`,
		read: [
			`home`,
			`about`,
			`contact`,
			`settings-general`,
			`settings-navigation`,
			`settings-users`
		],
		write: []
	}
]

const navigation = [
	{
		name: `Menu Navigation`
	}
]

async function main() {
	await prisma.user.deleteMany()
	await prisma.userRole.deleteMany()
	await prisma.navigation.deleteMany()

	await prisma.userRole.createMany({ data: userRoles })
	await prisma.user.createMany({ data: users })
	await prisma.navigation.createMany({ data: navigation })
}

main()
	.catch((e) => {
		console.error(e)
		process.exit(1)
	})
	.finally(async () => await prisma.$disconnect)
