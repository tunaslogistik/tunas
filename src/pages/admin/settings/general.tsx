import { useMutation, useQuery } from "@apollo/client"
import IconEmail from "@assets/icons/icon-envelope.svg"
import IconFacebook from "@assets/icons/icon-social-facebook.svg"
import IconInstagram from "@assets/icons/icon-social-instagram.svg"
import IconLine from "@assets/icons/icon-social-line.svg"
import IconLinkedin from "@assets/icons/icon-social-linkedin.svg"
import IconTwitter from "@assets/icons/icon-social-twitter.svg"
import IconWhatsapp from "@assets/icons/icon-social-whatsapp.svg"
import IconYoutube from "@assets/icons/icon-social-youtube.svg"
import AdminPage from "@components/admin/AdminPage.component"
import Dashboard from "@components/dashboard/Dashboard.component"
import EiExpandable from "@components/ei/EiExpandable.component"
import FormInput from "@components/form/FormInput.component"
import FormSwitch from "@components/form/FormSwitch.component"
import FormTextarea from "@components/form/FormTextarea.component"
import Access from "@components/util/Access.component"
import QueryResult from "@components/util/QueryResult.component"
import useLoading from "@hooks/useLoading.hook"
import useToast from "@hooks/useToast"
import { UPDATE_SETTINGS } from "graphql/setting/mutations"
import { GET_SETTINGS } from "graphql/setting/queries"
import { useEffect } from "react"
import { useForm } from "react-hook-form"

export default function SettingGeneral() {
	const { setLoading } = useLoading()
	const { setToast } = useToast()

	const { data, error, loading } = useQuery(GET_SETTINGS)
	const [updateGeneralSettings] = useMutation(UPDATE_SETTINGS, {
		refetchQueries: [{ query: GET_SETTINGS }]
	})

	const setForm = useForm()
	const {
		register,
		reset,
		handleSubmit,
		formState: { isDirty }
	} = setForm

	useEffect(() => {
		if (data?.settings) {
			let resetData = {}

			data.settings.forEach((setting: { name: string; value: string }) => {
				if (
					setting.name === `mode_private` ||
					setting.name === `mode_maintenance`
				) {
					resetData = {
						...resetData,
						[setting.name]: setting.value === `false` ? false : setting.value
					}
				} else {
					resetData = {
						...resetData,
						[setting.name]: setting.value
					}
				}
			})

			reset(resetData)
		}
	}, [reset, data])

	async function onSubmit(formData) {
		setLoading(true)

		const payload = Object.entries(formData).map((setting) => ({
			name: setting[0],
			value: setting[1].toString()
		}))

		try {
			const { data } = await updateGeneralSettings({
				variables: {
					inputs: payload
				}
			})

			setToast(data.updateGeneralSettings)
		} catch (error) {
			setToast(error)
		}

		setLoading(false)
	}

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<AdminPage
				setForm={setForm}
				authId="settings-general"
				title="General"
				legend="Settings"
				action={
					<Access
						auth="write:settings-general"
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
					<section className="section">
						<div className="admin-section">
							<div className="admin-section-head">
								<h2 className="title">Website Settings</h2>
							</div>
							<div className="admin-section-body admin-section-body-graydient">
								<EiExpandable
									title="Site Identity"
									desc="The details used to identify your website"
								>
									<div className="form-fieldset">
										<div className="form-fieldset-body">
											<div className="row">
												<FormInput
													setForm={setForm}
													name="site_title"
													label="Title"
													type="select"
													footnote="The name of your site"
												/>
											</div>
											<div className="row">
												<FormInput
													setForm={setForm}
													name="site_desc"
													label="Description"
													footnote="Short description of your site"
												/>
											</div>
											<div className="row">
												<FormInput
													setForm={setForm}
													name="site_lang"
													label="Language"
													footnote={
														<span>
															Language of your site – default:{` `}
															<strong>en</strong> (English)
														</span>
													}
												/>
											</div>
										</div>
									</div>
								</EiExpandable>
							</div>
							<div className="admin-section-body admin-section-body-graydient">
								<EiExpandable
									title="Site Meta Data"
									desc="Content for search engines"
								>
									<div className="form-fieldset">
										<div className="form-fieldset-body">
											<div className="row">
												<FormInput
													setForm={setForm}
													name="meta_title"
													label="Meta title"
													footnote={
														<span>
															Recommended: <strong>70</strong> characters.
														</span>
													}
												/>
											</div>
											<div className="row">
												<FormTextarea
													register={register}
													name="meta_desc"
													label="Meta description"
													footnote={
														<span>
															Recommended: <strong>156</strong> characters.
														</span>
													}
												/>
											</div>
										</div>
									</div>
								</EiExpandable>
							</div>
							<div className="admin-section-body admin-section-body-graydient">
								<EiExpandable
									title="Email Addresses"
									desc="Email addresses of your website"
								>
									<div className="form-fieldset">
										<div className="form-fieldset-body">
											<div className="row">
												<FormInput
													setForm={setForm}
													name="email_admin"
													label="Admin Email"
													icon={IconEmail}
													footnote="Email for admin purposes"
												/>
											</div>
											<div className="row">
												<FormInput
													setForm={setForm}
													name="email_contact"
													label="Contact Email"
													icon={IconEmail}
													footnote="Email for contact form"
												/>
											</div>
										</div>
									</div>
								</EiExpandable>
							</div>
						</div>
					</section>
					<section className="section">
						<div className="admin-section">
							<div className="admin-section-head">
								<h2 className="title">Integration Settings</h2>
							</div>
							<div className="admin-section-body admin-section-body-graydient">
								<EiExpandable
									title="3rd Party Service"
									desc="Configuration for 3rd party integrations"
								>
									<div className="form-fieldset">
										<div className="form-fieldset-body">
											<div className="row">
												<FormInput
													setForm={setForm}
													name="integration_ganalytics"
													footnote="Google Analytics Tracking ID"
													placeholder="UA-XXXXXXXXX-XX"
												/>
											</div>
											<div className="row">
												<FormInput
													setForm={setForm}
													name="integration_mailchimp"
													footnote="Mailchimp API Key"
												/>
											</div>
										</div>
									</div>
								</EiExpandable>
							</div>
							<div className="admin-section-body admin-section-body-graydient">
								<EiExpandable
									title="Social Media"
									desc="Link to your social media accounts"
								>
									<div className="form-fieldset">
										<div className="form-fieldset-body">
											<div className="row">
												<FormInput
													setForm={setForm}
													name="social_facebook"
													icon={IconFacebook}
													footnote="URL of your Facebook profile"
													placeholder="Facebook"
												/>
											</div>
											<div className="row">
												<FormInput
													setForm={setForm}
													name="social_instagram"
													icon={IconInstagram}
													footnote="URL of your Instagram profile"
													placeholder="Instagram"
												/>
											</div>
											<div className="row">
												<FormInput
													setForm={setForm}
													name="social_linkedin"
													icon={IconLinkedin}
													footnote="URL of your LinkedIn profile"
													placeholder="LinkedIn"
												/>
											</div>
											<div className="row">
												<FormInput
													setForm={setForm}
													name="social_twitter"
													icon={IconTwitter}
													footnote="URL of your Twitter profile"
													placeholder="Twitter"
												/>
											</div>
											<div className="row">
												<FormInput
													setForm={setForm}
													name="social_youtube"
													icon={IconYoutube}
													footnote="URL of your Youtube profile"
													placeholder="Youtube"
												/>
											</div>
										</div>
									</div>
								</EiExpandable>
							</div>
							<div className="admin-section-body admin-section-body-graydient">
								<EiExpandable
									title="Social Messenger"
									desc="Your social messenger contacts"
								>
									<div className="form-fieldset">
										<div className="form-fieldset-body">
											<div className="row">
												<FormInput
													setForm={setForm}
													name="messenger_whatsapp"
													icon={IconWhatsapp}
													footnote="Your Whatsapp contact number"
													placeholder="Whatsapp"
												/>
											</div>
											<div className="row">
												<FormInput
													setForm={setForm}
													name="messenger_line"
													icon={IconLine}
													footnote="Your Line contact number"
													placeholder="Line"
												/>
											</div>
										</div>
									</div>
								</EiExpandable>
							</div>
						</div>
					</section>
					<section className="section">
						<div className="admin-section">
							<div className="admin-section-head">
								<h2 className="title">Advanced Settings</h2>
							</div>
							<div className="admin-section-body admin-section-body-gray">
								<FormSwitch
									register={register}
									name="mode_private"
									value="true"
									label="Block Search Engine"
									desc="Discourage search engines from indexing this site"
								/>
							</div>
							<div className="admin-section-body admin-section-body-gray">
								<FormSwitch
									register={register}
									name="mode_maintenance"
									value="true"
									label="Maintenance Mode"
									desc="Prevent visitors from accessing this site"
								/>
							</div>
						</div>
					</section>
				</QueryResult>
			</AdminPage>
		</form>
	)
}

SettingGeneral.getLayout = function getLayout(page) {
	return <Dashboard>{page}</Dashboard>
}
