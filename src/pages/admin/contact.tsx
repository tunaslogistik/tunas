import AdminPage from "@components/admin/AdminPage.component"
import Dashboard from "@components/dashboard/Dashboard.component"
import { useForm } from "react-hook-form"

export default function Contact() {
	const setForm = useForm()
	const { handleSubmit } = setForm

	async function onSubmit(formData) {
		console.log(formData)
	}

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<AdminPage
				setForm={setForm}
				authId="contact"
				title="Contact"
				legend=""
				sidebar={true}
			>
				<p>This is contact page</p>
			</AdminPage>
		</form>
	)
}

Contact.getLayout = function getLayout(page) {
	return <Dashboard>{page}</Dashboard>
}
