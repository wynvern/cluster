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
							foreground: "#FAF9F6",
						},
						content1: {
							DEFAULT: "#131313",
							foreground: "#FAF9F6",
						},
						content2: {
							DEFAULT: "#131313",
							foreground: "#FAF9F6",
						},
						content3: {
							DEFAULT: "#131313",
							foreground: "#FAF9F6",
						},
						content4: {
							DEFAULT: "#131313",
							foreground: "#FAF9F6",
						},
						background: {
							DEFAULT: "#131313",
							foreground: "#FAF9F6",
						},
					},
					layout: {
						fontSize: {
							small: "16px",
							tiny: "14px",
						},
					},
				},
				light: {
					colors: {
						primary: {
							DEFAULT: "#000", // Primary color of the application
							foreground: "#fff",
						},
						secondary: {
							DEFAULT: "#FAF9F6",
							foreground: "#131313",
						},
						content1: {
							DEFAULT: "#FAF9F6",
							foreground: "#131313",
						},
						content2: {
							DEFAULT: "#FAF9F6",
							foreground: "#131313",
						},
						content3: {
							DEFAULT: "#FAF9F6",
							foreground: "#131313",
						},
						content4: {
							DEFAULT: "#FAF9F6",
							foreground: "#131313",
						},
						background: {
							DEFAULT: "#FAF9F6",
							foreground: "#131313",
						},
					},
					layout: {
						fontSize: {
							small: "16px",
							tiny: "14px",
						},
					},
				},
			},
		}),
	],
};
export default config;
