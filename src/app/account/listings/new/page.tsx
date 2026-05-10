import type { Metadata } from "next";
import { PropertyForm } from "@/components/crm/PropertyForm";
import { Container } from "@/components/layout/Container";
import { PageHeading } from "@/components/layout/PageHeading";
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
				<PageHeading
					eyebrow="Нове оголошення"
					title="Подайте об'єкт на модерацію"
					description="Заповніть інформацію про нерухомість, додайте фото та адресу. Після перевірки менеджером оголошення з'явиться на сайті."
					backHref={ROUTES.ACCOUNT}
					backLabel="До кабінету"
				/>

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
