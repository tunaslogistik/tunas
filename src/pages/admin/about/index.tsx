import AdminPage from "@components/admin/AdminPage.component"
import Dashboard from "@components/dashboard/Dashboard.component"
import { useForm } from "react-hook-form"

export default function About() {
	const setForm = useForm()
	const { handleSubmit } = setForm

	async function onSubmit(formData) {
		console.log(formData)
	}

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<AdminPage
				setForm={setForm}
				authId="about"
				title="About"
				legend=""
				sidebar={true}
			>
				<p>This is About page</p>
			</AdminPage>
		</form>
	)
}

About.getLayout = function getLayout(page) {
	return <Dashboard>{page}</Dashboard>
}
