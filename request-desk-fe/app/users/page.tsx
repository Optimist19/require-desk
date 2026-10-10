
"use client";

import { useEffect, useMemo, useState } from "react";
import { getUsersReturnType, useRequestDesk } from "@/store";
import {
	Search,
	Trash2
} from "lucide-react";
import { Button } from "@/components/ui/button";

const colors = [
	{ color: 'bg-rose-100 text-rose-700' },
	{ color: 'bg-amber-100 text-amber-700' },
	{ color: 'bg-violet-100 text-violet-700' },
	{ color: 'bg-sky-100 text-sky-700' },
	{ color: 'bg-emerald-100 text-emerald-700' },
	{ color: 'bg-orange-100 text-orange-700' },
]



function UsersPage() {
	const {
		paginationMetaData,
		users,
		getUsers,
		deleteUser
	} = useRequestDesk((state) => state);
	// const { page, hasPrevPage, hasNextPage, totalPages } = paginationMetaData as PaginationType

	const [query, setQuery] = useState("");
	const [selectedId, setSelectedId] = useState("");
	const [notice, setNotice] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [err, setErr] = useState("");

	const filteredUsers = useMemo(
		() =>
			users.filter((user) =>
				`${user.name} ${user.email} ${user.role}`
					.toLowerCase()
					.includes(query.toLowerCase())
			),
		[users, query]
	);


	useEffect(() => {
		async function getUsersFtn() {
			setIsLoading(true);

			try {
				await getUsers();
			} catch (error) {

				setErr("Unable to get users")
			} finally {
				setIsLoading(false);
			}
		}

		getUsersFtn();
	}, [getUsers]);

	function delUser(user: getUsersReturnType) {
		deleteUser(user._id)
		setNotice(`${user.name} was removed from your workspace.`);


		window.setTimeout(() => {
			setNotice("");
		}, 3500);
		window.navigation.reload()
	}


	async function prevPage() {
		if (paginationMetaData?.hasPrevPage) {
			await getUsers(paginationMetaData?.page - 1)
		}

	}
	async function nextPage() {
		if (paginationMetaData?.hasNextPage) {
			await getUsers(paginationMetaData?.page + 1)
		}

	}


	return (
		<main className="min-h-screen bg-[#f8fafc] text-slate-900">
			<div className="pt-15 pl-10 lg:pl-74">
				<div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
					<header className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-start">
						<div>


							<h1 className="text-3xl font-semibold tracking-tight text-slate-950">
								Users
							</h1>

							<p className="mt-1 text-sm text-slate-500">
								Manage who has access to your workspace.
							</p>
						</div>


					</header>

					<div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_310px]">
						<section
							className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
							aria-labelledby="user-list-title"
						>
							<div className="flex flex-col gap-4 border-b border-slate-200 px-5 py-5 sm:flex-row sm:items-center sm:justify-between">
								<div>
									<h2
										id="user-list-title"
										className="font-semibold text-slate-900"
									>
										All users
										<span className="pl-1 text-sm font-normal text-slate-400">
											{paginationMetaData?.totalUsers}
										</span>
									</h2>

									<p className="mt-1 text-sm text-slate-500">
										Hover over a user to reveal actions.
									</p>
								</div>

								<label className="relative block sm:w-64">
									<span className="sr-only">Search users</span>

									<Search
										aria-hidden="true"
										className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
									/>

									<input
										value={query}
										onChange={(event) => setQuery(event.target.value)}
										placeholder="Search users"
										className="h-9 w-full rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200 cursor-pointer"
									/>
								</label>
							</div>

							<div className="overflow-x-auto">
								{isLoading ? (
									<div className="px-5 py-12 text-center text-sm text-slate-500">
										Loading users...
									</div>
								) : (
									<table className="w-full min-w-[650px] text-left text-sm">
										<thead className="bg-slate-50 text-xs font-medium uppercase tracking-wider text-slate-500">
											<tr>
												<th className="px-5 py-3">Name</th>
												<th className="px-5 py-3">Role</th>
												<th className="px-5 py-3">Joined</th>
												<th className="px-5 py-3">
													<span className="sr-only">Actions</span>
												</th>
											</tr>
										</thead>

										<tbody className="divide-y divide-slate-100">
											{filteredUsers.map(
												(user, i) => (
													<tr
														key={user._id}
														onClick={() => setSelectedId(user._id)}
														className={`group cursor-pointer transition hover:bg-slate-50 ${selectedId === user._id ? "bg-slate-50" : ""
															}`}
													>
														<td className="px-5 py-4">
															<div className="flex items-center gap-3">
																<div
																	className={`flex size-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${colors[i % colors.length].color
																		}`}
																>
																	{user.name
																		.charAt(0)
																		.toUpperCase()}
																</div>

																<div>
																	<div className="font-medium text-slate-900">
																		{user.name}
																	</div>

																	<div className="text-xs text-slate-500">
																		{user.email}
																	</div>
																</div>
															</div>
														</td>

														<td className="px-5 py-4 text-slate-600 capitalize">
															{user.role}
														</td>

														<td className="px-5 py-4 text-slate-500">
															{new Date(
																user.createdAt
															).toLocaleDateString("en-US", {
																month: "short",
																day: "2-digit",
																year: "numeric",
															})}
														</td>

														<td className="px-5 py-4 text-right">
															<Button
																aria-label={`Delete ${user.name}`}
																onClick={(event) => {
																	event.stopPropagation();
																	delUser(user);
																}}
																variant="destructive"
																size="icon-sm"
																className="opacity-0 transition-opacity cursor-pointer group-hover:opacity-100 focus-visible:opacity-100 cursor-pointer"
															>
																<Trash2 />
															</Button>


														</td>
													</tr>
												)
											)}
										</tbody>
									</table>
								)}
							</div>

							{!isLoading && filteredUsers.length === 0 && (
								<div className="px-5 py-12 text-center text-sm text-slate-500">
									No data
								</div>
							)}



							<div className="flex items-center justify-between border-t border-slate-200 px-5 py-4 text-sm text-slate-500">
								<span>
									Showing {filteredUsers.length} of {users.length} users
								</span>

								<span>Page {paginationMetaData?.page} of {paginationMetaData?.totalPages}</span>
								<div>
									<Button className="bg-slate-200 cursor-pointer" disabled={!paginationMetaData?.hasPrevPage} onClick={prevPage}>Prev</Button>
									<Button className="bg-slate-200 cursor-pointer" disabled={!paginationMetaData?.hasNextPage} onClick={nextPage}>Next</Button>

								</div>
							</div>
						</section>


					</div>
				</div>
			</div>
		</main>
	);
}

export default UsersPage
