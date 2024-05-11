const nextConfig = {
	reactStrictMode: true,
	swcMinify: true,
	compiler: {
		removeConsole: process.env.NODE_ENV !== "development",
	},
	experimental: {
		serverActions: {
			bodySizeLimit: "10mb",
			allowedOrigins: [process.env.NEXTAUTH_URL],
		},
	},
};

import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
	dest: "public",
	disable: process.env.NODE_ENV === "development",
	register: true,
	skipWaiting: true,
});

export default withPWA(nextConfig);
