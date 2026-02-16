import { NoBoard } from "@/features/messages/components/errors/NoBoard";
import { BoardInput } from "@/features/messages/components/noteboard/BoardInput";
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
            </span>

            <ul className="flex flex-col gap-2 w-full">
                {data.elements.map((e) => (
                    <li key={e.id}>{e.title}</li>
                ))}

                <li className="flex w-full">
                    <BoardInput />
                </li>
            </ul>
        </article>
    );
};
