import bcrypt from 'bcrypt'

export function encryptPassword(password: string): Promise<string> {
	return new Promise(resolve => {
		bcrypt.hash(password, 10, function (_error, hash) {
			resolve(hash)
		})
	})
}

export function confirmPasswordHash(password: string, hashedPassword: string): Promise<boolean> {
	return new Promise(resolve => {
		bcrypt.compare(password, hashedPassword, function (_error, result) {
			resolve(result)
		})
	})
}