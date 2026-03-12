import Image from "next/image";
import { useParams } from "next/navigation";
import { LinkButton } from "@/features/ui/linkbutton/components/LinkButton";
import { relativeTime } from "@/utils/other/relativeTime";
import { Tooltip } from "@/features/ui/popovers/components/tooltip/Tooltip";
import { CacheAPIProtocol } from "@/query-api/protocol";

type Props = {
    data: CacheAPIProtocol["projects"]["data"];
};

export const ProjectList = ({ data }: Props) => {
    // url
    const { id } = useParams<{ id: string | undefined }>();

    return (
        <ul
            className="box grow bg-bg-2! p-4! border-0! min-h-32 max-h-96 overflow-y-auto scheme-dark"
            style={{
                scrollbarWidth: "thin",
            }}
        >
            {Object.values(data).map((project) => (
                <li key={project.name}>
                    <Tooltip
                        className="w-full"
                        text={project.name}
                        direction="top"
                    >
                        <LinkButton
                            href={`/emulate/${project.id !== id ? project.id : ""}`}
                            className={`flex flex-row! w-full h-full box p-4! not-hover:bg-bg-1!
                            ${project.id === id ? "border-blue-1!" : ""}`}
                        >
                            <Image
                                src="/cube.svg"
                                width={16}
                                height={16}
                                alt=""
                            />

                            <span>{project.name}</span>

                            <small className="ml-auto truncate-left">
                                updated {relativeTime(project.last_event_at)}
                            </small>
                        </LinkButton>
                    </Tooltip>
                </li>
            ))}

            <li>
                <LinkButton
                    href="/emulate/"
                    className={`flex flex-row! w-full h-full box p-4! not-hover:bg-bg-1!
                            ${!id ? "border-blue-1!" : ""}
                            `}
                >
                    <div className="w-1 h-1 rounded-full bg-orange-1" />
                    <Image
                        src="/cubeadd.svg"
                        width={16}
                        height={16}
                        alt=""
                    />
                    <span>Synthetic project</span>
                </LinkButton>
            </li>
        </ul>
    );
};
