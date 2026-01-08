import { Profile, User } from "@/types/tables/account";
import { useParams } from "next/navigation";
import { Overview } from "../tabs/overview/Overview";
import { Edit } from "../tabs/edit/Edit";
import { Security } from "../tabs/security/Security";
import { Friends } from "../tabs/friends/Friends";

type Props = {
    data: { user: User; profile: Profile };
};

export const Content = ({ data }: Props) => {
    const { tab } = useParams<{ tab: string }>();

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
        default:
        case "overview": {
            return <Overview data={data} />;
        }
    }
};
