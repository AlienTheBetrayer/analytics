import Image from "next/image";
import { useParams } from "next/navigation";
import { LinkButton } from "@/features/ui/linkbutton/components/LinkButton";
import type { Data } from "@/types/zustand/data";
import { relativeTime } from "@/utils/relativeTime";

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
            {data !== undefined &&
                Object.values(data).map((projectData) => (
                    <li key={projectData.project.name}>
                        <LinkButton
                            href={`/dashboard/emulate/${projectData.project.id}`}
                            className={`flex flex-row! w-full h-full box p-4!
                            ${projectData.project.id === id ? "border-blue-1!" : ""}`}
                        >
                            <Image src="/cube.svg" width={16} height={16} alt="" />

                            <span>{projectData.project.name}</span>

                            <span className="ml-auto">
                                <small>
                                    updated {relativeTime(projectData.project.last_event_at)}
                                </small>
                            </span>
                        </LinkButton>
                    </li>
                ))}
        </ul>
    );
};
