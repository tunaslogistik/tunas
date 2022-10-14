import AdminPageSidebar from "@components/admin/AdminPageSidebar.component"
import Access from "@components/util/Access.component"
import IconSidebar from "public/assets/icons/icon-sidebar.svg"
import { ReactElement, ReactNode, useState } from "react"
import { FieldValues, UseFormReturn } from "react-hook-form"

interface Props {
	children: ReactNode
	setForm: UseFormReturn<FieldValues, object>
	authId: string
	title: string
	parent?: string | ReactElement
	legend?: string
	action?: `single` | ReactElement
	sidebar?: boolean
}

export default function AdminPage({
	children,
	setForm,
	authId,
	title,
	parent,
	legend,
	action = `single`,
	sidebar
}: Props) {
	const [showSidebar, setShowSidebar] = useState(false)
	const {
		formState: { isDirty }
	} = setForm

	return (
		<div className="admin-page">
			<header className="admin-page-header">
				{title && (
					<div className="admin-header">
						<div className="admin-header-heading">
							{legend && <p className="legend">{legend}</p>}
							<h1 className="title">
								{parent && <span className="parent">{parent} / </span>}
								{title}
							</h1>
						</div>
						<div className="admin-header-action">
							{action === `single` ? (
								<ul className="actions">
									<Access
										auth={`write:${authId}`}
										yes={
											<li className="action">
												<button
													type="submit"
													className="button button-small"
													disabled={!isDirty}
												>
													Save
												</button>
											</li>
										}
									/>
									{sidebar && (
										<li className="action">
											<button
												type="button"
												onClick={() => setShowSidebar(true)}
												className="button button-gray button-small"
											>
												<i className="icon icon-medium icon-only" role="img">
													<IconSidebar className="svg" />
												</i>
											</button>
										</li>
									)}
								</ul>
							) : (
								<>{action}</>
							)}
						</div>
					</div>
				)}
			</header>
			<div className="admin-page-content">{children}</div>

			{sidebar && (
				<AdminPageSidebar
					isShown={showSidebar}
					close={() => setShowSidebar(false)}
					setForm={setForm}
				/>
			)}
		</div>
	)
}
