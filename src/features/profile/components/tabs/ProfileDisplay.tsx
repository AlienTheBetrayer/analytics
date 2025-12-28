import './ProfileDisplay.css';
import Image from "next/image";
import { LinkButton } from "@/features/ui/linkbutton/components/LinkButton";
import type { Profile } from "@/types/api/database/profiles";
import type { User } from "@/types/api/database/user";
import { relativeTime } from "@/utils/relativeTime";

type Props = {
	data: { profile: Profile; user: User };
};

export const ProfileDisplay = ({ data }: Props) => {
	return (
		<LinkButton
			href={`/profile/${data.user.username}`}
			className="flex justify-start p-2! gap-2 h-full"
			style={
				data.profile.color ? { borderColor: `${data.profile.color}` } : {}
			}
		>
			<div className="bg-blue-3 rounded-full h-10 aspect-square"></div>

			<hr className="w-px! h-full! border-background-5!" />

			<span className="flex flex-col gap-1">
				<small className="flex gap-1">
					<Image src="/type.svg" width={16} height={16} alt="" />
					Username
				</small>
				<b>{data.user.username}</b>
			</span>

			{data.profile.oneliner && (
				<span className="flex flex-col gap-1">
					<small className="flex gap-1">
						<Image src="/book.svg" width={16} height={16} alt="" />
						One-liner
					</small>
					{data.profile.oneliner}
				</span>
			)}

			<span className="flex flex-col ml-auto gap-1">
				<small className="flex gap-1">
					<Image src="/calendar.svg" width={16} height={16} alt="" />
					Last seen
				</small>
				{relativeTime(data.user.last_seen_at)}
			</span>
		</LinkButton>
	);
};
