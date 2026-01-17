import { Profile, User } from "@/types/tables/account";
import { useParams } from "next/navigation";
import { Overview } from "../tabs/overview/Overview";
import { Edit } from "../tabs/edit/Edit";
import { Security } from "../tabs/security/Security";
import { Friends } from "../tabs/friends/Friends";
import { useAppStore } from "@/zustand/store";

type Props = {
    data: { user: User; profile: Profile };
};

export const Content = ({ data }: Props) => {
    // zustand
    const status = useAppStore((state) => state.status);

    // url
    const { tab } = useParams<{ tab: string }>();

    if (status?.id === data.user.id || status?.role === "op") {
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
