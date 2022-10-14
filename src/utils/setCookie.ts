export const setCookieForLogin = (key: string, value: any, expiredTime: number) => {
	const now = new Date()
	const expiresIn = now.setSeconds(now.getSeconds() + (expiredTime))
	const expires = new Date(expiresIn).toUTCString()
	document.cookie = `${key}=${value}; expires=${expires}; SameSite=None; Secure`
}

export const setCookieForLogout = (key: string, value: any) => {
	const expires = new Date(0).toUTCString()
	document.cookie = `${key}=${value}; expires=${expires}; SameSite=None; Secure`
}