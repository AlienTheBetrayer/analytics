"use client";

import { Dashboard } from "@/features/dashboard/components/Dashboard";

export const Home = () => {
	return (
		<main className="w-full h-full min-h-screen flex flex-col">
			<Dashboard className="m-auto" />
		</main>
	);
};

export default Home;
