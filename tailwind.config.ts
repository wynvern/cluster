import { nextui } from "@nextui-org/react";

const config = {
	content: [
		// "./pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./components/**/*.{js,ts,jsx,tsx,mdx}",
		"./app/**/*.{js,ts,jsx,tsx,mdx}",
		"./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
	],
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
							DEFAULT: "#0a0a0a",
							foreground: "#FAF9F6",
						},
						content1: {
							DEFAULT: "#0a0a0a",
							foreground: "#FAF9F6",
						},
						content2: {
							DEFAULT: "#0a0a0a",
							foreground: "#FAF9F6",
						},
						content3: {
							DEFAULT: "#0a0a0a",
							foreground: "#FAF9F6",
						},
						content4: {
							DEFAULT: "#0a0a0a",
							foreground: "#FAF9F6",
						},
						background: {
							DEFAULT: "#0a0a0a",
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
							foreground: "#0a0a0a",
						},
						content1: {
							DEFAULT: "#FAF9F6",
							foreground: "#0a0a0a",
						},
						content2: {
							DEFAULT: "#FAF9F6",
							foreground: "#0a0a0a",
						},
						content3: {
							DEFAULT: "#FAF9F6",
							foreground: "#0a0a0a",
						},
						content4: {
							DEFAULT: "#FAF9F6",
							foreground: "#0a0a0a",
						},
						background: {
							DEFAULT: "#FAF9F6",
							foreground: "#0a0a0a",
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
