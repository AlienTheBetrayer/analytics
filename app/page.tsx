"use client";

import { Dashboard } from "@/features/dashboard/components/Dashboard";
import { DashboardProvider } from "@/features/dashboard/context/DashboardContext";

export const Home = () => {
	return (
		<DashboardProvider>
			<main className="w-full min-h-screen overflow-hidden flex flex-col">
				<Dashboard className="m-auto" />
			</main>
		</DashboardProvider>
	);
};

export default Home;
