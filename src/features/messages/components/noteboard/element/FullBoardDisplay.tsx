import { NoBoard } from "@/features/messages/components/errors/NoBoard";
import { BoardInput } from "@/features/messages/components/noteboard/element/BoardInput";
import { Element } from "@/features/messages/components/noteboard/element/Element";
import { sortNotes } from "@/features/messages/utils/sort";
import { Button } from "@/features/ui/button/components/Button";
import { PromiseState } from "@/promises/components/PromiseState";
import { deleteNote, upsertNote } from "@/query-api/calls/notes";
import { CacheAPIProtocol } from "@/query-api/protocol";
import { NoteboardElement } from "@/types/tables/notes";
import { TabSelection } from "@/utils/other/TabSelection";
import Image from "next/image";
import { useMemo, useState } from "react";

type Props = {
    data?: CacheAPIProtocol["noteboards"]["data"][number] | null;
};

export const FullBoardDisplay = ({ data }: Props) => {
    // states
    const sorted = useMemo(() => {
        if (!data) {
            return [];
        }

        return sortNotes({ notes: data.elements });
    }, [data]);
    const [tab, setTab] = useState<"checked" | "unchecked">("unchecked");

    // fallbacks
    if (!data) {
        return <NoBoard />;
    }

    // splitting
    const { checked, unchecked } = sorted.reduce(
        (acc, val) => {
            if (val.checked) {
                acc.checked.push(val);
            } else {
                acc.unchecked.push(val);
            }

            return acc;
        },
        {
            checked: [] as NoteboardElement[],
            unchecked: [] as NoteboardElement[],
        },
    );

    // jsx
    return (
        <article className="box rounded-2xl! p-4! items-center! justify-start! not-hover:bg-bg-1! w-full">
            <div className="box h-10! p-0! w-full flex-row! items-center!">
                <span className="flex items-center gap-1 absolute left-1/2 top-1/2 -translate-1/2">
                    <div className="w-1 h-1 rounded-full bg-blue-1" />
                    <Image
                        alt=""
                        width={16}
                        height={16}
                        src="/cube.svg"
                    />
                    <span>{data.title}</span>
                    <PromiseState state="upsertNote" />
                </span>

                <Button
                    className="ml-auto!"
                    onClick={() => setTab("unchecked")}
                >
                    <Image
                        alt="todo"
                        width={16}
                        height={16}
                        src="/type.svg"
                    />
                    Planned
                    <small>({unchecked.length})</small>
                    <TabSelection condition={tab === "unchecked"} />
                </Button>

                <Button onClick={() => setTab("checked")}>
                    <Image
                        alt="todo"
                        width={16}
                        height={16}
                        src="/checkmark.svg"
                    />
                    Done
                    <small>({checked.length})</small>
                    <TabSelection condition={tab === "checked"} />
                </Button>
            </div>

            <ul className="flex flex-col gap-2 w-full grow">
                {(tab === "checked" ? checked : unchecked).map((e) => (
                    <li
                        key={e.id}
                        className="flex"
                    >
                        <Element
                            data={e}
                            onCheck={(flag) => {
                                upsertNote({
                                    type: "edit",
                                    noteboard_id: data.id,
                                    user_id: data.user_id,
                                    element_id: e.id,
                                    checked: flag,
                                });
                            }}
                            onEdit={(value) => {
                                upsertNote({
                                    type: "edit",
                                    noteboard_id: data.id,
                                    user_id: data.user_id,
                                    element_id: e.id,
                                    title: value,
                                });
                            }}
                            onPin={() => {
                                upsertNote({
                                    type: "edit",
                                    noteboard_id: data.id,
                                    user_id: data.user_id,
                                    element_id: e.id,
                                    pinned: !e.pinned,
                                });
                            }}
                            onDelete={() => {
                                deleteNote({
                                    noteboard_id: data.id,
                                    user_id: data.user_id,
                                    element_id: e.id,
                                });
                            }}
                        />
                    </li>
                ))}

                {tab === "unchecked" && (
                    <>
                        <li className="mt-auto!">
                            <hr />
                        </li>

                        <li className="flex w-full">
                            <BoardInput data={data} />
                        </li>
                    </>
                )}
            </ul>
        </article>
    );
};
