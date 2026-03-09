import type { Config } from "tailwindcss";

export default {
	content: [
		"./src/**/*.{js,ts,jsx,tsx}",
	],
	theme: {
		extend: {
			colors: {
				primary: "#2563EB",
				secondary: "#22C55E",
				accent: "#F59E0B",
				bgColor: "#F7F7F7",

				brand: {
					DEFAULT: "#2563EB",
					light: "#3B82F6",
					dark: "#1D4ED8",
				},

				graySoft: "#F5F7FA",
			},
		},
	},
	plugins: [],
} satisfies Config;