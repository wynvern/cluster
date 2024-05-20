const nextConfig = {
	reactStrictMode: true,
	swcMinify: true,
	compiler: {
		removeConsole: process.env.NODE_ENV !== "development",
	},
	experimental: {
		serverActions: {
			bodySizeLimit: "10mb",
			allowedOrigins: [process.env.SERVER_HOSTNAME, "localhost:3000"],
		},
	},
	images: {
		remotePatterns: [
			{
				hostname: "lh3.googleusercontent.com",
				protocol: "https",
				port: "",
				pathname: "/**",
			},
			{
				hostname: "j9hcaotorwfwldub.public.blob.vercel-storage.com",
				protocol: "https",
				port: "",
				pathname: "/**",
			},
		],
	},
};

import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
	dest: "public",
	disable: true,
	register: true,
	skipWaiting: true,
});

export default withPWA(nextConfig);
