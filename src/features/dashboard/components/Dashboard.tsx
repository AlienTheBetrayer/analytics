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
			className="w-full border-0! max-w-4xl m-auto h-full 
        lg:hover:scale-105 duration-300 ease-out mt-8 sm:mt-0 box"
		>
			<Topline />
			<hr />

			{status?.isLoggedIn === true ? (
				<div className="grid grid-flow-row lg:grid-flow-col lg:grid-cols-2 gap-4">
					<DashboardProjects />
					<DashboardEvents />
				</div>
			) : (
				<div className="m-auto flex flex-col items-center justify-center">
					<span>Authentication is required to see data.</span>
					<Spinner styles="big" />
				</div>
			)}
		</div>
	);
};
