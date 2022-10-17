import { useMutation, useQuery } from "@apollo/client"
import AdminPage from "@components/admin/AdminPage.component"
import Dashboard from "@components/dashboard/Dashboard.component"
import EiPopup from "@components/ei/EiPopup.component"
import FormCheck from "@components/form/FormCheck.component"
import FormInput from "@components/form/FormInput.component"
import Access from "@components/util/Access.component"
import QueryResult from "@components/util/QueryResult.component"
import { DashboardContext } from "@contexts/DashboardContext.context"
import { yupResolver } from "@hookform/resolvers/yup"
import useLoading from "@hooks/useLoading.hook"
import useToast from "@hooks/useToast"
import { DELETE_USER_ROLE, UPDATE_USER_ROLE } from "graphql/user/mutations"
import { GET_USER_ROLE, GET_USER_ROLES } from "graphql/user/queries"
import Link from "next/link"
import { useRouter } from "next/router"
import { useContext, useEffect } from "react"
import { useForm } from "react-hook-form"
import { useImmerReducer } from "use-immer"
import * as yup from "yup"

function reducer(state, action) {
	switch (action.type) {
		case `set_deletePopup_isShown`:
			state.deletePopup.isShown = action.payload
			return
		default:
			return state
	}
}

const initialState = {
	deletePopup: {
		isShown: false
	}
}

const schema = yup.object({
	name: yup.string().required(`Role name is required`)
})

export default function SettingRoleEdit() {
	const { state: dashboardState } = useContext(DashboardContext)
	const [state, dispatch] = useImmerReducer(reducer, initialState)
	const { setLoading } = useLoading()
	const { setToast } = useToast()

	const router = useRouter()
	const { id } = router.query

	const setForm = useForm({
		resolver: yupResolver(schema)
	})
	const {
		register,
		watch,
		handleSubmit,
		setValue,
		reset,
		formState: { errors, isDirty }
	} = setForm

	const { data, loading, error } = useQuery(GET_USER_ROLE, {
		variables: { id }
	})

	const [updateUserRole] = useMutation(UPDATE_USER_ROLE, {
		refetchQueries: [{ query: GET_USER_ROLES }]
	})

	const [deleteUserRole] = useMutation(DELETE_USER_ROLE, {
		refetchQueries: [{ query: GET_USER_ROLES }]
	})

	const watchAuthRead = watch(`read`)
	const watchAuthWrite = watch(`write`)

	useEffect(() => {
		if (!data) return

		reset(data.userRole)
	}, [reset, data])

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

		try {
			const { data } = await updateUserRole({
				variables: {
					input: {
						id,
						name: formData.name,
						read: formData.read || [],
						write: formData.write || []
					}
				}
			})

			setToast(data.updateUserRole)
		} catch (error) {
			setToast(error)
		}

		setLoading(false)
	}

	async function handleDeleteRole() {
		setLoading(true)

		try {
			const { data } = await deleteUserRole({
				variables: { id }
			})

			dispatch({ type: `set_deletePopup_isShown`, payload: false })
			setToast(data.deleteUserRole)
			router.push(`admin/settings/users/roles`)
		} catch (error) {
			dispatch({ type: `set_deletePopup_isShown`, payload: false })
			setToast(error)
		}

		setLoading(false)
	}

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<AdminPage
				setForm={setForm}
				authId="settings-users"
				title="Edit"
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
										type="button"
										onClick={() =>
											dispatch({
												type: `set_deletePopup_isShown`,
												payload: true
											})
										}
										className="button button-small button-alert"
									>
										Delete
									</button>
									<DeletePopup
										state={state}
										dispatch={dispatch}
										handleDeleteRole={handleDeleteRole}
									/>
								</li>
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
				<QueryResult loading={loading} error={error}>
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
											error={errors.name?.message}
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
				</QueryResult>
			</AdminPage>
		</form>
	)
}

function DeletePopup({ state, dispatch, handleDeleteRole }) {
	return (
		<EiPopup isShown={state.deletePopup.isShown} styleSmall>
			<div className="popup-confirm">
				<div className="popup-confirm-head">
					<h4>Delete user</h4>
				</div>
				<div className="popup-confirm-body">
					<p>
						You are about to delete an user role. This action cannot be undone.
						Are you sure?
					</p>
				</div>
				<div className="popup-confirm-action">
					<button
						type="button"
						onClick={() =>
							dispatch({ type: `set_deletePopup_isShown`, payload: false })
						}
						className="button button-gray"
					>
						Cancel
					</button>
					<button
						type="button"
						onClick={handleDeleteRole}
						className="button button-danger"
					>
						Delete User
					</button>
				</div>
			</div>
		</EiPopup>
	)
}

SettingRoleEdit.getLayout = function getLayout(page) {
	return <Dashboard>{page}</Dashboard>
}
