import type { Metadata } from "next";
import { UserRole } from "@/generated/prisma/client";
import {
	formatDate,
	formatPropertyApprovalStatus,
} from "@/app/utils/formatters";
import { PropertyForm } from "@/components/crm/PropertyForm";
import { PropertyModerationPanel } from "@/components/crm/PropertyModerationPanel";
import { Container } from "@/components/layout/Container";
import { requireRole } from "@/lib/auth";
import { ROUTES } from "@/lib/constants/routes";
import { getCrmPropertyById } from "@/lib/queries/crm";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
	title: "Оголошення | CRM",
};

type PageProps = {
	params: Promise<{
		id: string;
	}>;
};

export default async function CrmPropertyDetailsPage({ params }: PageProps) {
	await requireRole([UserRole.ADMIN, UserRole.MANAGER], ROUTES.CRM);

	const { id } = await params;
	const propertyId = Number(id);

	if (!Number.isInteger(propertyId) || propertyId <= 0) {
		notFound();
	}

	const property = await getCrmPropertyById(propertyId);

	if (!property) {
		notFound();
	}

	return (
		<section className="py-12">
			<Container className="space-y-8">
				<div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
					<div className="space-y-4">
						<p className="text-sm font-semibold uppercase tracking-[0.28em] text-secondary">
							CRM картка оголошення
						</p>
						<h1 className="text-4xl font-semibold text-primary">{property.title}</h1>
						<div className="flex flex-wrap gap-3 text-sm text-secondary">
							<span>{formatPropertyApprovalStatus(property.approvalStatus)}</span>
							<span>Створено {formatDate(property.createdAt)}</span>
							{property.reviewedAt ? <span>Перевірено {formatDate(property.reviewedAt)}</span> : null}
						</div>
					</div>

					<div className="rounded-[28px] border border-black/10 bg-white p-6">
						<h2 className="text-xl font-semibold text-primary">Контекст</h2>
						<div className="mt-5 space-y-3 text-sm leading-6 text-secondary">
							<p>
								<span className="font-medium text-primary">Власник:</span>{" "}
								{property.owner?.name ?? "Не вказано"}
							</p>
							<p>
								<span className="font-medium text-primary">Автор:</span>{" "}
								{property.createdBy?.name ?? "Не вказано"}
							</p>
							<p>
								<span className="font-medium text-primary">Менеджер:</span>{" "}
								{property.manager?.name ?? "Не призначено"}
							</p>
							<p>
								<span className="font-medium text-primary">Останній перевіряючий:</span>{" "}
								{property.reviewedBy?.name ?? "Ще не перевірялось"}
							</p>
							{property.owner ? (
								<p>
									<span className="font-medium text-primary">Контакт власника:</span>{" "}
									{property.owner.email}
									{property.owner.phone ? `, ${property.owner.phone}` : ""}
								</p>
							) : null}
							{property.createdBy ? (
								<p>
									<span className="font-medium text-primary">Email автора:</span>{" "}
									{property.createdBy.email}
								</p>
							) : null}
						</div>
					</div>
				</div>

				<div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
					<PropertyForm
						mode="crm-edit"
						endpoint={`/api/crm/properties/${property.id}`}
						method="PATCH"
						submitLabel="Зберегти зміни"
						successMessage="Оголошення оновлено"
						successHref={ROUTES.CRM_PROPERTY_DETAILS(property.id)}
						initialValues={{
							title: property.title,
							description: property.description,
							listingType: property.listingType,
							propertyType: property.propertyType,
							rentPeriod: property.rentPeriod ?? "",
							price: property.price.toString(),
							area: property.area.toString(),
							rooms: property.rooms?.toString() ?? "",
							floor: property.floor?.toString() ?? "",
							totalFloors: property.totalFloors?.toString() ?? "",
							bathrooms: property.bathrooms?.toString() ?? "",
							parking: property.parking,
							furnished: property.furnished,
							status: property.status,
							country: property.location.country,
							city: property.location.city,
							district: property.location.district ?? "",
							street: property.location.street ?? "",
							building: property.location.building ?? "",
							latitude: property.location.latitude?.toString() ?? "",
							longitude: property.location.longitude?.toString() ?? "",
							imageUrlsText: property.images.map((image) => image.url).join("\n"),
							approvalStatus: property.approvalStatus,
							moderationNotes: property.moderationNotes,
						}}
					/>

					<PropertyModerationPanel
						propertyId={property.id}
						initialNotes={property.moderationNotes}
					/>
				</div>
			</Container>
		</section>
	);
}
