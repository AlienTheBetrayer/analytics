import { NoBoard } from "@/features/messages/components/errors/NoBoard";
import { LinkButton } from "@/features/ui/linkbutton/components/LinkButton";
import { CacheAPIProtocol } from "@/query-api/protocol";

type Props = {
    data?: CacheAPIProtocol["noteboards"]["data"][number] | null;
};

export const FullBoardDisplay = ({ data }: Props) => {
    if (!data) {
        return <NoBoard />;
    }

    return (
        <div className="box rounded-2xl!">
            <LinkButton href={`/messages/notes/board/${data.id}`}>
                {data.title}
            </LinkButton>
        </div>
    );
};
