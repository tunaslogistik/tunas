import { DetailedHTMLProps, ReactElement, TextareaHTMLAttributes } from "react"
import { FieldValues, UseFormRegister } from "react-hook-form"

interface Props extends DetailedHTMLProps<TextareaHTMLAttributes<HTMLTextAreaElement>, HTMLTextAreaElement> {
	register: UseFormRegister<FieldValues>
	name: string
	label?: string
	icon?: any
	footnote?: string | ReactElement
	error?: string
	[x: string]: any
}

export default function FormTextarea(props: Props) {
	const { register, name, label, icon, footnote, error, ...attrs } = props
	const Icon = icon

	return (
		<div className="form-input">
			{label &&
			<label htmlFor={name} className="form-input-heading">{label}</label>
			}
			<div className={`form-input-field ${error ? `is-error` : ``}`}>
				{Icon &&
				<i className="icon" role="img"><Icon className="svg" /></i>
				}
				<textarea id={name} className="input input-textarea" {...attrs} {...register(name)}></textarea>
			</div>
			{footnote && !error &&
			<p className="form-input-footnote">{footnote}</p>
			}
			{error &&
			<p className="form-input-error">{error}</p>
			}
		</div>
	)
}