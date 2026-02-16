import { LinkButton } from "@/features/ui/linkbutton/components/LinkButton";
import { CacheAPIProtocol } from "@/query-api/protocol";

type Props = {
    data: CacheAPIProtocol["noteboards"]["data"][number];
};

export const BoardDisplay = ({ data }: Props) => {
    return (
        <LinkButton
            className="box rounded-2xl! p-4! items-center! not-hover:bg-bg-1! w-screen! max-w-64!"
            href={`/messages/notes/board/${data.id}`}
        >
            <span className="flex items-center gap-1">
                <div className="w-1 h-1 rounded-full bg-blue-1" />
                <span>{data.title}</span>
            </span>
        </LinkButton>
    );
};
