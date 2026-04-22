"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { type FormEvent, useState, useTransition } from "react";
import { z } from "zod";
import { registerFormSchema } from "@/lib/auth/validation";
import { ROUTES } from "@/lib/constants/routes";

type AuthMode = "login" | "register";

type Props = {
	mode: AuthMode;
};

type FormState = {
	name: string;
	email: string;
	phone: string;
	password: string;
	confirmPassword: string;
};

const initialState: FormState = {
	name: "",
	email: "",
	phone: "",
	password: "",
	confirmPassword: "",
};

export function AuthForm({ mode }: Props) {
	const router = useRouter();
	const searchParams = useSearchParams();
	const [isPending, startTransition] = useTransition();
	const [form, setForm] = useState<FormState>(initialState);
	const [error, setError] = useState<string | null>(null);

	const isRegister = mode === "register";
	const next = searchParams.get("next");
	const nextPath = next && next.startsWith("/") ? next : ROUTES.ACCOUNT;

	const alternateHref = isRegister ? ROUTES.LOGIN : ROUTES.REGISTER;
	const alternateLabel = isRegister ? "Увійти" : "Створити акаунт";
	const endpoint = isRegister ? "/api/auth/register" : "/api/auth/login";
	const submitLabel = isRegister ? "Створити акаунт" : "Увійти";

	async function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setError(null);

		if (isRegister) {
			try {
				registerFormSchema.parse(form);
			} catch (validationError) {
				if (validationError instanceof z.ZodError) {
					setError(validationError.issues[0]?.message ?? "Перевірте коректність даних");
					return;
				}
			}
		}

		try {
			const response = await fetch(endpoint, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					name: form.name,
					email: form.email,
					phone: form.phone,
					password: form.password,
				}),
			});

			const result = (await response.json().catch(() => null)) as
				| { message?: string }
				| null;

			if (!response.ok) {
				setError(result?.message ?? "Сталася помилка");
				return;
			}

			startTransition(() => {
				router.replace(nextPath);
				router.refresh();
			});
		} catch {
			setError("Не вдалося зв'язатися з сервером");
		}
	}

	return (
		<div className="w-full max-w-md rounded-3xl border border-black/10 bg-white p-8 shadow-[0_24px_80px_rgba(0,0,0,0.08)]">
			<div className="mb-8 space-y-3">
				<p className="text-sm font-semibold uppercase tracking-[0.25em] text-secondary">
					Renta Stroy
				</p>
				<h1 className="text-3xl font-semibold text-primary">
					{isRegister ? "Створити акаунт" : "Вхід до кабінету"}
				</h1>
				<p className="text-sm leading-6 text-secondary">
					{isRegister
						? "Заповніть коротку форму, щоб створити профіль і отримати доступ до особистого кабінету."
						: "Вкажіть свої дані, щоб увійти до особистого кабінету."}
				</p>
			</div>

			<form className="space-y-4" onSubmit={handleSubmit}>
				{isRegister ? (
					<label className="block space-y-2">
						<span className="text-sm font-medium text-primary">Ім&apos;я</span>
						<input
							required
							value={form.name}
							onChange={(event) =>
								setForm((current) => ({ ...current, name: event.target.value }))
							}
							className="w-full rounded-2xl border border-black/10 px-4 py-3 text-primary outline-none transition focus:border-primary"
							placeholder="Ваше ім'я"
						/>
					</label>
				) : null}

				<label className="block space-y-2">
					<span className="text-sm font-medium text-primary">Email</span>
					<input
						required
						type="email"
						autoComplete="email"
						value={form.email}
						onChange={(event) =>
							setForm((current) => ({ ...current, email: event.target.value }))
						}
						className="w-full rounded-2xl border border-black/10 px-4 py-3 text-primary outline-none transition focus:border-primary"
						placeholder="you@example.com"
					/>
				</label>

				{isRegister ? (
					<label className="block space-y-2">
						<span className="text-sm font-medium text-primary">Телефон</span>
						<input
							type="tel"
							autoComplete="tel"
							value={form.phone}
						onChange={(event) =>
							setForm((current) => ({ ...current, phone: event.target.value }))
						}
						className="w-full rounded-2xl border border-black/10 px-4 py-3 text-primary outline-none transition focus:border-primary"
						placeholder="+380 67 123 45 67"
					/>
				</label>
				) : null}

				<label className="block space-y-2">
					<span className="text-sm font-medium text-primary">Пароль</span>
					<input
						required
						type="password"
						autoComplete={isRegister ? "new-password" : "current-password"}
						value={form.password}
						onChange={(event) =>
							setForm((current) => ({ ...current, password: event.target.value }))
						}
						className="w-full rounded-2xl border border-black/10 px-4 py-3 text-primary outline-none transition focus:border-primary"
						placeholder="Мінімум 8 символів, велика літера, цифра і символ"
					/>
				</label>

				{isRegister ? (
					<label className="block space-y-2">
						<span className="text-sm font-medium text-primary">Підтвердьте пароль</span>
						<input
							required
							type="password"
							autoComplete="new-password"
							value={form.confirmPassword}
							onChange={(event) =>
								setForm((current) => ({
									...current,
									confirmPassword: event.target.value,
								}))
							}
							className="w-full rounded-2xl border border-black/10 px-4 py-3 text-primary outline-none transition focus:border-primary"
							placeholder="Повторіть пароль"
						/>
					</label>
				) : null}

				{error ? (
					<div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
						{error}
					</div>
				) : null}

				<button
					type="submit"
					disabled={isPending}
					className="w-full cursor-pointer rounded-2xl bg-primary px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
				>
					{isPending ? "Зачекайте..." : submitLabel}
				</button>
			</form>

			<div className="mt-6 flex items-center justify-between gap-4 text-sm text-secondary">
				<span>{isRegister ? "Вже маєте акаунт?" : "Ще не маєте акаунта?"}</span>
				<Link className="font-semibold text-primary" href={alternateHref}>
					{alternateLabel}
				</Link>
			</div>
		</div>
	);
}
