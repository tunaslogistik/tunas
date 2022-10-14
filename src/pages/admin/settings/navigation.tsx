import { useMutation, useQuery } from "@apollo/client"
import AdminPage from "@components/admin/AdminPage.component"
import Dashboard from "@components/dashboard/Dashboard.component"
import FormRepeater from "@components/form/FormRepeater.component"
import Access from "@components/util/Access.component"
import QueryResult from "@components/util/QueryResult.component"
import useLoading from "@hooks/useLoading.hook"
import useToast from "@hooks/useToast"
import { UPDATE_NAVIGATION } from "graphql/navigation/mutations"
import { GET_NAVIGATION } from "graphql/navigation/queries"
import { useEffect } from "react"
import { useForm } from "react-hook-form"

export default function SettingNavigation() {
	const { setLoading } = useLoading()
	const { setToast } = useToast()

	const { data, loading, error } = useQuery(GET_NAVIGATION)
	const [updateNavigation] = useMutation(UPDATE_NAVIGATION)

	const setForm = useForm()
	const {
		register,
		control,
		reset,
		handleSubmit,
		formState: { isDirty }
	} = setForm

	useEffect(() => {
		if (!data) return

		let resetData = {}

		data.navigation.forEach((nav) => {
			resetData = {
				...resetData,
				[nav.id]: nav.menu.map((menu) => {
					return {
						id: menu.id,
						label: menu.label,
						url: menu.url
					}
				})
			}
		})

		reset(resetData)
	}, [data, reset])
	console.log(data)
	async function onSubmit(formData) {
		setLoading(true)

		const payload = Object.keys(formData).map((key) => {
			return {
				id: key,
				menu: formData[key]
			}
		})

		try {
			const { data } = await updateNavigation({
				variables: {
					inputs: payload
				}
			})

			setToast(data.updateNavigation)
		} catch (error) {
			setToast(error)
		}

		setLoading(false)
	}

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<AdminPage
				setForm={setForm}
				authId="settings-navigation"
				title="Navigation"
				legend="Settings"
				action={
					<Access
						auth="write:settings-navigation"
						yes={
							<ul className="actions">
								<li className="action">
									<button
										type="submit"
										className="button button-small"
										disabled={!isDirty}
									>
										Save Settings
									</button>
								</li>
							</ul>
						}
					/>
				}
			>
				<QueryResult loading={loading} error={error}>
					{data?.navigation.map((nav) => (
						<section key={nav.id} className="section">
							<div className="admin-section">
								<div className="admin-section-head">
									<h2 className="title">{nav.name}</h2>
								</div>
								<div className="admin-section-body admin-section-body-gray">
									<FormRepeater
										setForm={setForm}
										control={control}
										register={register}
										name={nav.id}
										inputNames={[`label`, `url`]}
										inputLabels={[`Label`, `URL`]}
										inputTypes={[`text`, `textarea`]}
										max={5}
										sortable
									/>
								</div>
								<button
									type="submit"
									className="button button-small"
									disabled={!isDirty}
								>
									Save Settings
								</button>
							</div>
						</section>
					))}
				</QueryResult>
			</AdminPage>
		</form>
	)
}

SettingNavigation.getLayout = function getLayout(page) {
	return <Dashboard>{page}</Dashboard>
}
