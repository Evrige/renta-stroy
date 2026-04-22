import { z } from "zod";
import { PASSWORD_MIN_LENGTH } from "./constants";

const namePattern = /^[A-Za-zА-Яа-яІіЇїЄєҐґ'`\- ]+$/;
const phonePattern = /^\+?[0-9()\-\s]{10,20}$/;
const passwordUppercasePattern = /[A-ZА-ЯІЇЄҐ]/;
const passwordLowercasePattern = /[a-zа-яіїєґ]/;
const passwordDigitPattern = /\d/;
const passwordSpecialPattern = /[^A-Za-zА-Яа-яІіЇїЄєҐґ0-9\s]/;

export const registerPayloadSchema = z.object({
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
	password: z
		.string()
		.min(PASSWORD_MIN_LENGTH, `Пароль має містити щонайменше ${PASSWORD_MIN_LENGTH} символів`)
		.max(72, "Пароль не повинен бути довшим за 72 символи")
		.refine((value) => !/\s/.test(value), "Пароль не повинен містити пробіли")
		.refine(
			(value) => passwordUppercasePattern.test(value),
			"Пароль має містити хоча б одну велику літеру",
		)
		.refine(
			(value) => passwordLowercasePattern.test(value),
			"Пароль має містити хоча б одну малу літеру",
		)
		.refine(
			(value) => passwordDigitPattern.test(value),
			"Пароль має містити хоча б одну цифру",
		)
		.refine(
			(value) => passwordSpecialPattern.test(value),
			"Пароль має містити хоча б один спеціальний символ",
		),
	phone: z
		.string()
		.trim()
		.max(30, "Телефон занадто довгий")
		.optional()
		.transform((value) => value || null)
		.refine(
			(value) => value === null || phonePattern.test(value),
			"Вкажіть коректний номер телефону",
		),
});

export const registerFormSchema = registerPayloadSchema
	.extend({
		confirmPassword: z.string().min(1, "Підтвердьте пароль"),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Паролі не співпадають",
		path: ["confirmPassword"],
	});
