import { nextui } from "@nextui-org/react";

const config = {
    darkMode: ["class"],
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
        require("tailwindcss-animate")
    ],
    theme: {
    	extend: {
    		borderRadius: {
    			lg: 'var(--radius)',
    			md: 'calc(var(--radius) - 2px)',
    			sm: 'calc(var(--radius) - 4px)'
    		},
    		colors: {
    			background: 'hsl(var(--background))',
    			foreground: 'hsl(var(--foreground))',
    			card: {
    				DEFAULT: 'hsl(var(--card))',
    				foreground: 'hsl(var(--card-foreground))'
    			},
    			popover: {
    				DEFAULT: 'hsl(var(--popover))',
    				foreground: 'hsl(var(--popover-foreground))'
    			},
    			primary: {
    				DEFAULT: 'hsl(var(--primary))',
    				foreground: 'hsl(var(--primary-foreground))'
    			},
    			secondary: {
    				DEFAULT: 'hsl(var(--secondary))',
    				foreground: 'hsl(var(--secondary-foreground))'
    			},
    			muted: {
    				DEFAULT: 'hsl(var(--muted))',
    				foreground: 'hsl(var(--muted-foreground))'
    			},
    			accent: {
    				DEFAULT: 'hsl(var(--accent))',
    				foreground: 'hsl(var(--accent-foreground))'
    			},
    			destructive: {
    				DEFAULT: 'hsl(var(--destructive))',
    				foreground: 'hsl(var(--destructive-foreground))'
    			},
    			border: 'hsl(var(--border))',
    			input: 'hsl(var(--input))',
    			ring: 'hsl(var(--ring))',
    			chart: {
    				'1': 'hsl(var(--chart-1))',
    				'2': 'hsl(var(--chart-2))',
    				'3': 'hsl(var(--chart-3))',
    				'4': 'hsl(var(--chart-4))',
    				'5': 'hsl(var(--chart-5))'
    			}
    		}
    	}
    }
};
export default config;
