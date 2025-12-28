import { Menu } from "@/features/ui/menu/components/Menu";
import type { Profile } from "@/types/api/database/profiles";
import type { User } from "@/types/api/database/user";
import { Edit } from "./tabs/Edit";
import { Friends } from "./tabs/Friends";
import { Overview } from "./tabs/Overview";
import { Privacy } from "./tabs/Privacy";
import { Security } from "./tabs/Security";

type Props = {
	data: { profile: Profile; user: User };
	tab: string;
};

export const ProfileTabs = [
	"overview",
	"edit",
	"privacy",
	"security",
	"friends",
];

export const ProfileEdit = ({ data, tab }: Props) => {
	const items = [
		{
			title: "Overview",
			href: `/profile/${data.user.username}/overview`,
			element: <Overview data={data} />,
		},
		{
			title: "Edit",
			href: `/profile/${data.user.username}/edit`,
			element: <Edit data={data} />,
		},
		{
			title: "Privacy",
			href: `/profile/${data.user.username}/privacy`,
			element: <Privacy data={data} />,
		},
		{
			title: "Security",
			href: `/profile/${data.user.username}/security`,
			element: <Security data={data} />,
		},
		{
			title: "Friends",
			href: `/profile/${data.user.username}/friends`,
			element: <Friends data={data} />,
		},
	];

	return (
		<Menu
			type="link"
			items={items}
			value={items.findIndex(
				(item) => item.title.toLowerCase() === tab.toLowerCase(),
			)}
            color={data.profile.color}
		/>
	);
};
