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
import { ProfileImage } from "../ProfileImage";
import { ProfileDisplay } from "../ProfileDisplay";

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
		<div className="flex flex-col gap-4 p-4 w-full">
			{unfriendMessageBox.render()}
			<div className="flex flex-col gap-2 items-center">
				<span className="text-center text-foreground-2! text-5!">
					<mark>{data.user.username}</mark>
					's profile
				</span>
				<span>Your friends</span>
			</div>

			<hr />
			<div className="flex flex-col md:flex-row gap-4 grow w-full">
				<div className="flex flex-col items-center gap-2 w-full md:max-w-96">
					<span>{data.profile.name}</span>
					<ProfileImage profile={data.profile} width={256} height={256} />
					<span className="text-foreground-5!">
						{data.user.role[0].toUpperCase() + data.user.role.substring(1)}
					</span>
				</div>
				<hr className="sm:w-px! sm:h-full" />

				<div className="flex flex-col gap-2 w-full">
					{status === undefined ? (
						<Spinner styles="big" />
					) : (
						<ul className="flex flex-col gap-2 w-full">
							<li className="flex flex-col gap-1 min-h-16">
								{/* friends topline */}
								<span className="flex flex-wrap gap-2 items-center">
									<b>Friend list</b>
									<Tooltip description="Re-load friends" direction="top">
										<Button
											className="p-0!"
											onClick={() => {
												getFriends(false);
												getFriendRequests(status.user.id, false);

												if (friendRequests) {
													if (friendRequests.incoming.length > 0) {
														getProfiles(
															friendRequests.incoming,
															false,
															"__reload_incoming_requests",
														);
													}

													if (friendRequests.outcoming.length > 0) {
														getProfiles(
															friendRequests.outcoming,
															false,
															"__reload_outcoming_requests",
														);
													}
												}

												if (friends && friends.length > 0) {
													getProfiles(friends, false, "__reload_friends");
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

								{/* friends list */}
								{promises.friends === "pending" ||
								promises.__reload_friends === "pending" ? (
									<Spinner className="mx-auto" />
								) : friends === undefined || friends.length === 0 ? (
									<span>
										<small>No friends</small>
									</span>
								) : (
									<ul
										className="flex flex-col gap-2 overflow-y-auto max-h-36 scheme-dark"
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
							</li>

							<li className="flex flex-col gap-1 min-h-16">
								{/* incoming requests topline */}
								<span className="flex flex-wrap gap-2 items-center">
									<b>Incoming requests</b>
									<small className="ml-auto">(your incoming requests)</small>
								</span>

								{/* incoming requests */}
								{promises.friend_requests === "pending" ||
								promises.__reload_incoming_requests === "pending" ? (
									<Spinner className="mx-auto" />
								) : friendRequests?.incoming === undefined ||
									friendRequests.incoming.length === 0 ? (
									<span>
										<small>No incoming requests</small>
									</span>
								) : (
									<ul
										className="flex flex-col gap-2 overflow-y-auto max-h-36 scheme-dark"
										style={{ scrollbarWidth: "thin" }}
									>
										{friendRequests.incoming.map((request) => (
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
								<hr />
							</li>

							<li className="flex flex-col gap-1 min-h-16">
								{/* outcoming requests topline */}
								<span className="flex flex-wrap gap-2 items-center">
									<b>Outcoming requests</b>
									<small className="ml-auto">(your outcoming requests)</small>
								</span>

								{/* outcoming requests */}
								{promises.friend_requests === "pending" ||
								promises.__reload_outcoming_requests === "pending" ? (
									<Spinner className="mx-auto" />
								) : friendRequests?.outcoming === undefined ||
									friendRequests.outcoming.length === 0 ? (
									<span>
										<small>No outcoming requests</small>
									</span>
								) : (
									<ul
										className="flex flex-col gap-2 overflow-y-auto max-h-36 scheme-dark"
										style={{ scrollbarWidth: "thin" }}
									>
										{friendRequests.outcoming.map((request) => (
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
								<hr />
							</li>
						</ul>
					)}

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
