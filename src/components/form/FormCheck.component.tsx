import { FieldValues, UseFormRegister } from "react-hook-form"

interface Props {
	register: UseFormRegister<FieldValues>
	type: string
	name: string
	value?: any
	label?: string
	onChange?: (event: any) => void
	heading?: string
	error?: string
	styleReadOnly?: boolean
	styleCenter?: boolean
	[x: string]: any
}

export default function FormCheck({ register, type, name, label, value, onChange, heading, error, styleReadOnly, styleCenter, ...attrs }: Props) {

	return (
		<div className="form-check">
			{heading &&
			<p className="form-check-heading">{heading}</p>
			}
			{error &&
			<p className="form-check-error">{error}</p>
			}
			<div className={`form-check-field ${styleCenter ? `form-check-field-center` : ``}`}>
				<>
					<input
						type={type}
						id={name}
						className={`input ${styleReadOnly ? `input-readonly` : ``}`}
						value={value}
						{...attrs}
						{...register(name, { onChange })}
					/>
					{label &&
						<label htmlFor={name} className="label">{label}</label>
					}
				</>
			</div>
		</div>
	)
}
