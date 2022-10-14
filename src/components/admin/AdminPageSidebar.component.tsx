import IconSidebarOpen from "@assets/icons/icon-sidebar-open.svg"
import FormInput from "@components/form/FormInput.component"
import FormTextarea from "@components/form/FormTextarea.component"
import { FieldValues, UseFormReturn } from "react-hook-form"

interface Props {
	setForm: UseFormReturn<FieldValues, object>
	isShown: boolean
	close: () => void
}

export default function AdminPageSidebar({ setForm, isShown, close }: Props) {
	const { register } = setForm

	return (
		<>
			{isShown && (
				<aside className="admin-page-sidebar">
					<div className="admin-sidebar">
						<div className="admin-sidebar-head">
							<h4 className="heading">Page Settings</h4>
							<ul className="actions">
								<li className="action">
									<button
										type="button"
										onClick={close}
										className="button button-gray button-small"
									>
										<i className="icon icon-medium icon-only" role="img">
											<IconSidebarOpen className="svg" />
										</i>
									</button>
								</li>
							</ul>
						</div>
						<div className="admin-sidebar-body">
							<div className="form-fieldset">
								<div className="form-fieldset-body">
									<div className="row">
										<FormInput
											setForm={setForm}
											name="url"
											label="Page URL"
											footnote="URL cannot be changed"
											readOnly
										/>
									</div>
									<div className="row">
										<FormInput
											setForm={setForm}
											name="meta.seo.titleEN"
											label="Meta Title (EN)"
											count={70}
										/>
									</div>
									<div className="row">
										<FormInput
											setForm={setForm}
											name="meta.seo.titleJP"
											label="Meta Title (JP)"
											count={70}
										/>
									</div>
									<div className="row">
										<FormTextarea
											register={register}
											name="meta.seo.descEN"
											label="Meta Description (EN)"
											count={156}
										/>
									</div>
									<div className="row">
										<FormTextarea
											register={register}
											name="meta.seo.descJP"
											label="Meta Description (JP)"
											count={156}
										/>
									</div>
								</div>
							</div>
						</div>
					</div>
				</aside>
			)}
		</>
	)
}
