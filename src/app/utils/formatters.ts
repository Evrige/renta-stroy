// 🔥 Универсальный файл для форматирования enum → текст

// ================= USER =================
import {Decimal} from "@prisma/client-runtime-utils";

export const formatUserRole = (role: string) => {
	switch (role) {
		case "ADMIN":
			return "Адміністратор";
		case "MANAGER":
			return "Менеджер";
		case "USER":
			return "Користувач";
		default:
			return role;
	}
};

// ================= PROPERTY =================
export const formatListingType = (type: string) => {
	switch (type) {
		case "SALE":
			return "Продаж";
		case "RENT":
			return "Оренда";
		default:
			return type;
	}
};

export const formatPropertyType = (type: string) => {
	switch (type) {
		case "APARTMENT":
			return "Квартира";
		case "HOUSE":
			return "Будинок";
		case "OFFICE":
			return "Офіс";
		case "COMMERCIAL":
			return "Комерція";
		case "WAREHOUSE":
			return "Склад";
		case "MALL":
			return "ТЦ";
		default:
			return type;
	}
};

export const formatRentPeriod = (period?: string | null) => {
	if (!period) return "";

	switch (period) {
		case "DAILY":
			return "Подобово";
		case "MONTHLY":
			return "Щомісяця";
		default:
			return period;
	}
};

export const formatPropertyStatus = (status: string) => {
	switch (status) {
		case "AVAILABLE":
			return "Доступно";
		case "RESERVED":
			return "Заброньовано";
		case "SOLD":
			return "Продано";
		case "RENTED":
			return "Здано";
		case "INACTIVE":
			return "Неактивно";
		default:
			return status;
	}
};

// ================= REQUEST =================
export const formatRequestType = (type: string) => {
	switch (type) {
		case "BUY":
			return "Купівля";
		case "RENT":
			return "Оренда";
		case "VIEWING":
			return "Перегляд";
		case "CONSULTATION":
			return "Консультація";
		default:
			return type;
	}
};

export const formatRequestStatus = (status: string) => {
	switch (status) {
		case "PENDING":
			return "Очікує";
		case "IN_PROGRESS":
			return "В процесі";
		case "APPROVED":
			return "Схвалено";
		case "REJECTED":
			return "Відхилено";
		case "COMPLETED":
			return "Завершено";
		default:
			return status;
	}
};

// ================= TRANSACTION =================
export const formatTransactionType = (type: string) => {
	switch (type) {
		case "SALE":
			return "Продаж";
		case "RENT":
			return "Оренда";
		default:
			return type;
	}
};

export const formatTransactionStatus = (status: string) => {
	switch (status) {
		case "PENDING":
			return "Очікує";
		case "ACTIVE":
			return "Активна";
		case "COMPLETED":
			return "Завершена";
		case "CANCELLED":
			return "Скасована";
		default:
			return status;
	}
};

export const formatPrice = (price: Decimal) => Number(price).toLocaleString("uk-UA")

export const formatDate = (date: Date | string) => {
	const formatted = new Intl.DateTimeFormat("uk-UA", {
		day: "numeric",
		month: "long",
		year: "numeric",
	}).format(new Date(date));

	return formatted.replace(" р.", "");
};
