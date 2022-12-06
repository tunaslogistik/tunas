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
import { CREATE_USER } from "graphql/user/mutations"
import { GET_USERS, GET_USER_ROLES } from "graphql/user/queries"
import Link from "next/link"
import { useContext, useEffect } from "react"
import { useForm } from "react-hook-form"
import { useImmerReducer } from "use-immer"
import * as yup from "yup"

const initialState = {
	authPopup: {
		isShown: false,
		data: {}
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
		default:
			return state
	}
}

const schema = yup.object({
	username: yup.string().required(`Username is required`),
	name: yup.string().required(`Full name is required`),
	role: yup.string().required(`Role must be assigned`),
	password: yup
		.string()
		.required(`Password is required`)
		.test(
			`len`,
			`Password must be at least 6 characters`,
			(val) => val.length >= 6
		),
	password_confirmation: yup
		.string()
		.oneOf([yup.ref(`password`), null], `Password must match`)
})
export default function SettingUserNew() {
	const { state: dashboardState } = useContext(DashboardContext)
	const [state, dispatch] = useImmerReducer(reducer, initialState)
	const { setLoading } = useLoading()
	const { setToast } = useToast()

	const setForm = useForm({
		resolver: yupResolver(schema)
	})
	const {
		control,
		reset,
		watch,
		handleSubmit,
		formState: { isDirty }
	} = setForm
	const watchRole = watch(`role`)

	const { data, loading, error } = useQuery(GET_USER_ROLES)

	const username = dashboardState.auth.username

	console.log(`username`, username)

	//GET ALL USER DATA
	const { data: userData } = useQuery(GET_USERS)

	const role = userData?.users.user?.find(
		(user) => user.username === username
	)?.role

	const [createUser] = useMutation(CREATE_USER, {
		refetchQueries: [
			{
				query: GET_USERS,
				variables: {
					page: 1
				}
			}
		]
	})

	useEffect(() => {
		if (!data) return

		const selectedRole = data.userRoles.find((role) => role.id === watchRole)
		dispatch({ type: `set_authPopup_data`, payload: selectedRole })
	}, [dispatch, watchRole, data])

	async function onSubmit(formData) {
		setLoading(true)
		if (
			role === `superadmin` ||
			(role === `admin` && formData.role === `user`) ||
			username === `ei8-admin`
		) {
			try {
				const { data } = await createUser({
					variables: {
						input: {
							username: formData.username,
							email: formData.email,
							cabang: formData.cabang,
							creator: formData.name,
							name: formData.name,
							password: formData.password,
							role: formData.role
						}
					}
				})

				reset()
				setToast(data.createUser)
			} catch (error) {
				setToast(error)
			}
		} else {
			setToast({
				type: `error`,
				message: `You don't have permission to create this user`
			})
		}

		setLoading(false)
	}

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<AdminPage
				authId="settings-users"
				title="New User"
				parent={<Link href="/admin/settings/users">Users</Link>}
				legend="Settings"
				setForm={setForm}
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
										Add User
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
											required
											label="Full Name"
										/>
									</div>
									<div className="row">
										<FormInput
											setForm={setForm}
											name="username"
											required
											label="Username"
										/>
									</div>
									<div className="row">
										<FormInput
											setForm={setForm}
											name="email"
											required
											label="email"
										/>
									</div>
									<div className="row">
										<FormInput
											setForm={setForm}
											name="cabang"
											required
											label="cabang"
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
								<h2 className="title">Password</h2>
							</div>
						</div>
						<div className="admin-section-body admin-section-body-gray">
							<div className="form-fieldset">
								<div className="form-fieldset-body">
									<div className="row">
										<FormInput
											setForm={setForm}
											type="password"
											name="password"
											required
											label="Password"
											error="Password must be at least 8 characters"
											placeholder="••••••••••••••"
										/>
									</div>
									<div className="row">
										<FormInput
											setForm={setForm}
											type="password"
											name="password_confirmation"
											required
											label="Repeat Password"
											error="Password must be at least 8 characters"
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

SettingUserNew.getLayout = function getLayout(page) {
	return <Dashboard>{page}</Dashboard>
}
