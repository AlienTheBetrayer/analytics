import { CacheAPIProtocol } from "@/query-api/protocol"

type Props = {
    data: CacheAPIProtocol["invitations"]["data"][number];
}

export const InviteDisplay = ({ data }: Props) => {
    return (
        <div className="box p-4!">
            {data.description}
        </div>
    )
}