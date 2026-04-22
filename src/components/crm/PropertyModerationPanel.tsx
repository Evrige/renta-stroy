"use client";

import { type PropertyApprovalStatusValue } from "@/lib/crm/constants";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

type Props = {
	propertyId: number;
	initialNotes?: string | null;
};

export function PropertyModerationPanel({ propertyId, initialNotes }: Props) {
	const router = useRouter();
	const [notes, setNotes] = useState(initialNotes ?? "");
	const [error, setError] = useState<string | null>(null);
	const [isPending, startTransition] = useTransition();

	async function handleDecision(decision: PropertyApprovalStatusValue) {
		setError(null);

		const response = await fetch(`/api/crm/properties/${propertyId}/moderate`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				decision,
				moderationNotes: notes,
			}),
		});

		const result = (await response.json().catch(() => null)) as
			| { message?: string }
			| null;

		if (!response.ok) {
			setError(result?.message ?? "Не вдалося виконати модерацію");
			return;
		}

		startTransition(() => {
			router.refresh();
		});
	}

	return (
		<div className="rounded-[28px] border border-black/10 bg-white p-6">
			<h2 className="text-xl font-semibold text-primary">Модерація</h2>
			<p className="mt-3 text-sm leading-6 text-secondary">
				Залиште коментар для користувача, якщо потрібно доопрацювання або відхилення.
			</p>

			<textarea
				rows={6}
				value={notes}
				onChange={(event) => setNotes(event.target.value)}
				className="mt-5 w-full rounded-2xl border border-black/10 px-4 py-3 text-primary outline-none transition focus:border-primary"
				placeholder="Наприклад, додайте точнішу адресу, більше фото або уточніть площу."
			/>

			{error ? (
				<div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
					{error}
				</div>
			) : null}

			<div className="mt-5 grid gap-3">
				<button
					type="button"
					disabled={isPending}
					onClick={() => handleDecision("APPROVED")}
					className="cursor-pointer rounded-2xl bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
				>
					Опублікувати
				</button>
				<button
					type="button"
					disabled={isPending}
					onClick={() => handleDecision("NEEDS_REVISION")}
					className="cursor-pointer rounded-2xl border border-black/10 bg-bg-secondary px-5 py-3 text-sm font-semibold text-primary transition hover:border-primary disabled:cursor-not-allowed disabled:opacity-60"
				>
					На доопрацювання
				</button>
				<button
					type="button"
					disabled={isPending}
					onClick={() => handleDecision("REJECTED")}
					className="cursor-pointer rounded-2xl border border-red-200 bg-red-50 px-5 py-3 text-sm font-semibold text-red-700 transition hover:border-red-400 disabled:cursor-not-allowed disabled:opacity-60"
				>
					Відхилити
				</button>
			</div>
		</div>
	);
}
