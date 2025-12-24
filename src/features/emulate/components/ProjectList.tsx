import Image from "next/image";
import { useState } from "react";
import { Button } from "@/features/ui/button/components/Button";
import type { Data } from "@/types/zustand/data";

type Props = {
	data: Data;
	id?: string;
};

export const ProjectList = ({ data, id }: Props) => {
	const [selectedId, setSelectedId] = useState<string | null>(id ?? null);

	return (
		<ul
			className="flex flex-col gap-2 max-h-64 overflow-y-auto scheme-dark"
			style={{
				scrollbarWidth: "thin",
			}}
		>
			{data !== null &&
				Object.values(data).map((projectData) => (
					<li key={projectData.project.name}>
						<Button
							className={`w-full h-full box hover:brightness-200 active:brightness-300 duration-300 rounded-full!
                            ${projectData.project.id === selectedId ? "border-blue-1!" : ""}`}
							onClick={() => {
								setSelectedId(projectData.project.id);
							}}
						>
							<Image src="/cube.svg" width={20} height={20} alt="" />
							<span>{projectData.project.name}</span>
						</Button>
					</li>
				))}
		</ul>
	);
};
