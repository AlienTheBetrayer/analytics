/** @format */

import { NoNotes } from "@/features/messages/components/errors/NoNotes";
import { Element } from "@/features/messages/components/noteboard/compact/Element";
import { Button } from "@/features/ui/button/components/Button";
import { LinkButton } from "@/features/ui/linkbutton/components/LinkButton";
import { Tooltip } from "@/features/ui/popovers/components/tooltip/Tooltip";
import { upsertNoteboard } from "@/query-api/calls/notes";
import { CacheAPIProtocol } from "@/query-api/protocol";
import { useLocalStore } from "@/zustand/localStore";
import Image from "next/image";
import { useMemo } from "react";

type Props = {
    noteboard: CacheAPIProtocol["noteboards"]["data"][number];
};

export const BoardDisplay = ({ noteboard }: Props) => {
    const display = useLocalStore((state) => state.display)?.messages?.noteboard?.view;
    const isCompact = display === "compact";

    // splitting data
    const elements = useMemo(() => {
        const checked = [];
        const unchecked = [];

        for (const element of noteboard.elements) {
            if (!element.checked && unchecked.length < 3) {
                unchecked.push(element);
            }

            if (element.checked && checked.length < 1) {
                checked.push(element);
            }
        }

        return { checked, unchecked };
    }, [noteboard]);

    return (
        <div
            className={`flex relative w-full transition-all duration-500
        ${isCompact ? "max-w-full" : ""}`}
        >
            <Tooltip
                direction="top"
                text={noteboard.pinned ? "Unpin" : "Pin"}
                className="absolute! right-2 top-2"
            >
                <Button
                    className="z-2 p-0! rounded-md! w-6! h-6! min-w-6! min-h-6!"
                    onClick={() => {
                        upsertNoteboard({
                            type: "edit",
                            noteboard_id: noteboard.id,
                            pinned: !noteboard.pinned,
                        });
                    }}
                >
                    <Image
                        alt=""
                        width={12}
                        height={12}
                        src="/pin.svg"
                        className={noteboard.pinned ? "" : "opacity-30"}
                    />
                </Button>
            </Tooltip>

            <LinkButton
                className={`box px-4! gap-2! items-center! not-hover:bg-bg-1! w-full justify-start!
                ${isCompact ? "flex-row! rounded-[3rem]! py-2! h-12!" : "rounded-2xl! py-4! h-70!"}`}
                href={`/messages/notes/board/${noteboard.id}`}
            >
                <span className="flex flex-col items-center gap-1 shrink-0">
                    <span className="flex items-center gap-1">
                        <div className="w-1 h-1 rounded-full bg-blue-1" />
                        <Image
                            alt=""
                            width={16}
                            height={16}
                            src="/cube.svg"
                        />
                        <span className={`truncate ${isCompact ? "max-w-16" : "max-w-36"}`}>{noteboard.title}</span>
                    </span>

                    {noteboard.description && !isCompact && (
                        <p className="text-center">
                            <small>{noteboard.description}</small>
                        </p>
                    )}
                </span>

                {!isCompact && <hr />}

                {elements.checked.length || elements.unchecked.length ?
                    <>
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
                    </>
                : isCompact ?
                    <span className="mx-auto!">
                        No notes <u>yet</u>
                    </span>
                :   <NoNotes />}
            </LinkButton>
        </div>
    );
};
