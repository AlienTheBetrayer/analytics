import Image from "next/image";
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
			title: "overview",
			titleElement: (
				<div className="flex gap-1">
					<Image width={20} height={20} alt="overview" src="/account.svg" />
					<span className="hidden sm:block">Overview</span>
				</div>
			),
			href: `/profile/${data.user.username}/overview`,
			element: <Overview data={data} />,
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
		},
		{
			title: "privacy",
			titleElement: (
				<div className="flex gap-1">
					<Image width={20} height={20} alt="privacy" src="/privacy.svg" />
					<span className="hidden sm:block">Privacy</span>
				</div>
			),
			href: `/profile/${data.user.username}/privacy`,
			element: <Privacy data={data} />,
		},
		{
			title: "security",
			titleElement: (
				<div className="flex gap-1">
					<Image width={20} height={20} alt="security" src="/security.svg" />
					<span className="hidden sm:block">Security</span>
				</div>
			),
			href: `/profile/${data.user.username}/security`,
			element: <Security data={data} />,
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
