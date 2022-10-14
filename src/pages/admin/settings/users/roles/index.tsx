import { useQuery } from "@apollo/client"
import AdminPage from "@components/admin/AdminPage.component"
import Dashboard from "@components/dashboard/Dashboard.component"
import Access from "@components/util/Access.component"
import QueryResult from "@components/util/QueryResult.component"
import { GET_USER_ROLES } from "graphql/user/queries"
import Link from "next/link"
import { useForm } from "react-hook-form"
export default function SettingRoles() {
	const { data, loading, error } = useQuery(GET_USER_ROLES)
	const setForm = useForm()

	return (
		<AdminPage
			setForm={setForm}
			authId="settings-users"
			title="Roles"
			parent={<Link href="/admin/settings/users">Users</Link>}
			legend="Settings"
			action={
				<Access
					auth="write:settings-users"
					yes={
						<ul className="actions">
							<li className="action">
								<Link href="/admin/settings/users/roles/new">
									<a className="button button-small">New Role</a>
								</Link>
							</li>
						</ul>
					}
				/>
			}
		>
			<section className="section">
				<QueryResult loading={loading} error={error}>
					<div className="admin-data">
						<div className="admin-data-table">
							<table className="table table-vcenter">
								<thead>
									<tr>
										<th>{data?.userRoles.length} Roles</th>
										<th>Users</th>
									</tr>
								</thead>
								<tbody>
									{data?.userRoles.map((role) => (
										<Link
											key={role.id}
											href={`/admin/settings/users/roles/${role.id}`}
											passHref
										>
											<tr className="linkable">
												<td>
													<p className="strong">{role.name}</p>
													<p className="small">{role.username}</p>
												</td>
												<td>{role._count.users}</td>
											</tr>
										</Link>
									))}
								</tbody>
							</table>
						</div>
					</div>
				</QueryResult>
			</section>
		</AdminPage>
	)
}

SettingRoles.getLayout = function getLayout(page) {
	return <Dashboard>{page}</Dashboard>
}
