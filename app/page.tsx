"use client";

import { Dashboard } from "@/features/dashboard/components/Dashboard";
import { DashboardProvider } from "@/features/dashboard/context/DashboardContext";

export const Home = () => {
	return (
		<DashboardProvider>
			<main className="w-full h-full min-h-screen flex flex-col">
				<Dashboard className="m-auto" />
			</main>
		</DashboardProvider>
	);
};

export default Home;
