import { Element } from "@/features/messages/components/noteboard/compact/Element";
import { LinkButton } from "@/features/ui/linkbutton/components/LinkButton";
import { CacheAPIProtocol } from "@/query-api/protocol";
import { useLocalStore } from "@/zustand/localStore";
import Image from "next/image";
import { useMemo } from "react";

type Props = {
    data: CacheAPIProtocol["noteboards"]["data"][number];
};

export const BoardDisplay = ({ data }: Props) => {
    const display = useLocalStore((state) => state.display)?.messages?.noteboard
        ?.view;
    const isCompact = display === "compact";

    // splitting data
    const elements = useMemo(() => {
        const checked = [];
        const unchecked = [];

        for (const element of data.elements) {
            if (!element.checked && unchecked.length < 3) {
                unchecked.push(element);
            }

            if (element.checked && checked.length < 1) {
                checked.push(element);
            }
        }

        return { checked, unchecked };
    }, [data]);

    return (
        <LinkButton
            className={`box px-4! gap-2! items-center! not-hover:bg-bg-1! w-full max-w-64
                ${isCompact ? "flex-row! max-w-full rounded-[3rem]! py-2!" : "rounded-2xl! py-4!"}`}
            href={`/messages/notes/board/${data.id}`}
        >
            <span className="flex items-center gap-1 shrink-0">
                <div className="w-1 h-1 rounded-full bg-blue-1" />
                <Image
                    alt=""
                    width={16}
                    height={16}
                    src="/cube.svg"
                />
                <span>{data.title}</span>
            </span>

            <ul
                className={`flex flex-col gap-2 items-center w-full 
                    ${isCompact ? "flex-row!" : ""}`}
            >
                {elements.unchecked.map((e) => (
                    <li
                        key={e.id}
                        className="w-full"
                    >
                        <Element data={e} />
                    </li>
                ))}
            </ul>

            {!isCompact && <hr />}

            <ul
                className={`flex flex-col gap-2 items-center w-full
                    ${isCompact ? "flex-row!" : ""}`}
            >
                {elements.checked.map((e) => (
                    <li
                        key={e.id}
                        className="w-full"
                    >
                        <Element data={e} />
                    </li>
                ))}
            </ul>
        </LinkButton>
    );
};
