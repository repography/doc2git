/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	eslint: {
		dirs: [
			"src/__tests__",
			"src/components",
			"src/contexts",
			"src/lib",
			"src/mocks",
			"src/pages",
			"src/steps",
		],
	},
	images: {
		unoptimized: true,
	},
}

module.exports = nextConfig
