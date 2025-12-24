"use client";
import { useAppStore } from "@/zustand/store";
import { Spinner } from "../../spinner/components/Spinner";
import { useData } from "../hooks/useData";
import { DashboardEvents } from "./events/DashboardEvents";
import { DashboardProjects } from "./projects/DashboardProjects";
import { Topline } from "./Topline";

export const Dashboard = () => {
	// zustand
	const status = useAppStore((state) => state.status);

	// helper hook to initialize zustand's requests
	useData();

	return (
		<div
			className="flex flex-col w-full max-w-4xl m-auto h-full 
        bg-linear-to-b from-background-a-3 to-background-a-1 backdrop-blur-xs rounded-xl gap-2 p-4
        sm:hover:scale-105 duration-300"
		>
			<Topline />
			<hr />

			{status?.isLoggedIn === true ? (
				<>
					<DashboardProjects />
					<hr />
					<DashboardEvents />
				</>
			) : (
				<div className="m-auto flex flex-col items-center justify-center">
					<span>Authentication is required to see data.</span>
					<Spinner styles="big" />
				</div>
			)}
		</div>
	);
};
