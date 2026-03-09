import { ROUTES } from "./routes";

export const NAV_ITEMS = [
	{
		href: ROUTES.HOME,
		label: "Главная",
	},
	{
		href: ROUTES.PROPERTIES,
		label: "Недвижимость",
	},
	{
		href: ROUTES.ABOUT,
		label: "О компании",
	},
	{
		href: ROUTES.CONTACTS,
		label: "Контакты",
	},
] as const;