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
import { Role } from "../../parts/Role";

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
                <span>Friends & Friend requests</span>
            </div>

            <hr />

            <div className="grid lg:grid-cols-[30%_auto_1fr] gap-4">
                <div className="flex flex-col items-center gap-2">
                    <span>{data.profile.name}</span>
                    <ProfileImage
                        profile={data.profile}
                        width={256}
                        height={256}
                    />
                    <Role data={data} />
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
                            src="/delete.svg"
                        />
                        Unfriend everyone
                    </Button>
                </div>
            </div>
        </div>
    );
};
