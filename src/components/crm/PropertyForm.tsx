"use client";

import {
	LISTING_TYPES,
	PROPERTY_TYPES,
	PROPERTY_STATUSES,
	RENT_PERIODS,
	type ListingTypeValue,
	type PropertyApprovalStatusValue,
	type PropertyStatusValue,
	type PropertyTypeValue,
	type RentPeriodValue,
} from "@/lib/crm/constants";
import { ROUTES } from "@/lib/constants/routes";
import { propertyPayloadSchema } from "@/lib/crm/validation";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { type FormEvent, useState, useTransition } from "react";
import { z } from "zod";

type PropertyFormMode = "submission" | "crm-create" | "crm-edit";

type PropertyFormValues = {
	title: string;
	description: string;
	listingType: ListingTypeValue;
	propertyType: PropertyTypeValue;
	rentPeriod: RentPeriodValue | "";
	price: string;
	area: string;
	rooms: string;
	floor: string;
	totalFloors: string;
	bathrooms: string;
	parking: boolean;
	furnished: boolean;
	status: PropertyStatusValue;
	country: string;
	city: string;
	district: string;
	street: string;
	building: string;
	latitude: string;
	longitude: string;
	imageUrlsText: string;
	approvalStatus?: PropertyApprovalStatusValue;
	moderationNotes?: string | null;
};

type Props = {
	mode: PropertyFormMode;
	endpoint: string;
	method: "POST" | "PATCH";
	submitLabel: string;
	successMessage: string;
	successHref: string;
	initialValues?: Partial<PropertyFormValues>;
};

const listingTypeOptions = [
	{ value: LISTING_TYPES[0], label: "Продаж" },
	{ value: LISTING_TYPES[1], label: "Оренда" },
] as const;

const propertyTypeOptions = [
	{ value: PROPERTY_TYPES[0], label: "Квартира" },
	{ value: PROPERTY_TYPES[1], label: "Будинок" },
	{ value: PROPERTY_TYPES[2], label: "Офіс" },
	{ value: PROPERTY_TYPES[3], label: "Комерція" },
	{ value: PROPERTY_TYPES[4], label: "Склад" },
	{ value: PROPERTY_TYPES[5], label: "ТЦ" },
] as const;

const rentPeriodOptions = [
	{ value: RENT_PERIODS[0], label: "Подобово" },
	{ value: RENT_PERIODS[1], label: "Щомісяця" },
] as const;

const statusOptions = [
	{ value: PROPERTY_STATUSES[0], label: "Доступно" },
	{ value: PROPERTY_STATUSES[1], label: "Заброньовано" },
	{ value: PROPERTY_STATUSES[2], label: "Продано" },
	{ value: PROPERTY_STATUSES[3], label: "Здано" },
	{ value: PROPERTY_STATUSES[4], label: "Неактивно" },
] as const;

const defaultValues: PropertyFormValues = {
	title: "",
	description: "",
	listingType: LISTING_TYPES[0],
	propertyType: PROPERTY_TYPES[0],
	rentPeriod: "",
	price: "",
	area: "",
	rooms: "",
	floor: "",
	totalFloors: "",
	bathrooms: "",
	parking: false,
	furnished: false,
	status: PROPERTY_STATUSES[0],
	country: "Україна",
	city: "",
	district: "",
	street: "",
	building: "",
	latitude: "",
	longitude: "",
	imageUrlsText: "",
	approvalStatus: undefined,
	moderationNotes: null,
};

function normalizeNullableNumber(value: string) {
	return value.trim() ? Number(value) : null;
}

function buildPayload(values: PropertyFormValues) {
	return {
		title: values.title,
		description: values.description,
		listingType: values.listingType,
		propertyType: values.propertyType,
		rentPeriod: values.rentPeriod || null,
		price: Number(values.price),
		area: Number(values.area),
		rooms: normalizeNullableNumber(values.rooms),
		floor: normalizeNullableNumber(values.floor),
		totalFloors: normalizeNullableNumber(values.totalFloors),
		bathrooms: normalizeNullableNumber(values.bathrooms),
		parking: values.parking,
		furnished: values.furnished,
		status: values.status,
		country: values.country,
		city: values.city,
		district: values.district || null,
		street: values.street || null,
		building: values.building || null,
		latitude: normalizeNullableNumber(values.latitude),
		longitude: normalizeNullableNumber(values.longitude),
		imageUrls: values.imageUrlsText
			.split("\n")
			.map((line) => line.trim())
			.filter(Boolean),
	};
}

export function PropertyForm({
	mode,
	endpoint,
	method,
	submitLabel,
	successMessage,
	successHref,
	initialValues,
}: Props) {
	const router = useRouter();
	const [isPending, startTransition] = useTransition();
	const [form, setForm] = useState<PropertyFormValues>({
		...defaultValues,
		...initialValues,
	});
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState<string | null>(null);

	const isSubmission = mode === "submission";

	async function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setError(null);
		setSuccess(null);

		try {
			const payload = propertyPayloadSchema.parse(buildPayload(form));
			const response = await fetch(endpoint, {
				method,
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(payload),
			});

			const result = (await response.json().catch(() => null)) as
				| { message?: string }
				| null;

			if (!response.ok) {
				setError(result?.message ?? "Сталася помилка при збереженні");
				return;
			}

			setSuccess(result?.message ?? successMessage);
			startTransition(() => {
				router.replace(successHref);
				router.refresh();
			});
		} catch (validationError) {
			if (validationError instanceof z.ZodError) {
				setError(validationError.issues[0]?.message ?? "Перевірте введені дані");
				return;
			}

			setError("Не вдалося зберегти оголошення");
		}
	}

	return (
		<form className="space-y-8" onSubmit={handleSubmit}>
			<div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
				<div className="space-y-6">
					<div className="rounded-[28px] border border-black/10 bg-white p-6">
						<h2 className="text-2xl font-semibold text-primary">Основна інформація</h2>
						<div className="mt-5 grid gap-4 md:grid-cols-2">
							<label className="md:col-span-2">
								<span className="mb-2 block text-sm font-medium text-primary">Заголовок</span>
								<input
									required
									value={form.title}
									onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
									className="w-full rounded-2xl border border-black/10 px-4 py-3 text-primary outline-none transition focus:border-primary"
									placeholder="Наприклад, Простора квартира в центрі міста"
								/>
							</label>

							<label>
								<span className="mb-2 block text-sm font-medium text-primary">Тип угоди</span>
								<select
									value={form.listingType}
									onChange={(event) =>
										setForm((current) => ({
											...current,
											listingType: event.target.value as ListingTypeValue,
											rentPeriod: event.target.value === "RENT" ? current.rentPeriod : "",
										}))
									}
									className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-primary outline-none transition focus:border-primary"
								>
									{listingTypeOptions.map((option) => (
										<option key={option.value} value={option.value}>
											{option.label}
										</option>
									))}
								</select>
							</label>

							<label>
								<span className="mb-2 block text-sm font-medium text-primary">Тип нерухомості</span>
								<select
									value={form.propertyType}
									onChange={(event) =>
										setForm((current) => ({
											...current,
											propertyType: event.target.value as PropertyTypeValue,
										}))
									}
									className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-primary outline-none transition focus:border-primary"
								>
									{propertyTypeOptions.map((option) => (
										<option key={option.value} value={option.value}>
											{option.label}
										</option>
									))}
								</select>
							</label>

							{form.listingType === "RENT" ? (
								<label>
									<span className="mb-2 block text-sm font-medium text-primary">Період оренди</span>
									<select
										value={form.rentPeriod}
										onChange={(event) =>
											setForm((current) => ({
												...current,
												rentPeriod: event.target.value as RentPeriodValue,
											}))
										}
										className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-primary outline-none transition focus:border-primary"
									>
										<option value="">Оберіть</option>
										{rentPeriodOptions.map((option) => (
											<option key={option.value} value={option.value}>
												{option.label}
											</option>
										))}
									</select>
								</label>
							) : null}

							<label>
								<span className="mb-2 block text-sm font-medium text-primary">Ціна</span>
								<input
									required
									type="number"
									min="1"
									value={form.price}
									onChange={(event) => setForm((current) => ({ ...current, price: event.target.value }))}
									className="w-full rounded-2xl border border-black/10 px-4 py-3 text-primary outline-none transition focus:border-primary"
									placeholder="250000"
								/>
							</label>

							<label>
								<span className="mb-2 block text-sm font-medium text-primary">Площа, м2</span>
								<input
									required
									type="number"
									min="1"
									value={form.area}
									onChange={(event) => setForm((current) => ({ ...current, area: event.target.value }))}
									className="w-full rounded-2xl border border-black/10 px-4 py-3 text-primary outline-none transition focus:border-primary"
									placeholder="78"
								/>
							</label>

							<label>
								<span className="mb-2 block text-sm font-medium text-primary">Кімнати</span>
								<input
									type="number"
									min="1"
									value={form.rooms}
									onChange={(event) => setForm((current) => ({ ...current, rooms: event.target.value }))}
									className="w-full rounded-2xl border border-black/10 px-4 py-3 text-primary outline-none transition focus:border-primary"
									placeholder="3"
								/>
							</label>

							<label>
								<span className="mb-2 block text-sm font-medium text-primary">Санвузли</span>
								<input
									type="number"
									min="1"
									value={form.bathrooms}
									onChange={(event) =>
										setForm((current) => ({ ...current, bathrooms: event.target.value }))
									}
									className="w-full rounded-2xl border border-black/10 px-4 py-3 text-primary outline-none transition focus:border-primary"
									placeholder="2"
								/>
							</label>

							<label>
								<span className="mb-2 block text-sm font-medium text-primary">Поверх</span>
								<input
									type="number"
									min="1"
									value={form.floor}
									onChange={(event) => setForm((current) => ({ ...current, floor: event.target.value }))}
									className="w-full rounded-2xl border border-black/10 px-4 py-3 text-primary outline-none transition focus:border-primary"
									placeholder="7"
								/>
							</label>

							<label>
								<span className="mb-2 block text-sm font-medium text-primary">Усього поверхів</span>
								<input
									type="number"
									min="1"
									value={form.totalFloors}
									onChange={(event) =>
										setForm((current) => ({ ...current, totalFloors: event.target.value }))
									}
									className="w-full rounded-2xl border border-black/10 px-4 py-3 text-primary outline-none transition focus:border-primary"
									placeholder="12"
								/>
							</label>

							{!isSubmission ? (
								<label className="md:col-span-2">
									<span className="mb-2 block text-sm font-medium text-primary">Статус на сайті</span>
									<select
										value={form.status}
										onChange={(event) =>
											setForm((current) => ({
												...current,
												status: event.target.value as PropertyStatusValue,
											}))
										}
										className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-primary outline-none transition focus:border-primary"
									>
										{statusOptions.map((option) => (
											<option key={option.value} value={option.value}>
												{option.label}
											</option>
										))}
									</select>
								</label>
							) : null}

							<label className="md:col-span-2">
								<span className="mb-2 block text-sm font-medium text-primary">Опис</span>
								<textarea
									required
									rows={7}
									value={form.description}
									onChange={(event) =>
										setForm((current) => ({ ...current, description: event.target.value }))
									}
									className="w-full rounded-2xl border border-black/10 px-4 py-3 text-primary outline-none transition focus:border-primary"
									placeholder="Опишіть планування, стан ремонту, переваги розташування, транспорт і все важливе для покупця або орендаря."
								/>
							</label>
						</div>
					</div>

					<div className="rounded-[28px] border border-black/10 bg-white p-6">
						<h2 className="text-2xl font-semibold text-primary">Локація та медіа</h2>
						<div className="mt-5 grid gap-4 md:grid-cols-2">
							<label>
								<span className="mb-2 block text-sm font-medium text-primary">Країна</span>
								<input
									required
									value={form.country}
									onChange={(event) =>
										setForm((current) => ({ ...current, country: event.target.value }))
									}
									className="w-full rounded-2xl border border-black/10 px-4 py-3 text-primary outline-none transition focus:border-primary"
								/>
							</label>

							<label>
								<span className="mb-2 block text-sm font-medium text-primary">Місто</span>
								<input
									required
									value={form.city}
									onChange={(event) => setForm((current) => ({ ...current, city: event.target.value }))}
									className="w-full rounded-2xl border border-black/10 px-4 py-3 text-primary outline-none transition focus:border-primary"
									placeholder="Київ"
								/>
							</label>

							<label>
								<span className="mb-2 block text-sm font-medium text-primary">Район</span>
								<input
									value={form.district}
									onChange={(event) =>
										setForm((current) => ({ ...current, district: event.target.value }))
									}
									className="w-full rounded-2xl border border-black/10 px-4 py-3 text-primary outline-none transition focus:border-primary"
								/>
							</label>

							<label>
								<span className="mb-2 block text-sm font-medium text-primary">Вулиця</span>
								<input
									value={form.street}
									onChange={(event) =>
										setForm((current) => ({ ...current, street: event.target.value }))
									}
									className="w-full rounded-2xl border border-black/10 px-4 py-3 text-primary outline-none transition focus:border-primary"
								/>
							</label>

							<label>
								<span className="mb-2 block text-sm font-medium text-primary">Будинок</span>
								<input
									value={form.building}
									onChange={(event) =>
										setForm((current) => ({ ...current, building: event.target.value }))
									}
									className="w-full rounded-2xl border border-black/10 px-4 py-3 text-primary outline-none transition focus:border-primary"
								/>
							</label>

							<label>
								<span className="mb-2 block text-sm font-medium text-primary">Широта</span>
								<input
									type="number"
									step="0.000001"
									value={form.latitude}
									onChange={(event) =>
										setForm((current) => ({ ...current, latitude: event.target.value }))
									}
									className="w-full rounded-2xl border border-black/10 px-4 py-3 text-primary outline-none transition focus:border-primary"
									placeholder="50.4501"
								/>
							</label>

							<label>
								<span className="mb-2 block text-sm font-medium text-primary">Довгота</span>
								<input
									type="number"
									step="0.000001"
									value={form.longitude}
									onChange={(event) =>
										setForm((current) => ({ ...current, longitude: event.target.value }))
									}
									className="w-full rounded-2xl border border-black/10 px-4 py-3 text-primary outline-none transition focus:border-primary"
									placeholder="30.5234"
								/>
							</label>

							<label className="md:col-span-2">
								<span className="mb-2 block text-sm font-medium text-primary">
									URL зображень, по одному в рядку
								</span>
								<textarea
									required
									rows={7}
									value={form.imageUrlsText}
									onChange={(event) =>
										setForm((current) => ({ ...current, imageUrlsText: event.target.value }))
									}
									className="w-full rounded-2xl border border-black/10 px-4 py-3 text-primary outline-none transition focus:border-primary"
									placeholder={"https://example.com/image-1.jpg\nhttps://example.com/image-2.jpg"}
								/>
							</label>
						</div>
					</div>
				</div>

				<div className="space-y-6">
					<div className="rounded-[28px] border border-black/10 bg-white p-6">
						<h2 className="text-xl font-semibold text-primary">Додатково</h2>
						<div className="mt-5 space-y-4">
							<label className="flex items-center justify-between gap-4 rounded-2xl border border-black/8 px-4 py-3">
								<span className="text-sm font-medium text-primary">Паркінг</span>
								<input
									type="checkbox"
									checked={form.parking}
									onChange={(event) =>
										setForm((current) => ({ ...current, parking: event.target.checked }))
									}
									className="h-5 w-5 cursor-pointer accent-black"
								/>
							</label>

							<label className="flex items-center justify-between gap-4 rounded-2xl border border-black/8 px-4 py-3">
								<span className="text-sm font-medium text-primary">Мебльовано</span>
								<input
									type="checkbox"
									checked={form.furnished}
									onChange={(event) =>
										setForm((current) => ({ ...current, furnished: event.target.checked }))
									}
									className="h-5 w-5 cursor-pointer accent-black"
								/>
							</label>

							{form.approvalStatus ? (
								<div className="rounded-2xl bg-bg-secondary p-4 text-sm text-secondary">
									<p className="font-semibold text-primary">Поточний статус модерації</p>
									<p className="mt-2">{form.approvalStatus}</p>
									{form.moderationNotes ? (
										<p className="mt-3 leading-6">{form.moderationNotes}</p>
									) : null}
								</div>
							) : null}
						</div>
					</div>

					{error ? (
						<div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
							{error}
						</div>
					) : null}

					{success ? (
						<div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
							{success}
						</div>
					) : null}

					<div className="rounded-[28px] border border-black/10 bg-primary p-6 text-white">
						<h2 className="text-xl font-semibold">
							{isSubmission ? "Надіслати на модерацію" : "Зберегти оголошення"}
						</h2>
						<p className="mt-3 text-sm leading-6 text-white/70">
							{isSubmission
								? "Після відправки оголошення потрапить у чергу перевірки менеджера."
								: "Після збереження ви зможете продовжити роботу з оголошенням у CRM."}
						</p>

						<div className="mt-6 flex flex-col gap-3">
							<button
								type="submit"
								disabled={isPending}
								className="w-full cursor-pointer rounded-2xl bg-white px-5 py-4 text-sm font-semibold text-primary transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
							>
								{isPending ? "Збереження..." : submitLabel}
							</button>
							<Link
								href={isSubmission ? ROUTES.ACCOUNT : ROUTES.CRM}
								className="rounded-2xl border border-white/20 px-5 py-4 text-center text-sm font-semibold text-white/85 transition hover:border-white/40 hover:text-white"
							>
								Скасувати
							</Link>
						</div>
					</div>
				</div>
			</div>
		</form>
	);
}
