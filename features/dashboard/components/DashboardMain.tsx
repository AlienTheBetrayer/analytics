import { Spinner } from "@/features/spinner/components/Spinner";
import { useSessionStore } from "@/zustand/sessionStore";
import { motion } from "motion/react";
import type { useData } from "../hooks/useData";
import { DashboardEvents } from "./events/DashboardEvents";
import { DashboardProjects } from "./projects/DashboardProjects";

type Props = {
	controller: ReturnType<typeof useData>;
};

export const DashboardMain = ({ controller }: Props) => {
	const isLoggedIn = useSessionStore((state) => state.isLoggedIn);

	return (
		<div className="w-full flex flex-col grow p-3">
			{controller.data !== null ? (
				controller.data.length > 0 ? (
					<motion.div
						className="flex flex-col gap-8"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
					>
						<DashboardProjects controller={controller} />
						<hr />
						<DashboardEvents controller={controller} />
					</motion.div>
				) : (
					<span className="m-auto">No projects connected.</span>
				)
			) : (
				<>
					<Spinner className="m-auto h-20! w-20!" />
					{isLoggedIn === false && (
						<span className="m-auto">Create an account to see the data.</span>
					)}
				</>
			)}
		</div>
	);
};
