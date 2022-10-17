import { useMutation, useQuery } from "@apollo/client"
import AdminPage from "@components/admin/AdminPage.component"
import Dashboard from "@components/dashboard/Dashboard.component"
import EiPopup from "@components/ei/EiPopup.component"
import FormInput from "@components/form/FormInput.component"
import FormSelect from "@components/form/FormSelect.component"
import InputCheckbox from "@components/input/inputCheckbox.component"
import Access from "@components/util/Access.component"
import QueryResult from "@components/util/QueryResult.component"
import { DashboardContext } from "@contexts/DashboardContext.context"
import { yupResolver } from "@hookform/resolvers/yup"
import useLoading from "@hooks/useLoading.hook"
import useToast from "@hooks/useToast"
import { gql } from "apollo-server-micro"
import { DELETE_USER, UPDATE_USER } from "graphql/user/mutations"
import { GET_USERS } from "graphql/user/queries"
import Link from "next/link"
import { useRouter } from "next/router"
import { useContext, useEffect } from "react"
import { useForm } from "react-hook-form"
import { useImmerReducer } from "use-immer"
import * as yup from "yup"

export const GET_DATA = gql`
	query getData($id: ID) {
		user(id: $id) {
			id
			username
			email
			cabang
			creator
			name
			role
			userRole {
				name
				read
				write
			}
		}

		userRoles {
			id
			name
			read
			write
		}
	}
`

const initialState = {
	authPopup: {
		isShown: false,
		data: {}
	},
	deletePopup: {
		isShown: false
	}
}

function reducer(state, action) {
	switch (action.type) {
		case `set_authPopup_isShown`:
			state.authPopup.isShown = action.payload
			return
		case `set_authPopup_data`:
			state.authPopup.data = action.payload
			return
		case `set_deletePopup_isShown`:
			state.deletePopup.isShown = action.payload
			return
		default:
			return state
	}
}

const schema = yup.object({
	username: yup.string().required(`Username is required`),
	name: yup.string().required(`Name is required`),
	role: yup.string().required(`Role must be assigned`),
	password: yup
		.string()
		.test(
			`len`,
			`Password must be at least 6 characters`,
			(password) => !password || password.length >= 6
		),
	password_confirmation: yup
		.string()
		.oneOf([yup.ref(`password`), null], `Password must match`)
})
export default function SettingUserEdit() {
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
		control,
		reset,
		watch,
		handleSubmit,
		formState: { isDirty, errors }
	} = setForm
	const watchRole = watch(`role`)

	const { data, loading, error } = useQuery(GET_DATA, {
		variables: { id }
	})

	const [updateUser] = useMutation(UPDATE_USER, {
		refetchQueries: [{ query: GET_USERS }]
	})

	const [deleteUser] = useMutation(DELETE_USER, {
		refetchQueries: [{ query: GET_USERS }]
	})

	useEffect(() => {
		if (!data) return

		reset(data.user)
	}, [reset, data])

	useEffect(() => {
		if (!data) return

		const selectedRole = data.userRoles.find((role) => role.id === watchRole)
		dispatch({ type: `set_authPopup_data`, payload: selectedRole })
	}, [dispatch, watchRole, data])

	async function onSubmit(formData) {
		setLoading(true)

		try {
			const { data } = await updateUser({
				variables: {
					input: {
						id,
						username: formData.username,
						email: formData.email,
						cabang: formData.cabang,
						creator: String(dashboardState.auth.id),
						name: formData.name,
						role: formData.role,
						password: formData.password ? formData.password : ``
					}
				}
			})

			reset()
			setToast(data.updateUser)
		} catch (error) {
			setToast(error)
		}

		setLoading(false)
	}

	async function handleDelete() {
		setLoading(true)

		try {
			const { data } = await deleteUser({
				variables: { id }
			})

			dispatch({ type: `set_deletePopup_isShown`, payload: false })
			setToast(data.deleteUser)
			router.push(`/admin/settings/users`)
		} catch (error) {
			setToast(error)
		}

		setLoading(false)
	}

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<AdminPage
				setForm={setForm}
				authId="settings-users"
				title="Edit User"
				parent={<Link href="/admin/settings/users">Users</Link>}
				legend="Settings"
				action={
					<Access
						auth="write:settings-users"
						except={id === String(dashboardState.auth.id)}
						yes={
							<ul className="actions">
								{/* prevent user from deleting himself */}
								{id !== String(dashboardState.auth.id) && (
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
										<EiPopup isShown={state.deletePopup.isShown} styleSmall>
											<div className="popup-confirm">
												<div className="popup-confirm-head">
													<h4>Delete user</h4>
												</div>
												<div className="popup-confirm-body">
													<p>
														You are about to delete an user. This action cannot
														be undone. Are you sure?
													</p>
												</div>
												<div className="popup-confirm-action">
													<button
														type="button"
														onClick={() =>
															dispatch({
																type: `set_deletePopup_isShown`,
																payload: false
															})
														}
														className="button button-gray"
													>
														Cancel
													</button>
													<button
														type="button"
														onClick={handleDelete}
														className="button button-danger"
													>
														Delete User
													</button>
												</div>
											</div>
										</EiPopup>
									</li>
								)}
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
								<h2 className="title">Account Information</h2>
							</div>
						</div>
						<div className="admin-section-body admin-section-body-gray">
							<div className="form-fieldset">
								<div className="form-fieldset-body">
									<div className="row">
										<FormInput
											setForm={setForm}
											name="name"
											error={String(errors.name?.message)}
											label="Full Name"
										/>
									</div>
									<div className="row">
										<FormInput
											setForm={setForm}
											name="username"
											error={String(errors.username?.message)}
											label="Username"
										/>
									</div>
									<div className="row">
										<FormInput
											setForm={setForm}
											name="email"
											error={String(errors.email?.message)}
											label="Email"
										/>
									</div>
									<div className="row">
										<FormInput
											setForm={setForm}
											name="cabang"
											error={String(errors.cabang?.message)}
											label="Cabang"
										/>
									</div>
									<div className="row">
										<FormSelect
											control={control}
											name="role"
											label="Role"
											footnote={
												<button
													type="button"
													onClick={() =>
														dispatch({
															type: `set_authPopup_isShown`,
															payload: true
														})
													}
													className="link"
												>
													View role permission
												</button>
											}
											options={data?.userRoles.map((role) => ({
												value: role.id,
												label: role.name
											}))}
										/>
										<AuthPopup
											dashboardState={dashboardState}
											state={state}
											dispatch={dispatch}
										/>
									</div>
								</div>
							</div>
						</div>
					</section>
					<section className="section">
						<div className="admin-section">
							<div className="admin-section-head">
								<h2 className="title">Change Password</h2>
							</div>
						</div>
						<div className="admin-section-body admin-section-body-gray">
							<div className="form-fieldset">
								<div className="form-fieldset-body">
									<div className="row">
										<FormInput
											type="password"
											setForm={setForm}
											name="password"
											error={String(errors.password?.message)}
											label="New Password"
											placeholder="••••••••••••••"
										/>
									</div>
									<div className="row">
										<FormInput
											type="password"
											setForm={setForm}
											name="password_confirmation"
											error={String(errors.password_confirmation?.message)}
											label="Repeat New Password"
											placeholder="••••••••••••••"
										/>
									</div>
								</div>
							</div>
						</div>
					</section>
				</QueryResult>
			</AdminPage>
		</form>
	)
}

function AuthPopup({ dashboardState, state, dispatch }) {
	return (
		<EiPopup
			isShown={state.authPopup.isShown}
			close={() => dispatch({ type: `set_authPopup_isShown`, payload: false })}
			closeOutside
			closeIcon
		>
			<div className="form-auth">
				<table className="form-auth-table">
					<thead>
						<tr>
							<th>Auth Access</th>
							<th>
								<p className="legend">Read</p>
							</th>
							<th>
								<p className="legend">Write</p>
							</th>
						</tr>
					</thead>
					<tbody>
						{dashboardState.authObjects.page?.map((nav) => (
							<tr key={nav.key}>
								<td>{nav.label}</td>
								<td>
									<InputCheckbox
										name={`${nav.key}-read`}
										type="checkbox"
										checked={state.authPopup.data?.read?.includes(nav.key)}
										readOnly
										styleReadOnly
										styleCenter
									/>
								</td>
								<td>
									<InputCheckbox
										name={`${nav.key}-write`}
										type="checkbox"
										checked={state.authPopup.data?.write?.includes(nav.key)}
										readOnly
										styleReadOnly
										styleCenter
									/>
								</td>
							</tr>
						))}
						<tr>
							<th colSpan={4}>Settings</th>
						</tr>
						{dashboardState.authObjects.settings?.map((nav) => (
							<tr key={nav.key}>
								<td>{nav.label}</td>
								<td>
									<InputCheckbox
										name={`${nav.key}-read`}
										type="checkbox"
										checked={state.authPopup.data?.read?.includes(nav.key)}
										readOnly
										styleReadOnly
										styleCenter
									/>
								</td>
								<td>
									<InputCheckbox
										name={`${nav.key}-write`}
										type="checkbox"
										checked={state.authPopup.data?.write?.includes(nav.key)}
										readOnly
										styleReadOnly
										styleCenter
									/>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</EiPopup>
	)
}

SettingUserEdit.getLayout = function getLayout(page) {
	return <Dashboard>{page}</Dashboard>
}
