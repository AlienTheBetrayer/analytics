import { StoreInitialHandler } from "@/src/zustand/StoreInitialHandler";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Meteors } from "../features/aceternity/meteors/meteors";
import { Header } from "../features/header/components/Header";
import { AuthenticationToolbox } from "../features/authentication/components/AuthenticationToolbox";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "Analytics",
	description: "Analytics service to collect metadata.",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<StoreInitialHandler />

			<body
				className={`${geistSans.variable} ${geistMono.variable} dotted antialiased overflow-x-hidden min-h-screen flex flex-col relative`}
			>   
                <Header/>
                <AuthenticationToolbox/>
                
                <div className="absolute inset-0 pointer-events-none">
                    <Meteors />
                </div>

				{children}
			</body>
		</html>
	);
}
