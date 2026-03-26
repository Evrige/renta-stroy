export const ROUTES = {
	HOME: "/",
	PROPERTIES: "/properties",
	ABOUT: "/about",
	CONTACTS: "/contacts",
	LOGIN: "/login",
	PROPERTY_DETAILS: (slug: string) => `/properties/${slug}`,
} as const;
