import { Spinner } from "@/features/spinner/components/Spinner";
import { Button } from "@/features/ui/button/components/Button";
import { relativeTime } from "@/utils/relativeTime";
import { motion } from "motion/react";
import type { useSync } from "../hooks/useSync";

type Props = {
	controller: ReturnType<typeof useSync>;
};

export const DashboardMain = ({ controller }: Props) => {
	const projectData =
		controller.data === null
			? undefined
			: controller.data.find(
					(p) => p.project.id === controller.selectedProjectId,
				);

	return (
		<div className="w-full flex flex-col grow p-4">
			{controller.data !== null ? (
				controller.data.length > 0 ? (
					<motion.div
						className="flex flex-col gap-8"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
					>
						<div className="flex flex-col gap-4">
							<h3 className="text-center">Available projects</h3>
							<ul className="flex flex-col gap-2">
								{controller.data.map((v) => (
									<li key={v.project.id} className="w-full">
										<Button
											className="w-full"
											onClick={() =>
												controller.setSelectedProjectId(v.project.id)
											}
										>
											<span>{v.project.name}</span>
											<span className="ml-auto">
												attached {relativeTime(v.project.created_at)}
											</span>
										</Button>
									</li>
								))}
							</ul>
						</div>

						{controller.selectedProjectId !== null && (
							<>
								<hr />
								<div className="flex flex-col gap-4">
									<h3 className="text-center">Project events</h3>
									{projectData !== undefined ? (
										<ul className="flex flex-col gap-2">
											{projectData.metaData.map((metaDataEntry) => (
												<li key={metaDataEntry.id}>
													{metaDataEntry.type}
													{metaDataEntry.description}
												</li>
											))}
										</ul>
									) : (
										<span className="m-auto">No events so far...</span>
									)}
								</div>
							</>
						)}
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
