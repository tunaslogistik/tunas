import AdminPage from "@components/admin/AdminPage.component"
import Dashboard from "@components/dashboard/Dashboard.component"
import Link from "next/link"
import { useForm } from "react-hook-form"

export default function AboutSubpages() {
	const setForm = useForm()
	const { handleSubmit } = setForm

	async function onSubmit(formData) {
		console.log(formData)
	}

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="admin-page">
			<AdminPage
				setForm={setForm}
				authId="about"
				title="Subpages"
				parent="About"
				legend=""
				sidebar={true}
			>
				<section className="section">
					<div className="admin-data">
						<div className="admin-data-filters">
							<div className="admin-data-filter">
								<select
									name="filter-status"
									id="filter-status"
									className="input"
								>
									<option>All posts</option>
									<option>Published posts</option>
									<option>Draft posts</option>
								</select>
							</div>
							<div className="admin-data-filter">
								<select name="sort" id="sort" className="input">
									<option>Sort by Newest</option>
									<option>Sort by Oldest</option>
								</select>
							</div>
						</div>
						<div className="admin-data-table">
							<table className="table table-vcenter">
								<thead>
									<tr>
										<th>Title</th>
										<th className="right">Status</th>
									</tr>
								</thead>
								<tbody>
									<tr>
										<Link href="/about/subpages/01" passHref>
											<td className="linkable">
												<p className="strong">Company Overview</p>
												<p className="small">Updated 9 hours ago</p>
											</td>
										</Link>
										<Link href="/about/subpages/01" passHref>
											<td className="linkable right">
												<span className="badge badge-green">Published</span>
											</td>
										</Link>
									</tr>
									<tr>
										<Link href="/about/subpages/02" passHref>
											<td className="linkable">
												<p className="strong">Group Structure</p>
												<p className="small">Created 10 hours ago</p>
											</td>
										</Link>
										<Link href="/about/subpages/02" passHref>
											<td className="linkable right">
												<span className="badge badge-green">Published</span>
											</td>
										</Link>
									</tr>
									<tr>
										<Link href="/about/subpages/03" passHref>
											<td className="linkable">
												<p className="strong">Subsidiaries</p>
												<p className="small">Created 11 hours ago</p>
											</td>
										</Link>
										<Link href="/about/subpages/03" passHref>
											<td className="linkable right">
												<span className="badge">Draft</span>
											</td>
										</Link>
									</tr>
									<tr>
										<Link href="/about/subpages/04" passHref>
											<td className="linkable">
												<p className="strong">Organization Structure</p>
												<p className="small">Created 11 hours ago</p>
											</td>
										</Link>
										<Link href="/about/subpages/04" passHref>
											<td className="linkable right">
												<span className="badge">Draft</span>
											</td>
										</Link>
									</tr>
								</tbody>
							</table>
						</div>
					</div>
				</section>
			</AdminPage>
		</form>
	)
}

AboutSubpages.getLayout = function getLayout(page) {
	return <Dashboard>{page}</Dashboard>
}
