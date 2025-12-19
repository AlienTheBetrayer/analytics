import { SessionStoreWatcher } from "@/zustand/SessionStoreWatcher";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

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
			<SessionStoreWatcher />
			<body
				className={`${geistSans.variable} ${geistMono.variable} overflow-hidden antialiased min-h-screen flex flex-col p-2 sm:p-4 relative`}
			>
				{children}
			</body>
		</html>
	);
}
