import { motion } from "motion/react";
import { Spinner } from "@/features/spinner/components/Spinner";
import type { useData } from "../hooks/useData";
import { DashboardEvents } from "./events/DashboardEvents";
import { DashboardProjects } from "./projects/DashboardProjects";

type Props = {
	controller: ReturnType<typeof useData>;
};

export const DashboardMain = ({ controller }: Props) => {
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
				<Spinner className="m-auto h-20! w-20!" />
			)}
		</div>
	);
};
