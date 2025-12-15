import { Tooltip } from "@/features/tooltip/components/Tooltip";
import { Button } from "@/features/ui/button/components/Button";
import { relativeTime } from "@/utils/relativeTime";
import Image from "next/image";
import "./DashboardProjects.css";

import linkImg from "../../../../public/link.svg";
import type { useData } from "../../hooks/useData";

type Props = {
	controller: ReturnType<typeof useData>;
};

export const DashboardProjects = ({ controller }: Props) => {
	return (
		controller.data !== null && (
			<div className="flex flex-col gap-4 relative">
				<h3 className="text-center">Available projects</h3>
				<ul className="flex flex-col gap-2">
					{controller.data.map((v) => (
						<Tooltip
							key={v.project.id}
							description={`View events`}
							title={v.project.name}
						>
							<li className="w-full">
								<Button
									className="w-full project-button"
									onClick={() => controller.setSelectedProjectId(v.project.id)}
								>
									<div className="flex items-center gap-1">
										<Image
											src={linkImg}
											alt=""
											className={`image h-3! w-3! ${controller.selectedProjectId === v.project.id ? "invert-100!" : ""}`}
										/>
										<span>{v.project.name}</span>
									</div>

									<span
										style={{
											opacity:
												controller.selectedProjectId === v.project.id ? 1 : 0.3,
										}}
										className={`transition-all duration-300`}
									>
										<small className="text-3xl!">{v.metaData.length}</small>
										<small> events</small>
									</span>

									<span
										style={{
											opacity:
												controller.selectedProjectId === v.project.id ? 1 : 0.3,
										}}
										className={`transition-all duration-300`}
									>
										<small className="text-3xl!">
											{v.aggregates.visits ?? 0}
										</small>
										<small> visits</small>
									</span>

									<span>
										connected {relativeTime(v.project.created_at)}
									</span>
								</Button>
							</li>
						</Tooltip>
					))}
				</ul>
			</div>
		)
	);
};
