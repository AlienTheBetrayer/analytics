import Image from "next/image";
import { useParams } from "next/navigation";
import { LinkButton } from "@/features/ui/linkbutton/components/LinkButton";
import type { Data } from "@/types/zustand/data";

type Props = {
	data: Data;
};

export const ProjectList = ({ data }: Props) => {
	// url
	const { id } = useParams<{ id: string | undefined }>();

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
						<LinkButton
							href={`/emulate/${projectData.project.id}`}
							className={`flex flex-row! w-full h-full box hover:brightness-200 active:brightness-300 duration-300 rounded-full!
                            ${projectData.project.id === id ? "border-blue-1!" : ""}`}
						>
							<Image src="/cube.svg" width={20} height={20} alt="" />
							<span>{projectData.project.name}</span>
						</LinkButton>
					</li>
				))}
		</ul>
	);
};
