import type { Metadata } from "next";
import Link from "next/link";
import { PropertyApprovalStatus, UserRole } from "@/generated/prisma/client";
import {
	formatDate,
	formatPrice,
	formatPropertyApprovalStatus,
	formatPropertyType,
} from "@/app/utils/formatters";
import { Container } from "@/components/layout/Container";
import { PageHeading } from "@/components/layout/PageHeading";
import { requireRole } from "@/lib/auth";
import { ROUTES } from "@/lib/constants/routes";
import { getCrmDashboardData } from "@/lib/queries/crm";

export const metadata: Metadata = {
	title: "CRM | Renta Stroy",
};

export default async function CrmDashboardPage() {
	const currentUser = await requireRole([UserRole.ADMIN, UserRole.MANAGER], ROUTES.CRM);
	const dashboard = await getCrmDashboardData(currentUser.id, currentUser.role);

	const summaryMap = new Map(
		dashboard.summary.map((entry) => [entry.approvalStatus, entry._count.approvalStatus]),
	);

	const summaryCards = [
		{
			label: "На модерації",
			value: summaryMap.get(PropertyApprovalStatus.PENDING_REVIEW) ?? 0,
		},
		{
			label: "На доопрацюванні",
			value: summaryMap.get(PropertyApprovalStatus.NEEDS_REVISION) ?? 0,
		},
		{
			label: "Опубліковано",
			value: summaryMap.get(PropertyApprovalStatus.APPROVED) ?? 0,
		},
		{
			label: "Відхилено",
			value: summaryMap.get(PropertyApprovalStatus.REJECTED) ?? 0,
		},
	];

	return (
		<section className="py-12">
			<Container className="space-y-8">
				<PageHeading
					eyebrow="CRM панель"
					title="Керуйте оголошеннями, модерацією та робочим потоком команди"
					description="Тут менеджери та адміністратори обробляють нові заявки на публікацію, редагують картки об'єктів та контролюють поточний стан каталогу."
					backHref={ROUTES.ACCOUNT}
					backLabel="До кабінету"
					actions={
						<>
						<Link
							href={ROUTES.CRM_NEW_PROPERTY}
							className="rounded-2xl bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
						>
							Створити оголошення
						</Link>
						{currentUser.role === UserRole.ADMIN ? (
							<Link
								href={ROUTES.CRM_USERS}
								className="rounded-2xl border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-primary transition hover:border-primary"
							>
								Користувачі
							</Link>
						) : null}
						</>
					}
				/>

				<div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
					{summaryCards.map((card) => (
						<div key={card.label} className="rounded-[28px] border border-black/10 bg-white p-6">
							<p className="text-sm text-secondary">{card.label}</p>
							<p className="mt-3 text-4xl font-semibold text-primary">{card.value}</p>
						</div>
					))}
				</div>

				<div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
					<div className="rounded-[28px] border border-black/10 bg-white p-6">
						<div className="flex items-center justify-between gap-4">
							<div>
								<h2 className="text-2xl font-semibold text-primary">Черга модерації</h2>
								<p className="mt-2 text-sm text-secondary">
									Оголошення користувачів та об&apos;єкти, що потребують втручання.
								</p>
							</div>
						</div>

						<div className="mt-6 space-y-4">
							{dashboard.pendingProperties.length ? (
								dashboard.pendingProperties.map((property) => (
									<Link
										key={property.id}
										href={ROUTES.CRM_PROPERTY_DETAILS(property.id)}
										className="block rounded-2xl border border-black/8 bg-bg-secondary/50 p-4 transition hover:border-primary"
									>
										<div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
											<div>
												<p className="text-lg font-semibold text-primary">{property.title}</p>
												<p className="mt-1 text-sm text-secondary">
													{property.location.city}
													{property.location.district ? `, ${property.location.district}` : ""}
												</p>
												<p className="mt-2 text-sm text-secondary">
													Власник: {property.owner?.name ?? "Не вказано"}
												</p>
											</div>
											<div className="text-right">
												<p className="text-sm font-semibold text-primary">
													{formatPropertyApprovalStatus(property.approvalStatus)}
												</p>
												<p className="mt-1 text-sm text-secondary">
													{formatPrice(property.price)} грн
												</p>
											</div>
										</div>
									</Link>
								))
							) : (
								<div className="rounded-2xl border border-dashed border-black/10 px-4 py-8 text-center text-sm text-secondary">
									У черзі модерації поки немає об&apos;єктів.
								</div>
							)}
						</div>
					</div>

					<div className="rounded-[28px] border border-black/10 bg-white p-6">
						<h2 className="text-2xl font-semibold text-primary">Останні в роботі</h2>
						<p className="mt-2 text-sm text-secondary">
							Ваші або вже оброблені оголошення, до яких найчастіше повертаються.
						</p>

						<div className="mt-6 space-y-4">
							{dashboard.managedProperties.map((property) => (
								<Link
									key={property.id}
									href={ROUTES.CRM_PROPERTY_DETAILS(property.id)}
									className="block rounded-2xl border border-black/8 p-4 transition hover:border-primary"
								>
									<div className="flex items-start justify-between gap-4">
										<div>
											<p className="font-semibold text-primary">{property.title}</p>
											<p className="mt-1 text-sm text-secondary">
												{formatPropertyType(property.propertyType)}
											</p>
											<p className="mt-2 text-xs uppercase tracking-[0.18em] text-secondary">
												{formatPropertyApprovalStatus(property.approvalStatus)}
											</p>
										</div>
										<p className="text-sm text-secondary">
											{property.publishedAt
												? formatDate(property.publishedAt)
												: formatDate(property.createdAt)}
										</p>
									</div>
								</Link>
							))}
						</div>
					</div>
				</div>
			</Container>
		</section>
	);
}
