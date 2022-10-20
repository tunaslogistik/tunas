import IconDraggable from "@assets/icons/icon-draggable.svg"
import IconPlus from "@assets/icons/icon-plus-fill.svg"
import IconTrash from "@assets/icons/icon-trash.svg"
import EiPopup from "@components/ei/EiPopup.component"
import { useEffect, useMemo, useState } from "react"
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd"
import {
	Control,
	FieldValues,
	useFieldArray,
	UseFormGetValues,
	UseFormRegister,
	UseFormReturn,
	UseFormSetValue
} from "react-hook-form"
import FormCheck from "./FormCheck.component"
import FormDatepicker from "./FormDatepicker.component"
import FormFile from "./FormFile.component"
import FormInput from "./FormInput.component"
import FormSelect from "./FormSelect.component"
import FormTextarea from "./FormTextarea.component"
import FormWysiwyg from "./FormWysiwyg.component"

interface Props {
	setForm: UseFormReturn<FieldValues, object>
	control: Control<any, any>
	register: UseFormRegister<any>
	setValue?: UseFormSetValue<any>
	getValues?: UseFormGetValues<any>
	name: string
	inputNames: string[]
	inputTypes?: string[]
	inputHeading?: string
	inputLabels?: string[]
	inputProps?: object[]
	inputWidths?: string[]
	inputShown?: number
	max?: number
	sortable?: boolean
	disabled?: boolean
}

export default function FormRepeater({
	setForm,
	control,
	register,
	setValue,
	getValues,
	name,
	inputNames,
	inputTypes,
	inputHeading,
	inputLabels,
	inputProps = [],
	inputWidths = [],
	inputShown = 99,
	max = 99,
	sortable,
	disabled
}: Props) {
	const [winReady, setWinReady] = useState(false)
	const [oneLeft, setOneLeft] = useState(false)
	const [maxOut, setMaxOut] = useState(false)

	if (!inputWidths.length) {
		const inputWidth = `${100 / inputNames.length}%`

		inputWidths = inputNames.map(() => inputWidth)
	}

	const { fields, append, move, remove } = useFieldArray({
		control,
		name
	})
	//BUG: "title.en" will create input name "title.en" not object title.en
	const newRepeater = useMemo(
		() =>
			inputNames
				.map((inputName) => inputName.split(`.`)[0])
				.reduce((a, b) => ({ ...a, [b]: `` }), {}),
		[inputNames]
	)

	function addRepeater() {
		if (fields.length < max) {
			append(newRepeater)
			setOneLeft(false)
		} else {
			setMaxOut(true)
		}
	}

	function removeRepeater(index) {
		if (fields.length > 0) {
			remove(index)
		}
		if (fields.length === 2) {
			setOneLeft(true)
		}
		setMaxOut(false)
	}

	function handleDragEnd({ source, destination }) {
		if (destination) {
			move(source.index, destination.index)
		}
	}

	// NextJS is too fast to load, make sure DOM is ready
	useEffect(() => {
		setWinReady(true)
	}, [])

	return (
		<div className="form-repeater">
			<table className="form-repeater-table">
				<thead className="form-repeater-head">
					<tr>
						{inputHeading && (
							<th
								className="heading"
								colSpan={inputShown + 1 || inputNames.length + 1}
							>
								{inputHeading}
							</th>
						)}
						{!inputHeading && inputLabels && (
							<>
								<th className={`handle ${!sortable ? `is-hidden` : ``}`}></th>
								{inputLabels.map(
									(label, i) =>
										i < inputShown && (
											<th
												key={i}
												style={{
													width: inputWidths[i],
													color: `black`,
													fontSize: `12px`,
													paddingTop: `2%`
												}}
											>
												{label}
											</th>
										)
								)}
							</>
						)}
						{!disabled && (
							<th className="action">
								<button
									onClick={() => addRepeater()}
									type="button"
									className="form-repeater-add button"
									title="Add Row"
								>
									<i className="icon" role="img">
										<IconPlus className="svg" />
									</i>
								</button>
							</th>
						)}
					</tr>
				</thead>
				{winReady && (
					<DragDropContext onDragEnd={handleDragEnd}>
						<Droppable droppableId="repeaters">
							{(provided) => (
								<tbody
									className="form-repeater-fields"
									{...provided.droppableProps}
									ref={provided.innerRef}
								>
									{fields.map((field, i) => (
										<Draggable
											key={`item-${i}`}
											draggableId={`item-${i}`}
											index={i}
										>
											{(provided) => (
												<FormRepeaterField
													field={field}
													i={i}
													provided={provided}
													setForm={setForm}
													register={register}
													control={control}
													setValue={setValue}
													getValues={getValues}
													sortable={sortable}
													name={name}
													inputNames={inputNames}
													inputTypes={inputTypes}
													inputLabels={inputLabels}
													inputWidths={inputWidths}
													inputProps={inputProps}
													inputShown={inputShown}
													removeRepeater={removeRepeater}
													oneLeft={oneLeft}
													disabled={disabled}
												/>
											)}
										</Draggable>
									))}
									{provided.placeholder}
								</tbody>
							)}
						</Droppable>
					</DragDropContext>
				)}
			</table>

			{maxOut && (
				<p className="form-repeater-alert">
					Maximum number of rows is <strong>{max}</strong>.
				</p>
			)}
		</div>
	)
}

function FormRepeaterField({
	field,
	i,
	provided,
	setForm,
	register,
	control,
	setValue,
	getValues,
	sortable,
	name,
	inputNames,
	inputTypes,
	inputLabels,
	inputWidths,
	inputProps,
	inputShown,
	removeRepeater,
	oneLeft,
	disabled
}) {
	const [showPopup, setShowPopup] = useState(false)

	return (
		<tr
			className="form-repeater-field"
			ref={provided.innerRef}
			{...provided.draggableProps}
		>
			<td
				className={`handle ${!sortable ? `is-hidden` : ``}`}
				{...provided.dragHandleProps}
			>
				<i className="icon" role="img">
					<IconDraggable className="svg" />
				</i>
			</td>

			{inputNames.map(
				(inputName, j) =>
					j < inputShown && (
						<td key={`${field.id}-${j}`} style={{ width: inputWidths[j] }}>
							{(!inputTypes || inputTypes[j] === `text`) && (
								<FormInput
									setForm={setForm}
									name={`${name}.${i}.${inputName}`}
									placeholder={inputLabels ? inputLabels[j] : inputName}
									index={j}
									{...inputProps[j]}
								/>
							)}
							{inputTypes && inputTypes[j] === `date` && (
								<FormDatepicker
									type={inputTypes[j]}
									control={control}
									name={`${name}.${i}.${inputName}`}
									placeholder={inputLabels ? inputLabels[j] : inputName}
									{...inputProps[j]}
								/>
							)}
							{(!inputTypes || inputTypes[j] === `select`) && (
								<FormSelect
									setForm={setForm}
									name={`${name}.${i}.${inputName}`}
									placeholder={inputLabels ? inputLabels[j] : inputName}
									index={j}
									{...inputProps[j]}
								/>
							)}
							{inputTypes && inputTypes[j] === `textarea` && (
								<FormTextarea
									register={register}
									name={`${name}.${i}.${inputName}`}
									placeholder={inputLabels ? inputLabels[j] : inputName}
									{...inputProps[j]}
								/>
							)}
							{inputTypes && inputTypes[j] === `wysiwyg` && (
								<FormWysiwyg
									setValue={setValue}
									getValues={getValues}
									name={`${name}.${i}.${inputName}`}
									{...inputProps[j]}
								/>
							)}
							{inputTypes && inputTypes[j] === `checkbox` && (
								<FormCheck
									register={register}
									type="checkbox"
									name={`${name}.${i}.${inputName}`}
									label={inputLabels ? inputLabels[j] : inputName}
									{...inputProps[j]}
								/>
							)}
							{inputTypes &&
								(inputTypes[j] === `file` || inputTypes[j] === `image`) && (
									<FormFile
										control={control}
										name={`${name}.${i}.${inputName}`}
										type={inputTypes[j]}
										{...inputProps[j]}
									/>
								)}
						</td>
					)
			)}

			<td className="action">
				<ul className="items">
					{inputNames.length > inputShown && (
						<li className="item">
							<button
								type="button"
								onClick={() => setShowPopup(true)}
								className="button button-ghost"
							>
								More
							</button>
						</li>
					)}
					{!disabled && (
						<li className="item">
							<i className="icon" role="img" onClick={() => removeRepeater(i)}>
								<IconTrash className="svg" />
							</i>
						</li>
					)}
				</ul>

				<EiPopup
					isShown={showPopup}
					close={() => setShowPopup(false)}
					closeIcon
					styleLarge
				>
					<div className="form-fieldset">
						<div className="form-fieldset-body">
							{inputNames.map((inputName, j) => (
								<div key={`${field.id}-${j}`} className="row">
									{(!inputTypes || inputTypes[j] === `text`) && (
										<FormInput
											setForm={setForm}
											name={`${name}.${i}.${inputName}`}
											label={inputLabels ? inputLabels[j] : inputName}
											placeholder={inputLabels ? inputLabels[j] : inputName}
											{...inputProps[j]}
										/>
									)}
									{inputTypes && inputTypes[j] === `date` && (
										<FormDatepicker
											type={inputTypes[j]}
											control={control}
											name={`${name}.${i}.${inputName}`}
											label={inputLabels ? inputLabels[j] : inputName}
											placeholder={inputLabels ? inputLabels[j] : inputName}
											{...inputProps[j]}
										/>
									)}
									{inputTypes && inputTypes[j] === `textarea` && (
										<FormTextarea
											register={register}
											name={`${name}.${i}.${inputName}`}
											label={inputLabels ? inputLabels[j] : inputName}
											placeholder={inputLabels ? inputLabels[j] : inputName}
											{...inputProps[j]}
										/>
									)}
									{inputTypes && inputTypes[j] === `wysiwyg` && (
										<FormWysiwyg
											setValue={setValue}
											getValues={getValues}
											label={inputLabels ? inputLabels[j] : inputName}
											name={`${name}.${i}.${inputName}`}
											{...inputProps[j]}
										/>
									)}
									{inputTypes && inputTypes[j] === `checkbox` && (
										<FormCheck
											register={register}
											type="checkbox"
											name={`${name}.${i}.${inputName}`}
											label={inputLabels ? inputLabels[j] : inputName}
											{...inputProps[j]}
										/>
									)}
									{inputTypes &&
										(inputTypes[j] === `file` || inputTypes[j] === `image`) && (
											<FormFile
												control={control}
												name={`${name}.${i}.${inputName}`}
												label={inputLabels ? inputLabels[j] : inputName}
												type={inputTypes[j]}
												{...inputProps[j]}
												footnote={inputProps[j]?.title}
												styleNoButton={false}
												styleNoPlaceholder={false}
											/>
										)}
								</div>
							))}
						</div>
						<div className="form-fieldset-submit form-fieldset-submit-right">
							<button
								type="button"
								onClick={() => setShowPopup(false)}
								className="button"
							>
								Finish editing
							</button>
						</div>
					</div>
				</EiPopup>
			</td>
		</tr>
	)
}
