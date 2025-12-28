import Image from "next/image";
import { MessageBox } from "@/features/messagebox/components/MessageBox";
import { usePopup } from "@/features/popup/hooks/usePopup";
import { Spinner } from "@/features/spinner/components/Spinner";
import { Tooltip } from "@/features/tooltip/components/Tooltip";
import { Button } from "@/features/ui/button/components/Button";
import type { Profile } from "@/types/api/database/profiles";
import type { User } from "@/types/api/database/user";
import { promiseStatus } from "@/utils/status";
import { useAppStore } from "@/zustand/store";
import { ProfileDisplay } from "./ProfileDisplay";

type Props = {
	data: { profile: Profile; user: User };
};

export const Friends = ({ data }: Props) => {
	// zustand states
	const friends = useAppStore((state) => state.friends);
	const profiles = useAppStore((state) => state.profiles);
	const status = useAppStore((state) => state.status);
	const promises = useAppStore((state) => state.promises);
	const friendRequests = useAppStore((state) => state.friendRequests);

	// zustand functions
	const unfriendEveryone = useAppStore((state) => state.unfriendEveryone);
	const getProfiles = useAppStore((state) => state.getProfiles);
	const getFriendRequests = useAppStore((state) => state.getFriendRequests);
	const getFriends = useAppStore((state) => state.getFriends);

	// messageboxes
	const unfriendMessageBox = usePopup(
		<MessageBox
			description="You are about to unfriend everyone!"
			onInteract={(res) => {
				unfriendMessageBox.hide();
				if (res === "yes" && status) {
					unfriendEveryone(status.user.id);
				}
			}}
		/>,
	);

	return (
		<div className="flex flex-col gap-4 p-2 w-full">
			{unfriendMessageBox.render()}
			<div className="flex flex-col gap-2 items-center">
				<span className="text-center text-foreground-2! text-5!">
					<mark>{data.user.username}</mark>
					's profile
				</span>
				<span>Your friends</span>
			</div>

			<hr />
			<div className="flex flex-col sm:flex-row gap-4 grow w-full">
				<div className="flex flex-col items-center gap-2 sm:w-80">
					<span>{data.profile.name}</span>
					<div className="bg-blue-3 rounded-full h-48 aspect-square" />
					<span className="text-foreground-5!">
						{data.user.role[0].toUpperCase() + data.user.role.substring(1)}
					</span>
				</div>
				<hr className="sm:w-px! sm:h-full" />

				<div className="flex flex-col gap-2 w-full">
					{status === undefined ? (
						<Spinner styles="big" />
					) : (
						<>
							<span className="flex flex-wrap gap-2 items-center">
								<b>Friend list</b>
								<Tooltip description="Re-load friends" direction="top">
									<Button
										className="p-0!"
										onClick={() => {
											getFriends(false);
											if (friends && friends.length > 0) {
												getProfiles(friends, false, "RELOADFRIENDS");
											}
										}}
									>
										<Image
											src="/reload.svg"
											width={16}
											height={16}
											alt="refresh"
										/>
									</Button>
								</Tooltip>
								<small className="ml-auto">
									(all of your friends are here)
								</small>
							</span>
							{promises.friends === "pending" ||
							promises.RELOADFRIENDS === "pending" ? (
								<Spinner className="mx-auto" />
							) : friends === undefined || friends.length === 0 ? (
								<span>No friends</span>
							) : (
								<ul
									className="flex flex-col gap-2 overflow-y-auto max-h-24 scheme-dark"
									style={{ scrollbarWidth: "thin" }}
								>
									{friends.map((friend) => (
										<li key={friend}>
											{profiles?.[friend] === undefined ? (
												<Spinner />
											) : (
												<ProfileDisplay data={profiles[friend]} />
											)}
										</li>
									))}
								</ul>
							)}
							<hr />

							<span className="flex flex-wrap gap-2 items-center">
								<b>Outcoming requests</b>
								<Tooltip description="Re-load requests" direction="top">
									<Button
										className="p-0!"
										onClick={() => {
											getFriendRequests(status.user.id, false);

											if (
												friendRequests &&
												friendRequests[status.user.id]?.length > 0
											) {
												getProfiles(
													friendRequests[status.user.id],
													false,
													"RELOADREQUESTS",
												);
											}
										}}
									>
										<Image
											src="/reload.svg"
											width={16}
											height={16}
											alt="refresh"
										/>
									</Button>
								</Tooltip>
								<small className="ml-auto">(your outcoming requests)</small>
							</span>

							{promises.friend_requests === "pending" ||
							promises.RELOADREQUESTS === "pending" ? (
								<Spinner className="mx-auto" />
							) : friendRequests?.[status.user.id] === undefined ? (
								<span>No outcoming requests</span>
							) : (
								<ul
									className="flex flex-col gap-2 overflow-y-auto max-h-24 scheme-dark"
									style={{ scrollbarWidth: "thin" }}
								>
									{friendRequests[status.user.id].map((request) => (
										<li key={request}>
											{profiles?.[request] === undefined ? (
												<Spinner />
											) : (
												<ProfileDisplay data={profiles[request]} />
											)}
										</li>
									))}
								</ul>
							)}
						</>
					)}
					<hr />

					<hr className="mt-auto" />
					<Button
						onClick={() => {
							unfriendMessageBox.show();
						}}
					>
						{promiseStatus(promises.unfriend_everyone)}
						<Image width={16} height={16} alt="" src="/cross.svg" />
						Unfriend everyone
					</Button>
				</div>
			</div>
		</div>
	);
};
