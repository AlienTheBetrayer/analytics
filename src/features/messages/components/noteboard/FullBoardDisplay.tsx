import { NoBoard } from "@/features/messages/components/errors/NoBoard";
import { BoardInput } from "@/features/messages/components/noteboard/BoardInput";
import { Element } from "@/features/messages/components/noteboard/Element";
import { PromiseState } from "@/promises/components/PromiseState";
import { deleteNote, upsertNote } from "@/query-api/calls/notes";
import { CacheAPIProtocol } from "@/query-api/protocol";

type Props = {
    data?: CacheAPIProtocol["noteboards"]["data"][number] | null;
};

export const FullBoardDisplay = ({ data }: Props) => {
    // fallbacks
    if (!data) {
        return <NoBoard />;
    }

    // jsx
    return (
        <article className="box rounded-2xl! p-4! items-center! justify-start! not-hover:bg-bg-1! w-full h-fit!">
            <span className="flex items-center gap-1">
                <div className="w-1 h-1 rounded-full bg-blue-1" />
                <span>{data.title}</span>
                <PromiseState state="upsertNote" />
            </span>

            <ul className="flex flex-col gap-2 w-full">
                {data.elements.map((e) => (
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

                <li className="mt-4!">
                    <hr />
                </li>

                <li className="flex w-full">
                    <BoardInput data={data} />
                </li>
            </ul>
        </article>
    );
};
