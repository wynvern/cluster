import { nextui } from "@nextui-org/react";
import type { Config } from "tailwindcss";

const config: Config = {
	content: [
		"./pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./components/**/*.{js,ts,jsx,tsx,mdx}",
		"./app/**/*.{js,ts,jsx,tsx,mdx}",
		"./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
	],
	theme: {
		extend: {},
	},
	darkMode: "class",
	plugins: [
		nextui({
			themes: {
				dark: {
					colors: {
						primary: {
							DEFAULT: "#fff", // Primary color of the application
							foreground: "#000000",
						},
						secondary: {
							DEFAULT: "#131313",
							foreground: "#E0E0E0",
						},
						content1: {
							DEFAULT: "#131313",
							foreground: "#E0E0E0",
						},
						content2: {
							DEFAULT: "#131313",
							foreground: "#E0E0E0",
						},
						content3: {
							DEFAULT: "#131313",
							foreground: "#E0E0E0",
						},
						content4: {
							DEFAULT: "#131313",
							foreground: "#E0E0E0",
						},
					},
					layout: {},
				},
			},
		}),
	],
};
export default config;
