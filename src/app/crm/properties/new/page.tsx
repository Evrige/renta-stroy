import type { Metadata } from "next";
import { UserRole } from "@/generated/prisma/client";
import { PropertyForm } from "@/components/crm/PropertyForm";
import { Container } from "@/components/layout/Container";
import { PageHeading } from "@/components/layout/PageHeading";
import { requireRole } from "@/lib/auth";
import { ROUTES } from "@/lib/constants/routes";

export const metadata: Metadata = {
	title: "Нове оголошення | CRM",
};

export default async function NewCrmPropertyPage() {
	await requireRole([UserRole.ADMIN, UserRole.MANAGER], ROUTES.CRM_NEW_PROPERTY);

	return (
		<section className="py-12">
			<Container className="space-y-8">
				<PageHeading
					eyebrow="CRM"
					title="Створення нового оголошення"
					description="Менеджер або адміністратор може одразу підготувати повноцінну картку об'єкта для публікації на сайті."
					backHref={ROUTES.CRM}
					backLabel="До CRM"
				/>

				<PropertyForm
					mode="crm-create"
					endpoint="/api/crm/properties"
					method="POST"
					submitLabel="Створити оголошення"
					successMessage="Оголошення створено"
					successHref={ROUTES.CRM}
				/>
			</Container>
		</section>
	);
}
