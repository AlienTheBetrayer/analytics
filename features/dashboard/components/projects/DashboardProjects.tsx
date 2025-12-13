import { Button } from "@/features/ui/button/components/Button";
import { relativeTime } from "@/utils/relativeTime";
import type { useSync } from "../../hooks/useData";

type Props = {
	controller: ReturnType<typeof useSync>;
};

export const DashboardProjects = ({ controller }: Props) => {
	return (
		controller.data !== null && (
			<div className="flex flex-col gap-4">
				<h3 className="text-center">Available projects</h3>
				<ul className="flex flex-col gap-2">
					{controller.data.map((v) => (
						<li key={v.project.id} className="w-full">
							<Button
								className="w-full"
								onClick={() => controller.setSelectedProjectId(v.project.id)}
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
		)
	);
};
