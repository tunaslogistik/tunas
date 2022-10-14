import { formatDate, parseDate } from "@utils/date"
import { ReactElement } from "react"
import ReactDatePicker from "react-datepicker"
import 'react-datepicker/dist/react-datepicker.css'
import { Control, Controller } from "react-hook-form"

interface Props {
	control: Control
	name: string
	dateFormat?: string
	valueType?: string
	label?: string
	placeholder?: string
	icon?: any
	footnote?: string | ReactElement
	styleLarge?: boolean
	[x: string]: any
}

export default function FormDatepicker({ control, name, dateFormat = `dd/MM/yyyy`, valueType = `date`, label, placeholder, icon, footnote, styleLarge, ...attrs }: Props) {
	const Icon = icon

	return (
		<div className="form-input">
			{label &&
			<label htmlFor={name} className="form-input-heading">{label}</label>
			}
			<div className="form-input-field">
				{Icon &&
				<i className="icon" role="img"><Icon className="svg" /></i>
				}
				{control &&
				<Controller
					control={control}
					name={name}
					render={({ field: { onChange, onBlur, value } }) => (
						<ReactDatePicker
							className={`input ${styleLarge ? `input-large` : ``}`}
							dateFormat={dateFormat}
							minDate={new Date()}
							onChange={valueType === `string` ? (date) => onChange(formatDate(date, dateFormat)) : onChange}
							onBlur={onBlur}
							selected={valueType === `string` ? parseDate(value, dateFormat) : value}
							placeholderText={placeholder}
							showYearDropdown
							{...attrs}
						/>
					)
					}
				/>
				}
			</div>
			{footnote &&
			<p className="form-input-footnote">{footnote}</p>
			}
		</div>
	)
}