import type { Metadata } from "next";
import { UserRole } from "@/generated/prisma/client";
import { PropertyForm } from "@/components/crm/PropertyForm";
import { Container } from "@/components/layout/Container";
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
				<div className="max-w-3xl">
					<p className="text-sm font-semibold uppercase tracking-[0.28em] text-secondary">
						CRM
					</p>
					<h1 className="mt-4 text-4xl font-semibold text-primary">
						Створення нового оголошення
					</h1>
					<p className="mt-4 text-base leading-7 text-secondary">
						Менеджер або адміністратор може одразу підготувати повноцінну картку об&apos;єкта
						для публікації на сайті.
					</p>
				</div>

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
