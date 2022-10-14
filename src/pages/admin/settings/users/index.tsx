import { useQuery } from "@apollo/client"
import IconSettings from "@assets/icons/icon-setting.svg"
import AdminPage from "@components/admin/AdminPage.component"
import Dashboard from "@components/dashboard/Dashboard.component"
import EiPagination from "@components/ei/EiPagination.component"
import Access from "@components/util/Access.component"
import OutsideClick from "@components/util/OutsideClick.component"
import QueryResult from "@components/util/QueryResult.component"
import { slideDownMotion } from "@variables/motion.variable"
import { AnimatePresence, motion } from "framer-motion"
import { GET_USERS } from "graphql/user/queries"
import Link from "next/link"
import { useState } from "react"
import { useForm } from "react-hook-form"

export default function SettingUsers() {
	const [settingToggled, setSettingToggled] = useState(false)
	const [currentPage, setCurrentPage] = useState(1)

	const setForm = useForm()

	const { data, loading, error } = useQuery(GET_USERS, {
		variables: {
			page: currentPage
		}
	})

	return (
		<div className="admin-page">
			<AdminPage
				setForm={setForm}
				authId="settings-users"
				title="Users"
				legend="Settings"
				action={
					<Access
						auth="write:settings-users"
						yes={
							<ul className="actions">
								<li className="action">
									<OutsideClick runFunction={() => setSettingToggled(false)}>
										<button
											type="button"
											onClick={() => setSettingToggled(!settingToggled)}
											className="button button-small button-gray button-icon"
										>
											<i className="icon" role="img">
												<IconSettings className="svg" />
											</i>
										</button>
										<AnimatePresence>
											{settingToggled && (
												<motion.div
													className="admin-header-submenu"
													variants={slideDownMotion}
													initial="hidden"
													animate="visible"
													exit="hidden"
												>
													<ul className="items">
														<li className="item">
															<Link href="/admin/settings/users/roles">
																<a className="link">Manage user roles</a>
															</Link>
														</li>
													</ul>
												</motion.div>
											)}
										</AnimatePresence>
									</OutsideClick>
								</li>
								<li className="action">
									<Link href="/admin/settings/users/new" passHref>
										<a className="button button-small">New User</a>
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
											<th>{data?.users.count} Users</th>
											<th className="right">Role</th>
										</tr>
									</thead>
									<tbody>
										{data?.users.user.map((user) => (
											<Link
												key={user.id}
												href={`/admin/settings/users/${user.id}`}
												passHref
											>
												<tr className="linkable">
													<td>
														<p className="strong">{user.name}</p>
														<p className="small">{user.username}</p>
													</td>
													<td className="right">{user.userRole.name}</td>
												</tr>
											</Link>
										))}
									</tbody>
								</table>
							</div>
							<div className="admin-data-foot">
								<EiPagination
									count={data?.users.count}
									countPerPage={data?.users.countPerPage}
									currentPage={currentPage}
									setCurrentPage={setCurrentPage}
								/>
							</div>
						</div>
					</QueryResult>
				</section>
			</AdminPage>
		</div>
	)
}

SettingUsers.getLayout = function getLayout(page) {
	return <Dashboard>{page}</Dashboard>
}
