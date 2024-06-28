const nextConfig = {
	reactStrictMode: true,
	swcMinify: true,
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
				hostname: "localhost",
				protocol: "http",
				port: "3001",
				pathname: "/**",
			},
		],
	},
};

export default nextConfig;
