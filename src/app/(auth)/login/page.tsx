import type {Metadata} from "next";
import {redirect} from "next/navigation";
import {AuthForm} from "@/components/auth/AuthForm";
import {Container} from "@/components/layout/Container";
import {getCurrentUser} from "@/lib/auth";
import {ROUTES} from "@/lib/constants/routes";

export const metadata: Metadata = {
	title: "Вхід | Renta Stroy",
};

export default async function LoginPage() {
	const user = await getCurrentUser();

	if (user) {
		redirect(ROUTES.ACCOUNT);
	}

	return (
		<section
			className="bg-[radial-gradient(circle_at_top,rgba(24,26,32,0.12),transparent_45%),linear-gradient(135deg,#f8f8f8_0%,#ffffff_55%,#f2f2f2_100%)] py-16">
			<Container className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
				<div className="max-w-xl space-y-6">
					<p className="text-sm font-semibold uppercase tracking-[0.35em] text-secondary">
						Особистий кабінет
					</p>
					<h1 className="text-4xl font-semibold leading-tight text-primary sm:text-5xl">
						Увійдіть у свій кабінет, щоб працювати з обраними об&apos;єктами та заявками.
					</h1>
					<p className="text-base leading-7 text-secondary sm:text-lg">
						Швидкий вхід до особистого простору клієнта, менеджера або адміністратора.
					</p>
					<div className="rounded-3xl border border-black/10 bg-white/80 p-6 backdrop-blur">
						<p className="text-sm font-semibold text-primary">Тестові акаунти</p>
						<ul className="mt-3 space-y-2 text-sm text-secondary">
							<li>
								<code>admin@example.com</code>
							</li>
							<li>
								<code>manager@example.com</code>
							</li>
							<li>
								<code>user@example.com</code>
							</li>
						</ul>
					</div>
				</div>

				<div className="flex justify-center lg:justify-end">
					<AuthForm mode="login"/>
				</div>
			</Container>
		</section>
	);
}
