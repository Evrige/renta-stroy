"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

type Props = {
	className?: string;
};

export function LogoutButton({ className = "" }: Props) {
	const router = useRouter();
	const [isPending, startTransition] = useTransition();

	async function handleLogout() {
		await fetch("/api/auth/logout", {
			method: "POST",
		});

		startTransition(() => {
			router.replace("/");
			router.refresh();
		});
	}

	return (
		<button
			type="button"
			onClick={handleLogout}
			disabled={isPending}
			aria-label="Вийти з акаунта"
			title="Вийти"
			className={`inline-flex cursor-pointer items-center justify-center ${className}`}
		>
			<LogOut className={`h-4 w-4 ${isPending ? "opacity-60" : ""}`} />
		</button>
	);
}
