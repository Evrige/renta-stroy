import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthForm } from "@/components/auth/AuthForm";
import { Container } from "@/components/layout/Container";
import { getCurrentUser } from "@/lib/auth";
import { ROUTES } from "@/lib/constants/routes";

export const metadata: Metadata = {
	title: "Реєстрація | Renta Stroy",
};

export default async function RegisterPage() {
	const user = await getCurrentUser();

	if (user) {
		redirect(ROUTES.ACCOUNT);
	}

	return (
		<section className="bg-[radial-gradient(circle_at_bottom_left,_rgba(24,26,32,0.12),_transparent_40%),linear-gradient(135deg,#ffffff_0%,#f5f4f2_55%,#efefef_100%)] py-16">
			<Container className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
				<div className="flex justify-center lg:justify-start">
					<AuthForm mode="register" />
				</div>

				<div className="max-w-xl space-y-6 lg:justify-self-end">
					<p className="text-sm font-semibold uppercase tracking-[0.35em] text-secondary">
						Новий кабінет
					</p>
					<h1 className="text-4xl font-semibold leading-tight text-primary sm:text-5xl">
						Створіть обліковий запис для роботи з нерухомістю, заявками та обраними об&apos;єктами.
					</h1>
					<p className="text-base leading-7 text-secondary sm:text-lg">
						Оформіть профіль, щоб зберігати обрані пропозиції, залишати заявки та швидше
						повертатися до переглянутих об&apos;єктів.
					</p>
				</div>
			</Container>
		</section>
	);
}
