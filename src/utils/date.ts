import { format, parse } from "date-fns"
import { id } from 'date-fns/locale'

export function formatDate(date, token = `yyyy-mm-dd`) {
	if (!date) return
	if (typeof date === `number`) {
		return format(new Date(date * 1000), token, {
			locale: id
		})
	} else {
		return format(new Date(date), token, {
			locale: id
		})
	}
}

export function parseDate(date, token = `yyyy-mm-dd`) {
	if (!date) return
	return parse(date, token, new Date())
}