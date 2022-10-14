import { useReactiveVar } from "@apollo/client"
import IconArrowRight from "@assets/icons/icon-arrow-right.svg"
import EiNotification from "@components/ei/EiNotification.component"
import FormInput from "@components/form/FormInput.component"
import useToast from "@hooks/useToast"
import { signIn, useSession } from "next-auth/react"
import { useRouter } from "next/router"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { toastsVar } from "src/store/apollo.store"

export default function Auth() {
	const toasts = useReactiveVar(toastsVar)

	const { setToast } = useToast()
	const setForm = useForm()
	const { handleSubmit } = setForm
	const { data: session, status } = useSession()
	const router = useRouter()

	useEffect(() => {
		if (status !== `loading` && session) {
			router.push(`/dashboard`)
		}
	}, [router, session, status])

	async function submitForm(data) {
		try {
			const response = await signIn(`credentials`, {
				...data,
				redirect: false
			})

			if (!response.ok) {
				setToast({
					code: response.status,
					success: response.ok,
					message: response.error,
					align: `global`
				})
			}

			if (response.ok) {
				setToast({
					code: 200,
					success: response.ok,
					message: `Login successfull!`,
					align: `global`
				})
			}
		} catch (error) {
			console.log(error)
		}
	}

	return (
		<div className="login">
			<div className="login-toast">
				<div className="login-toast-items">
					{toasts.map((toast, i) => (
						<div key={`notification-${i}`} className="login-toast-item">
							<EiNotification
								text={toast.text}
								footnote={toast.footnote}
								type={toast.type}
								align={toast.align}
								autohide={toast.autohide}
							/>
						</div>
					))}
				</div>
			</div>
			<div className="login-content">
				<div className="login-content-inner">
					<div className="login-card">
						<div className="login-card-header">
							<h1 className="title">Login</h1>
						</div>
						<form
							onSubmit={handleSubmit(submitForm)}
							className="login-card-form"
						>
							<div className="row">
								<FormInput
									setForm={setForm}
									name="username"
									label="Username"
									placeholder="admin"
									styleLarge
								/>
							</div>
							<div className="row">
								<FormInput
									setForm={setForm}
									name="password"
									type="password"
									label="Password"
									placeholder="••••••••••••••"
									styleLarge
								/>
							</div>
							<div className="row">
								<button
									type="submit"
									className="button button-large button-full"
								>
									Sign in
									<i className="icon" role="img">
										<IconArrowRight className="svg" />
									</i>
								</button>
							</div>
						</form>
					</div>
				</div>
			</div>
		</div>
	)
}
