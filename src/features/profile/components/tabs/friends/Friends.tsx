import Image from "next/image";
import { Button } from "@/features/ui/button/components/Button";
import { Profile, User } from "@/types/tables/account";
import { promiseStatus } from "@/utils/other/status";
import { useAppStore } from "@/zustand/store";
import { ProfileImage } from "../../ProfileImage";
import { FriendList } from "./FriendList";
import { IncomingList } from "./IncomingList";
import { OutcomingList } from "./OutcomingList";
import { useFriends } from "@/features/profile/hooks/useFriends";

type Props = {
    data: { profile: Profile; user: User };
};

export const Friends = ({ data }: Props) => {
    // zustand
    const promises = useAppStore((state) => state.promises);

    // friends + their profiles fetching + message box
    const { unfriendMessageBox } = useFriends(data);

    return (
        <div className="flex flex-col gap-4 p-8 w-full">
            {unfriendMessageBox.render()}

            <div className="flex flex-col gap-2 items-center">
                <span className="text-center text-foreground-2! text-5!">
                    <mark>{data.user.username}</mark>
                    &apos;s profile
                </span>
                <span>Your friends</span>
            </div>

            <hr />
            
            <div className="flex flex-col md:flex-row gap-4 grow w-full">
                <div className="flex flex-col items-center gap-2 w-full md:max-w-96">
                    <span>{data.profile.name}</span>
                    <ProfileImage
                        profile={data.profile}
                        width={256}
                        height={256}
                    />
                    <div className="flex items-center gap-1">
                        <Image
                            width={20}
                            height={20}
                            alt=""
                            src="/privacy.svg"
                        />
                        <span className="text-foreground-5!">
                            {data.user.role &&
                                data.user.role[0].toUpperCase() +
                                    data.user.role.substring(1)}
                        </span>
                    </div>
                </div>

                <hr className="sm:w-px! sm:h-full" />

                <div className="flex flex-col gap-2 w-full">
                    <ul className="flex flex-col gap-2 w-full">
                        <FriendList data={data} />
                        <IncomingList data={data} />
                        <OutcomingList data={data} />
                    </ul>

                    <hr className="mt-auto" />
                    <Button
                        onClick={() => {
                            unfriendMessageBox.show();
                        }}
                    >
                        {promiseStatus(promises.unfriendAll)}
                        <Image
                            width={16}
                            height={16}
                            alt=""
                            src="/cross.svg"
                        />
                        Unfriend everyone
                    </Button>
                </div>
            </div>
        </div>
    );
};
