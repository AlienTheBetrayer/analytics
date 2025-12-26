import { Menu } from "@/features/ui/menu/components/Menu";
import type { Profile } from "@/types/api/database/profiles";
import type { User } from "@/types/api/database/user";
import { Edit } from "./tabs/Edit";
import { Overview } from "./tabs/Overview";
import { Privacy } from "./tabs/Privacy";
import { Security } from "./tabs/Security";

type Props = {
	data: { profile: Profile; user: User };
};

export const ProfileEdit = ({ data }: Props) => {
	return (
		<Menu
			items={[
				{ title: "Overview", element: <Overview data={data} /> },
				{ title: "Edit", element: <Edit data={data} /> },
				{ title: "Privacy", element: <Privacy data={data} /> },
				{ title: "Security", element: <Security data={data} /> },
			]}
		/>
	);
};
