import { z } from "zod";
import { PASSWORD_MIN_LENGTH } from "@/lib/auth/constants";
import {
	LISTING_TYPES,
	PROPERTY_APPROVAL_STATUSES,
	PROPERTY_STATUSES,
	PROPERTY_TYPES,
	RENT_PERIODS,
	USER_ROLES,
} from "./constants";

const namePattern = /^[A-Za-zА-Яа-яІіЇїЄєҐґ'`\- ]+$/;
const phonePattern = /^\+?[0-9()\-\s]{10,20}$/;

const optionalIntegerSchema = z.coerce.number().int().positive().max(500).optional().nullable();
const optionalCoordinateSchema = z.coerce.number().min(-180).max(180).optional().nullable();

export const propertyPayloadSchema = z
	.object({
		title: z.string().trim().min(10, "Заголовок має містити щонайменше 10 символів").max(255),
		description: z
			.string()
			.trim()
			.min(30, "Опис має містити щонайменше 30 символів")
			.max(5000, "Опис занадто довгий"),
		listingType: z.enum(LISTING_TYPES),
		propertyType: z.enum(PROPERTY_TYPES),
		rentPeriod: z.enum(RENT_PERIODS).optional().nullable(),
		price: z.coerce.number().positive("Ціна має бути більшою за 0").max(999_999_999),
		area: z.coerce.number().positive("Площа має бути більшою за 0").max(99_999),
		rooms: optionalIntegerSchema,
		floor: optionalIntegerSchema,
		totalFloors: optionalIntegerSchema,
		bathrooms: optionalIntegerSchema,
		parking: z.boolean(),
		furnished: z.boolean(),
		status: z.enum(PROPERTY_STATUSES).default("AVAILABLE"),
		country: z.string().trim().min(2, "Вкажіть країну").max(100),
		city: z.string().trim().min(2, "Вкажіть місто").max(100),
		district: z.string().trim().max(100).optional().nullable(),
		street: z.string().trim().max(150).optional().nullable(),
		building: z.string().trim().max(50).optional().nullable(),
		latitude: optionalCoordinateSchema.refine(
			(value) => value === null || value === undefined || Math.abs(value) <= 90,
			"Широта має бути в межах від -90 до 90",
		),
		longitude: optionalCoordinateSchema,
		imageUrls: z
			.array(z.string().trim().url("Кожне зображення має бути коректним URL"))
			.min(1, "Додайте хоча б одне зображення")
			.max(12, "Можна додати не більше 12 зображень"),
	})
	.refine(
		(data) => (data.listingType === "RENT" ? Boolean(data.rentPeriod) : !data.rentPeriod),
		{
			message:
				"Для оренди потрібно вказати період, а для продажу поле періоду має бути порожнім",
			path: ["rentPeriod"],
		},
	)
	.refine(
		(data) =>
			!data.floor || !data.totalFloors || data.floor <= data.totalFloors,
		{
			message: "Поверх не може бути більшим за загальну кількість поверхів",
			path: ["floor"],
		},
	)
	.transform((data) => ({
		...data,
		district: data.district || null,
		street: data.street || null,
		building: data.building || null,
		rentPeriod: data.listingType === "RENT" ? data.rentPeriod ?? null : null,
		rooms: data.rooms ?? null,
		floor: data.floor ?? null,
		totalFloors: data.totalFloors ?? null,
		bathrooms: data.bathrooms ?? null,
		latitude: data.latitude ?? null,
		longitude: data.longitude ?? null,
	}));

export const propertyModerationSchema = z
	.object({
		decision: z.enum([
			PROPERTY_APPROVAL_STATUSES[3],
			PROPERTY_APPROVAL_STATUSES[2],
			PROPERTY_APPROVAL_STATUSES[4],
		]),
		moderationNotes: z.string().trim().max(1500).optional().nullable(),
	})
	.refine(
		(data) =>
			data.decision === "APPROVED" ||
			Boolean(data.moderationNotes && data.moderationNotes.length >= 10),
		{
			message: "Для відхилення або доопрацювання додайте коментар щонайменше з 10 символів",
			path: ["moderationNotes"],
		},
	)
	.transform((data) => ({
		...data,
		moderationNotes: data.moderationNotes || null,
	}));

export const crmUserUpdateSchema = z.object({
	name: z
		.string()
		.trim()
		.min(2, "Ім'я має містити щонайменше 2 символи")
		.max(60, "Ім'я не повинно бути довшим за 60 символів")
		.regex(namePattern, "Ім'я може містити лише літери, пробіли, апостроф та дефіс"),
	email: z
		.string()
		.trim()
		.min(1, "Вкажіть email")
		.max(120, "Email занадто довгий")
		.email("Вкажіть коректний email")
		.transform((value) => value.toLowerCase()),
	phone: z
		.string()
		.trim()
		.max(30, "Телефон занадто довгий")
		.optional()
		.transform((value) => value || null)
		.refine((value) => value === null || phonePattern.test(value), "Вкажіть коректний номер телефону"),
	role: z.enum(USER_ROLES),
	isActive: z.boolean(),
});

export const crmCreatePasswordSchema = z
	.string()
	.min(PASSWORD_MIN_LENGTH, `Пароль має містити щонайменше ${PASSWORD_MIN_LENGTH} символів`);
