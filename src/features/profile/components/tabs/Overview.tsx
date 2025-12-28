import Image from "next/image";
import { useMemo } from "react";
import { MessageBox } from "@/features/messagebox/components/MessageBox";
import { usePopup } from "@/features/popup/hooks/usePopup";
import { Button } from "@/features/ui/button/components/Button";
import { LinkButton } from "@/features/ui/linkbutton/components/LinkButton";
import type { Profile } from "@/types/api/database/profiles";
import type { User } from "@/types/api/database/user";
import { promiseStatus } from "@/utils/status";
import { useAppStore } from "@/zustand/store";

type Props = {
	data: { profile: Profile; user: User };
};

export const Overview = ({ data }: Props) => {
	// zustand
	const status = useAppStore((state) => state.status);
	const friendRequests = useAppStore((state) => state.friendRequests);
	const friends = useAppStore((state) => state.friends);
	const promises = useAppStore((state) => state.promises);

	// zustand functinos
	const sendFriendRequest = useAppStore((state) => state.sendFriendRequest);
	const unfriend = useAppStore((state) => state.unfriend);
	const deleteFriendRequest = useAppStore((state) => state.deleteFriendRequest);

	// message boxes
	const unfriendMessageBox = usePopup(
		<MessageBox
			description="You are about to delete this user from your friends!"
			onInteract={(res) => {
				unfriendMessageBox.hide();
				if (res === "yes" && status) {
					unfriend(status.user.id, data.user.id);
				}
			}}
		/>,
	);

	// ui states
	const hasOutcomingRequest = useMemo(() => {
		if (status === undefined) return false;
		return friendRequests?.outcoming.some((id) => id === data.user.id);
	}, [friendRequests, status, data]);

	const hasIncomingRequest = useMemo(() => {
		if (status === undefined) return false;
		return friendRequests?.incoming.some((id) => id === data.user.id);
	}, [friendRequests, status, data]);

	return (
		<div className="flex flex-col gap-4 p-2 w-full grow relative">
			{unfriendMessageBox.render()}

			<div className="flex flex-col gap-2 items-center">
				<div className="flex w-full relative">
					<span className="text-foreground-2! text-5! text-center w-full">
						<mark>{data.user.username}</mark>
						's profile
					</span>
					{status && status.user.id !== data.user.id && (
						<LinkButton
							href={`/profile/${status.user.username}/friends`}
							className="absolute right-0 top-0"
						>
							<Image width={16} height={16} alt="" src="/friends.svg" />
							Back
						</LinkButton>
					)}
				</div>
				<span>Profile overview</span>
			</div>

			<hr />
			<div className="flex flex-col gap-2 grow items-center justify-center min-w-0">
				<span>{data.profile.name}</span>
				<span>{data.profile.oneliner}</span>
				<div className="bg-blue-3 rounded-full w-full max-w-64 aspect-square"></div>
				<span className="text-foreground-5!">
					{data.user.role[0].toUpperCase() + data.user.role.substring(1)}
				</span>
				<span>{data.profile.bio}</span>
				<span>{data.profile.status}</span>
				{status &&
					status.user.id !== data.user.id &&
					data.profile.allowed_friend_requests === "everyone" &&
					(friends?.some((id) => id === data.user.id) ? (
						<Button
							onClick={() => {
								unfriendMessageBox.show();
							}}
						>
							{promiseStatus(promises.unfriend)}
							<Image src="/cross.svg" width={16} height={16} alt="unfriend" />
							Unfriend
						</Button>
					) : hasIncomingRequest ? (
						<div className="flex gap-1">
							<Button
								onClick={() => {
									sendFriendRequest(status.user.id, data.user.id);
								}}
							>
								{promiseStatus(promises.friend_request)}
								<Image
									src="/checkmark.svg"
									width={16}
									height={16}
									alt="accept"
								/>
								Accept
							</Button>
							<Button
								onClick={() => {
									deleteFriendRequest(status.user.id, data.user.id);
								}}
							>
								{promiseStatus(promises.delete_friend_request)}
								<Image src="/cross.svg" width={16} height={16} alt="reject" />
								Reject
							</Button>
						</div>
					) : hasOutcomingRequest ? (
						<div className="flex gap-1">
							<Button isEnabled={false}>
								{promiseStatus(promises.friend_request)}
								<Image src="/friends.svg" width={16} height={16} alt="sent" />
								Sent
							</Button>
							<Button
								onClick={() => {
									deleteFriendRequest(status.user.id, data.user.id);
								}}
							>
								{promiseStatus(promises.delete_friend_request)}
								<Image src="/auth.svg" width={16} height={16} alt="reject" />
								Cancel
							</Button>
						</div>
					) : (
						<Button
							onClick={() => {
								sendFriendRequest(status.user.id, data.user.id);
							}}
						>
							{promiseStatus(promises.friend_request)}
							<Image src="/plus.svg" width={16} height={16} alt="send" />
							Send
						</Button>
					))}
			</div>
		</div>
	);
};
