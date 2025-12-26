import type { Profile } from "@/types/api/database/profiles";
import type { User } from "@/types/api/database/user";

type Props = {
	data: { profile: Profile; user: User };
};

export const Overview = ({ data }: Props) => {
	return (
		<div className="flex flex-col gap-4 p-2 w-full grow">
			<div className="flex flex-col gap-2 items-center">
				<span className="text-foreground-2! text-5!">
					<mark>{data.user.username}</mark>
					's profile
				</span>
                <span>Profile overview</span>
			</div>

			<hr />
			<div className="flex flex-col gap-2 grow items-center justify-center min-w-0">
				<span>{data.profile.oneliner}</span>
				<div className="bg-blue-3 rounded-full w-full max-w-64 aspect-square"></div>
				<span className="text-foreground-5!">
					{data.user.role[0].toUpperCase() + data.user.role.substring(1)}
				</span>
				<span>{data.profile.bio}</span>
				<span>{data.profile.status}</span>
			</div>
		</div>
	);
};
