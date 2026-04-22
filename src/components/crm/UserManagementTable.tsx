"use client";

import { crmUserUpdateSchema } from "@/lib/crm/validation";
import { USER_ROLES, type UserRoleValue } from "@/lib/crm/constants";
import { formatDate, formatUserRole } from "@/app/utils/formatters";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { z } from "zod";

type UserRow = {
	id: number;
	name: string;
	email: string;
	phone: string | null;
	role: UserRoleValue;
	isActive: boolean;
	createdAt: Date;
	_count: {
		authSessions: number;
		ownedProperties: number;
		createdProperties: number;
		requests: number;
		favorites: number;
	};
};

type Props = {
	users: UserRow[];
	currentUserId: number;
};

type EditingState = Record<number, Omit<UserRow, "createdAt" | "_count">>;

export function UserManagementTable({ users, currentUserId }: Props) {
	const router = useRouter();
	const [isPending, startTransition] = useTransition();
	const [error, setError] = useState<string | null>(null);
	const [editing, setEditing] = useState<EditingState>(
		Object.fromEntries(
			users.map((user) => [
				user.id,
				{
					id: user.id,
					name: user.name,
					email: user.email,
					phone: user.phone,
					role: user.role,
					isActive: user.isActive,
				},
			]),
		),
	);

	async function handleSave(userId: number) {
		setError(null);

		try {
			const payload = crmUserUpdateSchema.parse(editing[userId]);
			const response = await fetch(`/api/crm/users/${userId}`, {
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(payload),
			});

			const result = (await response.json().catch(() => null)) as
				| { message?: string }
				| null;

			if (!response.ok) {
				setError(result?.message ?? "Не вдалося оновити користувача");
				return;
			}

			startTransition(() => {
				router.refresh();
			});
		} catch (validationError) {
			if (validationError instanceof z.ZodError) {
				setError(validationError.issues[0]?.message ?? "Перевірте введені дані");
				return;
			}

			setError("Не вдалося оновити користувача");
		}
	}

	return (
		<div className="space-y-5">
			{error ? (
				<div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
					{error}
				</div>
			) : null}

			{users.map((user) => {
				const current = editing[user.id];

				return (
					<div
						key={user.id}
						className="rounded-[28px] border border-black/10 bg-white p-6 shadow-sm"
					>
						<div className="flex flex-col gap-3 border-b border-black/6 pb-4 lg:flex-row lg:items-start lg:justify-between">
							<div>
								<h3 className="text-xl font-semibold text-primary">{user.name}</h3>
								<p className="mt-1 text-sm text-secondary">
									Зареєстрований {formatDate(user.createdAt)}
								</p>
							</div>
							<div className="flex flex-wrap gap-2 text-xs font-semibold">
								<span className="rounded-full bg-bg-secondary px-3 py-1 text-primary">
									{formatUserRole(user.role)}
								</span>
								<span
									className={`rounded-full px-3 py-1 ${
										user.isActive
											? "bg-emerald-50 text-emerald-700"
											: "bg-red-50 text-red-700"
									}`}
								>
									{user.isActive ? "Активний" : "Заблокований"}
								</span>
								{currentUserId === user.id ? (
									<span className="rounded-full bg-primary px-3 py-1 text-white">
										Ваш акаунт
									</span>
								) : null}
							</div>
						</div>

						<div className="mt-5 grid gap-4 lg:grid-cols-2">
							<label>
								<span className="mb-2 block text-sm font-medium text-primary">Ім&apos;я</span>
								<input
									value={current.name}
									onChange={(event) =>
										setEditing((state) => ({
											...state,
											[user.id]: { ...state[user.id], name: event.target.value },
										}))
									}
									className="w-full rounded-2xl border border-black/10 px-4 py-3 text-primary outline-none transition focus:border-primary"
								/>
							</label>

							<label>
								<span className="mb-2 block text-sm font-medium text-primary">Email</span>
								<input
									type="email"
									value={current.email}
									onChange={(event) =>
										setEditing((state) => ({
											...state,
											[user.id]: { ...state[user.id], email: event.target.value },
										}))
									}
									className="w-full rounded-2xl border border-black/10 px-4 py-3 text-primary outline-none transition focus:border-primary"
								/>
							</label>

							<label>
								<span className="mb-2 block text-sm font-medium text-primary">Телефон</span>
								<input
									value={current.phone ?? ""}
									onChange={(event) =>
										setEditing((state) => ({
											...state,
											[user.id]: { ...state[user.id], phone: event.target.value },
										}))
									}
									className="w-full rounded-2xl border border-black/10 px-4 py-3 text-primary outline-none transition focus:border-primary"
								/>
							</label>

							<label>
								<span className="mb-2 block text-sm font-medium text-primary">Роль</span>
								<select
									value={current.role}
									onChange={(event) =>
										setEditing((state) => ({
											...state,
											[user.id]: {
												...state[user.id],
												role: event.target.value as UserRoleValue,
											},
										}))
									}
									className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-primary outline-none transition focus:border-primary"
								>
									<option value={USER_ROLES[0]}>Адміністратор</option>
									<option value={USER_ROLES[1]}>Менеджер</option>
									<option value={USER_ROLES[2]}>Користувач</option>
								</select>
							</label>
						</div>

						<div className="mt-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
							<div className="flex flex-wrap gap-4 text-sm text-secondary">
								<span>Сесії: {user._count.authSessions}</span>
								<span>Оголошення власника: {user._count.ownedProperties}</span>
								<span>Створені записи: {user._count.createdProperties}</span>
								<span>Заявки: {user._count.requests}</span>
							</div>

							<div className="flex items-center gap-3">
								<label className="inline-flex items-center gap-2 text-sm font-medium text-primary">
									<input
										type="checkbox"
										checked={current.isActive}
										onChange={(event) =>
											setEditing((state) => ({
												...state,
												[user.id]: {
													...state[user.id],
													isActive: event.target.checked,
												},
											}))
										}
										className="h-5 w-5 cursor-pointer accent-black"
									/>
									Активний акаунт
								</label>

								<button
									type="button"
									disabled={isPending}
									onClick={() => handleSave(user.id)}
									className="cursor-pointer rounded-2xl bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
								>
									Зберегти
								</button>
							</div>
						</div>
					</div>
				);
			})}
		</div>
	);
}
