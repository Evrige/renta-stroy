import { ROUTES } from "./routes";

export const NAV_ITEMS = [
	{
		href: ROUTES.HOME,
		label: "Головна",
	},
	{
		href: ROUTES.PROPERTIES,
		label: "Нерухомість",
	},
	{
		href: ROUTES.ABOUT,
		label: "Про компанію",
	},
	{
		href: ROUTES.CONTACTS,
		label: "Контакти",
	},
] as const;