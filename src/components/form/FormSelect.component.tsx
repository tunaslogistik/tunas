import { ReactElement } from "react"
import { Control, Controller } from "react-hook-form"
import ReactSelect from "react-select"

interface Option {
	value: string
	label: string
}
interface Props {
	control: Control
	name: string
	options: Option[]
	label?: string
	footnote?: string | ReactElement
	required?: string
	error?: string
	styleInline?: boolean
	[x: string]: any
}

export default function FormSelect({ control, name, options, label, footnote, required, error, styleInline, ...attrs }: Props) {

	return (
		<div className={`form-input ${styleInline ? `form-input-inline` : ``}`}>
			{label &&
			<label htmlFor={name} className="form-input-heading">{label}</label>
			}
			<div className={`form-input-select form-input-field ${error ? `is-error` : ``}`}>
				{control &&
					<Controller
						control={control}
						name={name}
						rules={{ required }}
						render={({ field: { onChange, value, ...restField } }) =>
							<ReactSelect
								id={name}
								instanceId={name}
								className="input react-select"
								classNamePrefix="react-select"
								options={options}
								onChange={val =>
									Array.isArray(val) ?
										onChange(val.map(option => option.value))
										:
										onChange(val.value)
								}
								value={options?.filter(option =>
									Array.isArray(value) ?
										value.includes(option.value)
										:
										option.value === value
								)}
								{...restField}
								{...attrs}
							/>
						}
					/>
				}
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