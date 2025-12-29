import Image from "next/image";
import { useState } from "react";
import { Button } from "@/features/ui/button/components/Button";
import { Select } from "@/features/ui/select/components/Select";
import type {
	Profile,
	ProfileAllowedFriendRequests,
	ProfileVisibility,
} from "@/types/api/database/profiles";
import type { User } from "@/types/api/database/user";
import { promiseStatus } from "@/utils/status";
import { useAppStore } from "@/zustand/store";
import { ProfileImage } from "../ProfileImage";

type Props = {
	data: { profile: Profile; user: User };
};

export const Privacy = ({ data }: Props) => {
	// zustand state
	const promises = useAppStore((state) => state.promises);

	// zustand functions
	const setProfileData = useAppStore((state) => state.setProfileData);

	// input states
	const [visibility, setVisibility] = useState<ProfileVisibility>(
		data.profile.visibility,
	);
	const [allowedFriendRequests, setAllowedFriendRequests] =
		useState<ProfileAllowedFriendRequests>(
			data.profile.allowed_friend_requests,
		);

	return (
		<div className="flex flex-col gap-4 p-2 w-full">
			<div className="flex flex-col gap-2 items-center">
				<span className="text-center text-foreground-2! text-5!">
					<mark>{data.user.username}</mark>
					's profile
				</span>
				<span>Account's Privacy</span>
			</div>

			<hr />
			<div className="flex flex-col sm:flex-row gap-4 grow w-full">
				<div className="flex flex-col items-center gap-2 w-full sm:max-w-64">
					<span>{data.profile.name}</span>
					<ProfileImage profile={data.profile} width={192} height={192} />
					<span className="text-foreground-5!">
						{data.user.role[0].toUpperCase() + data.user.role.substring(1)}
					</span>
				</div>
				<hr className="sm:w-px! sm:h-full" />
				<form
					className="flex flex-col gap-2 w-full"
					onSubmit={(e) => {
						e.preventDefault();
						setProfileData(data.user, {
							visibility,
							allowed_friend_requests: allowedFriendRequests,
						});
					}}
				>
					<label
						htmlFor="visibility"
						className="flex justify-between items-center"
					>
						<b>Profile's Visibility</b>
						<small> (who can see your profile?)</small>
					</label>
					<Select
						id="visibility"
						items={["everyone", "friends", "nobody"]}
						value={visibility}
						onChange={(e) => setVisibility(e as ProfileVisibility)}
					/>
					<hr />

					<label
						htmlFor="requests"
						className="flex justify-between items-center"
					>
						<b>Allowed friend requests</b>
						<small> (can someone send you a friend request?)</small>
					</label>
					<Select
						id="requests"
						items={["everyone", "nobody"]}
						value={allowedFriendRequests}
						onChange={(e) =>
							setAllowedFriendRequests(e as ProfileAllowedFriendRequests)
						}
					/>
					<hr />

					<hr className="mt-auto" />
					<Button type="submit">
						{promiseStatus(promises.profile_set)}
						<Image src="/send.svg" width={20} height={20} alt="" />
						Apply changes
					</Button>
				</form>
			</div>
		</div>
	);
};
