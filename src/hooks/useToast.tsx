import { useRef } from "react"
import { toastsVar } from "src/store/apollo.store"

export default function useToast() {
	const timerRef = useRef(null)

	const autohide = 4000

	function setupToastClearer() {
		timerRef.current = setTimeout(function () {
			toastsVar([])
		}, autohide + 500)
	}

	function cancelToastClearer() {
		clearTimeout(timerRef.current)
	}

	function setToast(data) {
		cancelToastClearer()
		setupToastClearer()

		const { code, success, message } = data
		const newToast = {
			text: message,
			footnote: !success && code ? `Error code: ${code}` : ``,
			type: success ? `success` : `error`,
			align: `app`,
			autohide
		}

		toastsVar([
			...toastsVar(),
			newToast
		])

		if (!success) {
			console.dir(data)
		}
	}

	return { setToast }
}