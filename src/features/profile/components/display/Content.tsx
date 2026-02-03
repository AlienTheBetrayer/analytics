import { useParams } from "next/navigation";
import { Overview } from "../tabs/overview/Overview";
import { Edit } from "../tabs/edit/Edit";
import { Security } from "../tabs/security/Security";
import { Friends } from "../tabs/friends/Friends";
import { CacheAPIProtocol } from "@/query-api/protocol";
import { useQuery } from "@/query/core";

type Props = {
    data: CacheAPIProtocol["user"]["data"];
};

export const Content = ({ data }: Props) => {
    const { data: status } = useQuery({ key: ["status"] });

    // url
    const { tab } = useParams<{ tab: string }>();

    if (status?.id === data.id || status?.role === "op") {
        switch (tab) {
            case "edit": {
                return <Edit data={data} />;
            }
            case "security": {
                return <Security data={data} />;
            }
            case "friends": {
                return <Friends data={data} />;
            }
            case "posts": {
            }
            default:
            case "overview": {
                return <Overview data={data} />;
            }
        }
    } else {
        switch (tab) {
            case "posts": {
            }
            default:
            case "overview": {
                return <Overview data={data} />;
            }
        }
    }
};
