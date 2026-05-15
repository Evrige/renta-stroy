"use client";

import { Heart, LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { ROUTES } from "@/lib/constants/routes";

type FavoriteButtonProps = {
	propertyId: number;
	initialIsFavorite: boolean;
	isAuthenticated: boolean;
	variant?: "icon" | "action";
	className?: string;
	onToggle?: (nextValue: boolean) => void;
};

export function FavoriteButton({
	propertyId,
	initialIsFavorite,
	isAuthenticated,
	variant = "icon",
	className = "",
	onToggle,
}: FavoriteButtonProps) {
	const router = useRouter();
	const [isFavorite, setIsFavorite] = useState(initialIsFavorite);
	const [error, setError] = useState<string | null>(null);
	const [isPending, startTransition] = useTransition();

	const handleClick = async () => {
		setError(null);

		if (!isAuthenticated) {
			const nextPath = `${window.location.pathname}${window.location.search}`;
			router.push(`${ROUTES.LOGIN}?next=${encodeURIComponent(nextPath)}`);
			return;
		}

		try {
			const response = await fetch(`/api/favorites/${propertyId}`, {
				method: isFavorite ? "DELETE" : "POST",
			});

			const result = (await response.json().catch(() => null)) as
				| { isFavorite?: boolean; message?: string }
				| null;

			if (!response.ok || typeof result?.isFavorite !== "boolean") {
				setError(result?.message ?? "Не вдалося оновити обране");
				return;
			}

			setIsFavorite(result.isFavorite);
			onToggle?.(result.isFavorite);
			startTransition(() => {
				router.refresh();
			});
		} catch {
			setError("Не вдалося оновити обране");
		}
	};

	if (variant === "action") {
		return (
			<div className={className}>
				<button
					type="button"
					onClick={handleClick}
					disabled={isPending}
					aria-pressed={isFavorite}
					className={`inline-flex w-full items-center justify-center gap-2 rounded-2xl border px-5 py-4 text-sm font-semibold transition ${
						isFavorite
							? "border-primary bg-primary/6 text-primary hover:bg-primary/10"
							: "border-gray-300 bg-white text-primary hover:border-primary"
					} disabled:cursor-not-allowed disabled:opacity-60`}
				>
					{isPending ? <LoaderCircle size={18} className="animate-spin" /> : <Heart size={18} fill={isFavorite ? "currentColor" : "none"} />}
					{isFavorite ? "Видалити з обраного" : "Додати в обране"}
				</button>
				{error ? <p className="mt-2 text-sm text-red-600">{error}</p> : null}
			</div>
		);
	}

	return (
		<div className={className}>
			<button
				type="button"
				onClick={handleClick}
				disabled={isPending}
				aria-label={isFavorite ? "Видалити з обраного" : "Додати в обране"}
				aria-pressed={isFavorite}
				className={`inline-flex h-11 w-11 items-center justify-center rounded-full border shadow-sm backdrop-blur transition ${
					isFavorite
						? "border-primary bg-primary text-white hover:opacity-90"
						: "border-white/80 bg-white/92 text-primary hover:border-primary hover:bg-white"
				} disabled:cursor-not-allowed disabled:opacity-60`}
			>
				{isPending ? (
					<LoaderCircle size={18} className="animate-spin" />
				) : (
					<Heart size={18} fill={isFavorite ? "currentColor" : "none"} />
				)}
			</button>
			{error ? <p className="mt-2 max-w-48 text-xs text-red-600">{error}</p> : null}
		</div>
	);
}
