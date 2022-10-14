import prisma from '@lib/prisma'
import { PrismaClient } from '@prisma/client'

export type Context = {
	prisma: PrismaClient
}

export async function createContext(): Promise<Context> {
	return {
		prisma,
	}
}