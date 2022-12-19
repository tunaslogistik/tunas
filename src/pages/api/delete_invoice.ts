//delete invoice
export default async function handler(req, res) {
	var myHeaders = new Headers()
	myHeaders.append(
		`Authorization`,
		`Bearer 8b9f1e47-3f48-47bc-87f0-ab9f3aecd515`
	)
	myHeaders.append(`X-Session-ID`, `22f7af2e-1016-4c26-911f-91dd48b69c3b`)
	myHeaders.append(
		`Cookie`,
		`JSESSIONID=EF702D38172753496D9445A5FFDEC43B.accurate_accurateapp_accuratewwb3`
	)

	var requestOptions = {
		method: `POST`,
		headers: myHeaders
	}

	try {
		const response = await fetch(
			//from request body
			`https://public.accurate.id/accurate/api/sales-invoice/delete.do?Scope: sales_invoice_save&id=${req.body.id}`,
			requestOptions
		)
		const result = await response.text()
		console.log(`result`, result)
		res.status(200).json({ result })
	} catch (error) {
		console.log(`error`, error)
		res.status(400).json({ error })
	}
}
