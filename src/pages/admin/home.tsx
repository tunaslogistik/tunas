import AdminPage from "@components/admin/AdminPage.component"
import Dashboard from "@components/dashboard/Dashboard.component"
import FormInput from "@components/form/FormInput.component"
import FormTextarea from "@components/form/FormTextarea.component"
import { useForm } from "react-hook-form"

export default function Home() {
	const setForm = useForm()
	const { register, handleSubmit } = setForm

	async function onSubmit(formData) {
		console.log(formData)
	}

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<AdminPage
				setForm={setForm}
				authId="home"
				title=""
				legend=""
				sidebar={true}
			>
				<section className="section">
					<div className="admin-section">
						<div className="admin-section-head">
							<h2 className="title">Welcome Text</h2>
						</div>
						<div className="admin-section-body admin-section-body-gray">
							<div className="form-fieldset">
								<div className="form-fieldset-body">
									<div className="row">
										<FormInput setForm={setForm} name="title" label="Title" />
									</div>
									<div className="row">
										<FormTextarea
											register={register}
											name="content"
											label="Content"
										/>
									</div>
									<div className="row">
										<FormInput
											setForm={setForm}
											name="url"
											label="URL"
											footnote="Where call to action button should link to"
										/>
									</div>
								</div>
							</div>
						</div>
					</div>
				</section>
				<section className="section">
					<div className="admin-section">
						<div className="admin-section-head">
							<h2 className="title">Home Section Title</h2>
						</div>
						<div className="admin-section-body admin-section-body-gray">
							<div className="form-fieldset">
								<div className="form-fieldset-body">
									<div className="row">
										<FormInput
											setForm={setForm}
											name="title-product"
											label="Product"
											placeholder="Product & Services"
										/>
									</div>
									<div className="row">
										<FormInput
											setForm={setForm}
											name="title-news"
											label="News"
											placeholder="Recent News"
										/>
									</div>
								</div>
							</div>
						</div>
					</div>
				</section>
			</AdminPage>
		</form>
	)
}

Home.getLayout = function getLayout(page) {
	return <Dashboard>{page}</Dashboard>
}
