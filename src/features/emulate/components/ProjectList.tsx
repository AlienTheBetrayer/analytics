import Image from "next/image";
import { useParams } from "next/navigation";
import { LinkButton } from "@/features/ui/linkbutton/components/LinkButton";
import { relativeTime } from "@/utils/other/relativeTime";
import { Tooltip } from "@/features/tooltip/components/Tooltip";
import { useAppStore } from "@/zustand/store";

export const ProjectList = () => {
    // zustand state
    const projects = useAppStore((state) => state.projects);

    // url
    const { id } = useParams<{ id: string | undefined }>();

    return (
        <ul
            className="flex flex-col gap-2 max-h-64 overflow-y-auto scheme-dark"
            style={{
                scrollbarWidth: "thin",
            }}
        >
            {Object.values(projects).map((data) => (
                <li key={data.name}>
                    <Tooltip
                        className="w-full"
                        text={data.name}
                        direction="top"
                    >
                        <LinkButton
                            href={`/dashboard/emulate/${data.id}`}
                            className={`flex flex-row! w-full h-full box p-4!
                            ${data.id === id ? "border-blue-1!" : ""}`}
                        >
                            <Image
                                src="/cube.svg"
                                width={16}
                                height={16}
                                alt=""
                            />

                            <span>{data.name}</span>

                            <span className="ml-auto">
                                <small>
                                    updated {relativeTime(data.last_event_at)}
                                </small>
                            </span>
                        </LinkButton>
                    </Tooltip>
                </li>
            ))}
        </ul>
    );
};
