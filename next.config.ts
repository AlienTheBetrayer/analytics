import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	/* config options here */
	allowedDevOrigins: ['http://localhost:3000'],
    images: {
        remotePatterns: [
        {
            protocol: "https",
            hostname: "ehpiajjcfgmzanjvaaek.supabase.co",
            port: "",        
            pathname: "/storage/v1/object/public/**",
        },
        ],
    },
};

export default nextConfig;
