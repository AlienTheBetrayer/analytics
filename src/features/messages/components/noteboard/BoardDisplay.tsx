import { LinkButton } from "@/features/ui/linkbutton/components/LinkButton";
import { CacheAPIProtocol } from "@/query-api/protocol";

type Props = {
    data: CacheAPIProtocol["noteboards"]["data"][number];
};

export const BoardDisplay = ({ data }: Props) => {
    return (
        <div className="box rounded-2xl!">
            <LinkButton href={`/messages/notes/board/${data.id}`}>
                {data.title}
            </LinkButton>
        </div>
    );
};
