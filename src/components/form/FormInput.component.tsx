import IconEyeOff from "@assets/icons/icon-eye-off.svg"
import IconEye from "@assets/icons/icon-eye.svg"
import {
	DetailedHTMLProps,
	InputHTMLAttributes,
	ReactElement,
	useEffect,
	useState
} from "react"
import { FieldValues, UseFormReturn } from "react-hook-form"

interface Props
	extends DetailedHTMLProps<
		InputHTMLAttributes<HTMLInputElement>,
		HTMLInputElement
	> {
	setForm: UseFormReturn<FieldValues, object>
	type?: string
	name: string
	label?: string
	error?: string
	icon?: any
	footnote?: string | ReactElement
	count?: number
	styleLarge?: boolean
	[x: string]: any
	index?: number
}

export default function FormInput({
	index,
	setForm,
	type = `text`,
	name,
	label,
	error,
	icon,
	footnote,
	count,
	styleLarge,
	...attrs
}: Props) {
	const [ charCount, setCharCount ] = useState(0)
	const [ passReveal, setPassReveal ] = useState(false)
	const Icon = icon

	const { register, watch } = setForm

	let watchInput

	if (count) {
		watchInput = watch(name)
	}

	useEffect(() => {
		if (!watchInput) return

		handleCharCount(watchInput)
	}, [ watchInput ])

	function handleCharCount(string: string) {
		setCharCount(() => string.length)
	}

	return (
		<div className="form-input">
			{label && (
				<label htmlFor={name} className="form-input-heading">
					{label}
				</label>
			)}
			<div className={`form-input-field ${error ? `is-error` : ``}`}>
				{Icon && (
					<i className="icon" role="img">
						<Icon className="svg" />
					</i>
				)}

				{type !== `password` && (
					<input
						type={passReveal ? `password` : `text`}
						id={name}
						className={`input ${styleLarge ? `input-large` : ``}`}
						{...attrs}
						{...register(name)}
					/>
				)}

				{type === `password` && (
					<>
						<input
							type={passReveal ? `text` : `password`}
							id={name}
							className={`input ${styleLarge ? `input-large` : ``}`}
							{...attrs}
							{...register(name)}
						/>
						<button
							type="button"
							onClick={() => setPassReveal(!passReveal)}
							className="reveal"
						>
							<i className="icon" role="img">
								{passReveal ? (
									<IconEyeOff className="svg" />
								) : (
									<IconEye className="svg" />
								)}
							</i>
						</button>
					</>
				)}
			</div>
			{footnote && !error && <p className="form-input-footnote">{footnote}</p>}
			{count && (
				<p className="form-input-counter">
					Recommended: {count} characters. You’ve used{` `}
					<span className={`count ${charCount > count ? `is-exceeded` : ``}`}>
						{charCount}
					</span>
					.
				</p>
			)}
			{error && <p className="form-input-error">{error}</p>}
		</div>
	)
}
