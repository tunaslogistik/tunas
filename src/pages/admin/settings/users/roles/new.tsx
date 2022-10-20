import { useMutation } from "@apollo/client"
import AdminPage from "@components/admin/AdminPage.component"
import Dashboard from "@components/dashboard/Dashboard.component"
import FormCheck from "@components/form/FormCheck.component"
import FormInput from "@components/form/FormInput.component"
import Access from "@components/util/Access.component"
import { DashboardContext } from "@contexts/DashboardContext.context"
import { yupResolver } from "@hookform/resolvers/yup"
import useLoading from "@hooks/useLoading.hook"
import useToast from "@hooks/useToast"
import { CREATE_USER_ROLE } from "graphql/user/mutations"
import { GET_USER_ROLES } from "graphql/user/queries"
import Link from "next/link"
import { useContext, useEffect } from "react"
import { useForm } from "react-hook-form"
import * as yup from "yup"

const schema = yup.object({
	name: yup.string().required(`Role name is required`)
})
export default function SettingRoleNew() {
	const { state: dashboardState } = useContext(DashboardContext)
	const { setLoading } = useLoading()
	const { setToast } = useToast()

	const setForm = useForm({
		resolver: yupResolver(schema)
	})
	const {
		register,
		reset,
		watch,
		handleSubmit,
		setValue,
		formState: { isDirty }
	} = setForm

	const watchAuthRead = watch(`read`)
	const watchAuthWrite = watch(`write`)

	const [createUserRole] = useMutation(CREATE_USER_ROLE, {
		refetchQueries: [{ query: GET_USER_ROLES }]
	})

	useEffect(() => {
		if (
			dashboardState.authValues.length &&
			watchAuthRead?.length === dashboardState.authValues.length
		) {
			setValue(`read-all`, true)
		} else {
			setValue(`read-all`, false)
		}
	}, [watchAuthRead, dashboardState.authValues, setValue])

	useEffect(() => {
		if (
			dashboardState.authValues.length &&
			watchAuthWrite?.length === dashboardState.authValues.length
		) {
			setValue(`write-all`, true)
		} else {
			setValue(`write-all`, false)
		}
	}, [watchAuthWrite, dashboardState.authValues, setValue])

	function toggleAllAuths(ev, auth) {
		if (ev.target.checked) {
			setValue(auth, dashboardState.authValues)
		} else {
			setValue(auth, ``)
		}
	}

	async function onSubmit(formData) {
		setLoading(true)
		console.log(formData)

		try {
			const { data } = await createUserRole({
				variables: {
					input: {
						name: formData.name,
						read: formData.read || [],
						write: formData.write || []
					}
				}
			})

			reset()
			setToast(data.createUserRole)
		} catch (error) {
			setToast(error)
		}

		reset()
		setLoading(false)
	}

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<AdminPage
				setForm={setForm}
				authId="settings-users"
				title="New"
				parent={
					<>
						<Link href="/admin/settings/users">Users</Link>
						<span className="sep">/</span>
						<Link href="/admin/settings/users/roles">Roles</Link>
					</>
				}
				legend="Settings"
				action={
					<Access
						auth="write:settings-users"
						yes={
							<ul className="actions">
								<li className="action">
									<button
										type="submit"
										className="button button-small"
										disabled={!isDirty}
									>
										Save
									</button>
								</li>
							</ul>
						}
					/>
				}
			>
				<section className="section">
					<div className="admin-section">
						<div className="admin-section-head">
							<h2 className="title">Role Information</h2>
						</div>
					</div>
					<div className="admin-section-body admin-section-body-gray">
						<div className="form-fieldset">
							<div className="form-fieldset-body">
								<div className="row">
									<FormInput
										setForm={setForm}
										name="name"
										required
										label="Role name"
									/>
								</div>
							</div>
						</div>
					</div>
				</section>
				<section className="section">
					<div className="admin-section">
						<div className="admin-section-head">
							<h2 className="title">Role Permission</h2>
						</div>
						<div className="admin-section-body admin-section-body-gray">
							<div className="form-auth">
								<table className="form-auth-table">
									<thead>
										<tr>
											<th>Auth Access</th>
											<th>
												<label htmlFor="read-all" className="label">
													Read
												</label>
												<FormCheck
													onChange={(ev) => toggleAllAuths(ev, `read`)}
													register={register}
													name="read-all"
													type="checkbox"
													styleCenter
												/>
											</th>
											<th>
												<label htmlFor="write-all" className="label">
													Write
												</label>
												<FormCheck
													onChange={(ev) => toggleAllAuths(ev, `write`)}
													register={register}
													name="write-all"
													type="checkbox"
													styleCenter
												/>
											</th>
										</tr>
									</thead>
									<tbody>
										{dashboardState.authObjects.page?.map((nav) => (
											<tr key={nav.key}>
												<td>{nav.label}</td>
												<td>
													<FormCheck
														type="checkbox"
														register={register}
														name="read"
														value={nav.key}
														styleCenter
													/>
												</td>
												<td>
													<FormCheck
														type="checkbox"
														register={register}
														name="write"
														value={nav.key}
														styleCenter
													/>
												</td>
											</tr>
										))}
										<tr>
											<th colSpan={4}>Settings</th>
										</tr>
										{dashboardState.authObjects.settings?.map((nav, i) => (
											<tr key={nav.key}>
												<td>{nav.label}</td>
												<td>
													<FormCheck
														type="checkbox"
														register={register}
														name="read"
														value={nav.key}
														styleCenter
													/>
												</td>
												<td>
													<FormCheck
														type="checkbox"
														register={register}
														name="write"
														value={nav.key}
														styleCenter
													/>
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						</div>
					</div>
				</section>
			</AdminPage>
		</form>
	)
}

SettingRoleNew.getLayout = function getLayout(page) {
	return <Dashboard>{page}</Dashboard>
}
