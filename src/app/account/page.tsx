import type { Metadata } from "next";
import Link from "next/link";
import { UserRole } from "@/generated/prisma/client";
import {
	formatDate,
	formatPrice,
	formatPropertyApprovalStatus,
	formatPropertyType,
} from "@/app/utils/formatters";
import { FavoriteButton } from "@/components/favorites/FavoriteButton";
import { Container } from "@/components/layout/Container";
import { requireCurrentUser } from "@/lib/auth";
import { ROUTES } from "@/lib/constants/routes";
import { getUserOwnedProperties } from "@/lib/queries/crm";
import { getUserFavoriteProperties } from "@/lib/queries/properties";

export const metadata: Metadata = {
	title: "Кабінет | Renta Stroy",
};

export default async function AccountPage() {
	const user = await requireCurrentUser();
	const [ownProperties, favoriteProperties] = await Promise.all([
		getUserOwnedProperties(user.id),
		getUserFavoriteProperties(user.id),
	]);

	return (
		<section className="py-12">
			<Container className="space-y-8">
				<div className="rounded-[32px] bg-primary px-8 py-10 text-white shadow-[0_28px_80px_rgba(24,26,32,0.18)]">
					<p className="text-sm font-semibold uppercase tracking-[0.3em] text-white/70">
						Особистий кабінет
					</p>
					<h1 className="mt-4 text-4xl font-semibold">{user.name}</h1>
					<p className="mt-3 max-w-2xl text-base leading-7 text-white/75">
						Тут зібрані ваші основні дані та швидкий доступ до персонального профілю.
					</p>
				</div>

				<div className="grid gap-6 md:grid-cols-2">
					<div className="rounded-[28px] border border-black/10 bg-white p-7">
						<h2 className="text-xl font-semibold text-primary">Профіль</h2>
						<div className="mt-5 space-y-3 text-sm text-secondary">
							<p>
								<span className="font-medium text-primary">Email:</span> {user.email}
							</p>
							<p>
								<span className="font-medium text-primary">Телефон:</span>{" "}
								{user.phone ?? "Не вказаний"}
							</p>
							<p>
								<span className="font-medium text-primary">Роль:</span> {user.role}
							</p>
							<p>
								<span className="font-medium text-primary">Статус:</span>{" "}
								{user.isActive ? "Активний" : "Вимкнений"}
							</p>
						</div>
					</div>

					<div className="rounded-[28px] border border-black/10 bg-bg-secondary p-7">
						<h2 className="text-xl font-semibold text-primary">Акаунт</h2>
						<p className="mt-5 text-sm leading-6 text-secondary">
							Ваш профіль готовий до роботи. Надалі тут можна розмістити обрані
							об&apos;єкти, історію заявок, повідомлення та персональні налаштування.
						</p>
						<div className="mt-6 flex flex-wrap gap-3">
							<Link
								href={ROUTES.ACCOUNT_NEW_LISTING}
								className="rounded-2xl bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
							>
								Подати оголошення
							</Link>
							{user.role === UserRole.ADMIN || user.role === UserRole.MANAGER ? (
								<Link
									href={ROUTES.CRM}
									className="rounded-2xl border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-primary transition hover:border-primary"
								>
									Відкрити CRM
								</Link>
							) : null}
						</div>
					</div>
				</div>

				<div className="rounded-[28px] border border-black/10 bg-white p-7">
					<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
						<div>
							<h2 className="text-2xl font-semibold text-primary">Обране</h2>
							<p className="mt-2 text-sm text-secondary">
								Збережені оголошення, до яких ви хочете швидко повертатися.
							</p>
						</div>
						<p className="text-sm font-semibold text-primary">
							{favoriteProperties.length} збережено
						</p>
					</div>

					<div className="mt-6 space-y-4">
						{favoriteProperties.length ? (
							favoriteProperties.map((property) => (
								<div
									key={property.id}
									className="rounded-2xl border border-black/8 bg-bg-secondary/35 p-4"
								>
									<div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
										<div>
											<Link
												href={ROUTES.PROPERTY_DETAILS(property.slug)}
												className="text-lg font-semibold text-primary transition hover:opacity-75"
											>
												{property.title}
											</Link>
											<p className="mt-1 text-sm text-secondary">
												{property.location.city}
												{property.location.district ? `, ${property.location.district}` : ""}
											</p>
											<p className="mt-2 text-sm text-secondary">
												{formatPropertyType(property.propertyType)}
											</p>
										</div>

										<div className="flex flex-col gap-3 lg:items-end">
											<p className="text-sm font-semibold text-primary">
												{formatPrice(property.price)} грн
											</p>
											<FavoriteButton
												propertyId={property.id}
												initialIsFavorite
												isAuthenticated
												variant="action"
												className="w-full lg:w-[240px]"
											/>
										</div>
									</div>
								</div>
							))
						) : (
							<div className="rounded-2xl border border-dashed border-black/10 px-4 py-8 text-center text-sm text-secondary">
								У вас поки немає обраних оголошень.
							</div>
						)}
					</div>
				</div>

				<div className="rounded-[28px] border border-black/10 bg-white p-7">
					<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
						<div>
							<h2 className="text-2xl font-semibold text-primary">Мої оголошення</h2>
							<p className="mt-2 text-sm text-secondary">
								Тут відображаються всі подані вами об&apos;єкти та їхній поточний статус.
							</p>
						</div>
						<Link
							href={ROUTES.ACCOUNT_NEW_LISTING}
							className="rounded-2xl border border-black/10 px-5 py-3 text-sm font-semibold text-primary transition hover:border-primary"
						>
							Нове оголошення
						</Link>
					</div>

					<div className="mt-6 space-y-4">
						{ownProperties.length ? (
							ownProperties.map((property) => (
								<div
									key={property.id}
									className="rounded-2xl border border-black/8 bg-bg-secondary/35 p-4"
								>
									<div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
										<div>
											<p className="text-lg font-semibold text-primary">{property.title}</p>
											<p className="mt-1 text-sm text-secondary">
												{property.location.city}
												{property.location.district ? `, ${property.location.district}` : ""}
											</p>
											{property.moderationNotes ? (
												<p className="mt-3 max-w-3xl text-sm leading-6 text-secondary">
													Коментар менеджера: {property.moderationNotes}
												</p>
											) : null}
										</div>
										<div className="text-left lg:text-right">
											<p className="text-sm font-semibold text-primary">
												{formatPropertyApprovalStatus(property.approvalStatus)}
											</p>
											<p className="mt-1 text-sm text-secondary">
												{formatPrice(property.price)} грн
											</p>
											<p className="mt-1 text-xs uppercase tracking-[0.16em] text-secondary">
												Створено {formatDate(property.createdAt)}
											</p>
										</div>
									</div>
								</div>
							))
						) : (
							<div className="rounded-2xl border border-dashed border-black/10 px-4 py-8 text-center text-sm text-secondary">
								У вас поки немає поданих оголошень.
							</div>
						)}
					</div>
				</div>
			</Container>
		</section>
	);
}
