import type { Metadata } from "next";
import { PropertyForm } from "@/components/crm/PropertyForm";
import { Container } from "@/components/layout/Container";
import { requireCurrentUser } from "@/lib/auth";
import { ROUTES } from "@/lib/constants/routes";

export const metadata: Metadata = {
	title: "Подати оголошення | Renta Stroy",
};

export default async function NewAccountListingPage() {
	await requireCurrentUser(ROUTES.ACCOUNT_NEW_LISTING);

	return (
		<section className="py-12">
			<Container className="space-y-8">
				<div className="max-w-3xl">
					<p className="text-sm font-semibold uppercase tracking-[0.28em] text-secondary">
						Нове оголошення
					</p>
					<h1 className="mt-4 text-4xl font-semibold text-primary">
						Подайте об&apos;єкт на модерацію
					</h1>
					<p className="mt-4 text-base leading-7 text-secondary">
						Заповніть інформацію про нерухомість, додайте фото та адресу. Після перевірки
						менеджером оголошення з&apos;явиться на сайті.
					</p>
				</div>

				<PropertyForm
					mode="submission"
					endpoint="/api/properties/submissions"
					method="POST"
					submitLabel="Відправити на перевірку"
					successMessage="Оголошення створено"
					successHref={ROUTES.ACCOUNT}
				/>
			</Container>
		</section>
	);
}
