import { Spinner } from "@/features/spinner/components/Spinner";
import { Button } from "@/features/ui/button/components/Button";
import { relativeTime } from "@/utils/relativeTime";
import { motion } from "motion/react";
import type { useSync } from "../hooks/useSync";

type Props = {
	controller: ReturnType<typeof useSync>;
};

export const DashboardMain = ({ controller }: Props) => {
	return (
		<div className="w-full flex flex-col grow p-4">
			{controller.data !== null ? (
				controller.data.projects.length > 0 ? (
					<motion.div
						className="flex flex-col gap-4"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
					>
						<h3 className="text-center">Available projects</h3>
						<ul className="flex flex-col gap-2">
							{controller.data.projects.map((v) => (
								<li key={v.id} className="w-full">
									<Button className="w-full">
										<span>{v.name}</span>
										<span className="ml-auto">
											attached {relativeTime(v.created_at)}
										</span>
									</Button>
								</li>
							))}
						</ul>
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
