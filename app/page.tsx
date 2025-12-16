"use client";

import { Meteors } from "@/features/aceternity/meteors/meteors";
import { Dashboard } from "@/features/dashboard/components/Dashboard";
import { DashboardProvider } from "@/features/dashboard/context/DashboardContext";
import { NotificationProvider } from "@/features/dashboard/context/NotificationContext";

export const Home = () => {
	return (
		<NotificationProvider>
			<DashboardProvider>
				<main className="relative w-full min-h-screen overflow-hidden flex flex-col">
					<Dashboard className="m-auto z-2" />
					<div className="absolute inset-0 pointer-events-none">
						<Meteors />
					</div>
				</main>
			</DashboardProvider>
		</NotificationProvider>
	);
};

export default Home;
