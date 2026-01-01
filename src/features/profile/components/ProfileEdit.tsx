import Image from "next/image";
import { Menu } from "@/features/ui/menu/components/Menu";
import type { Profile } from "@/types/api/database/profiles";
import type { User } from "@/types/api/database/user";
import { Edit } from "./tabs/Edit";
import { Friends } from "./tabs/Friends";
import { Overview } from "./tabs/Overview";
import { Security } from "./tabs/Security";

type Props = {
    data: { profile: Profile; user: User };
    tab: string;
};

export const ProfileTabs = ["overview", "edit", "privacy", "security", "friends"];

export const ProfileEdit = ({ data, tab }: Props) => {
    const items = [
        {
            title: "overview",
            titleElement: (
                <div className="flex gap-1">
                    <Image width={20} height={20} alt="overview" src="/account.svg" />
                    <span className="hidden sm:block">Overview</span>
                </div>
            ),
            href: `/profile/${data.user.username}/overview`,
            element: <Overview data={data} />,
            tooltip: "The home page of your profile"
        },
        {
            title: "edit",
            titleElement: (
                <div className="flex gap-1">
                    <Image width={20} height={20} alt="edit" src="/pencil.svg" />
                    <span className="hidden sm:block">Edit</span>
                </div>
            ),
            href: `/profile/${data.user.username}/edit`,
            element: <Edit data={data} />,
            tooltip: "Edit the visible fields"
        },
        {
            title: "security",
            titleElement: (
                <div className="flex gap-1">
                    <Image width={20} height={20} alt="security" src="/privacy.svg" />
                    <span className="hidden sm:block">Security</span>
                </div>
            ),
            href: `/profile/${data.user.username}/security`,
            element: <Security data={data} />,
            tooltip: "Secure your account"
        },
        {
            title: "friends",
            titleElement: (
                <div className="flex gap-1">
                    <Image width={20} height={20} alt="friends" src="/friends.svg" />
                    <span className="hidden sm:block">Friends</span>
                </div>
            ),
            href: `/profile/${data.user.username}/friends`,
            element: <Friends data={data} />,
            tooltip: "See your friends and requests"
        },
    ];

    return (
        <Menu
            type="link"
            items={items}
            value={items.findIndex((item) => item.title === tab.toLowerCase())}
            color={data.profile.color}
        />
    );
};
