export default async function handler({}, res) {
	const myHeaders = new Headers()
	myHeaders.append(`X-Session-ID`, `22f7af2e-1016-4c26-911f-91dd48b69c3b`)
	myHeaders.append(
		`Authorization`,
		`Bearer 8b9f1e47-3f48-47bc-87f0-ab9f3aecd515`
	)

	const requestOptions = {
		method: `GET`,
		headers: myHeaders
	}

	try {
		const result = await fetch(
			`https://public.accurate.id/accurate/api/tax/list.do?Scope: tax_view&sp.pageSize=10000`,
			requestOptions
		)
		const data = await result.json()
		res.status(200).json(data.d)
	} catch (error) {
		console.log(error)
		res.status(500).json(error)
	}
}
