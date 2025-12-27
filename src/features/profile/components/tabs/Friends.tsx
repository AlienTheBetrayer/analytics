import { MessageBox } from "@/features/messagebox/components/MessageBox";
import { usePopup } from "@/features/popup/hooks/usePopup";
import { Button } from "@/features/ui/button/components/Button";
import type { Profile } from "@/types/api/database/profiles";
import type { User } from "@/types/api/database/user";
import { useAppStore } from "@/zustand/store";

type Props = {
	data: { profile: Profile; user: User };
};

export const Friends = ({ data }: Props) => {
	// zustand states
	const friends = useAppStore((state) => state.friends);
	const profiles = useAppStore((state) => state.profiles);

    // messageboxes
    const unfriendMessageBox = usePopup(<MessageBox description="You are about to unfriend everyone!" onInteract={res => {
        unfriendMessageBox.hide();
        if(res === 'yes') {

        }
    }}/>);
    return (
		<div className="flex flex-col gap-4 p-2 w-full">
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
					{friends === undefined || friends.length === 0 ? (
						<span>Currently your friend list is empty.</span>
					) : (
						<>
							<span>
								<b>Friends</b>
							</span>
							<ul className="flex flex-col gap-2">
                                {friends.map(friend => (
                                    <li key={friend}>
                                        {profiles?.[friend].profile.name}
                                    </li>
                                ))}
                            </ul>
						</>
					)}

					<hr className='mt-auto'/>
                    <Button onClick={() => {
                        unfriendMessageBox.show();
                    }}>
                        Unfriend everyone
                    </Button>
				</div>
			</div>
		</div>
	);
};
