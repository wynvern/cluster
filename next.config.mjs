const nextConfig = {
	reactStrictMode: true,

	// That truly works, but i need to make all pages public
	async headers() {
		return [
			{
				source: "/",
				headers: [
					{
						key: "Cache-Control",
						value: "public",
					},
				],
			},
		];
	},
	swcMinify: true,
	experimental: {
		serverActions: {
			bodySizeLimit: "10mb",
			allowedOrigins: [
				process.env.SERVER_HOSTNAME,
				"localhost:3000",
				process.env.SOCKET_URL,
			],
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
			{
				hostname: process.env.SERVER_HOSTNAME,
				protocol: "https",
				port: "",
				pathname: "/**",
			},
			{
				hostname: "firebasestorage.googleapis.com",
				protocol: "https",
				port: "",
				pathname: "/**",
			},
		],
	},
};

export default nextConfig;
