import { ProfileImage } from "../../ProfileImage";
import { Select } from "./Select";
import Image from "next/image";
import { CacheAPIProtocol } from "@/query-api/protocol";

type Props = {
    data: CacheAPIProtocol["user"]["data"];
};

export const Friends = ({ data }: Props) => {
    return (
        <div className="flex flex-col gap-4 w-full grow">
            <div className="flex flex-col gap-2 items-center">
                <div className="flex gap-1 items-center">
                    <Image
                        width={16}
                        height={16}
                        alt=""
                        src="/friends.svg"
                    />
                    <span className="text-foreground-2! text-5! flex">
                        <mark>{data.username}</mark>
                        &apos;s profile
                    </span>
                </div>
                <span>Friends & Friend requests</span>
            </div>

            <hr />

            <div className="grid lg:grid-cols-[30%_auto_1fr] gap-4 grow">
                <div className="flex flex-col items-center gap-2">
                    <span>{data.profile.name}</span>
                    <ProfileImage
                        profile={data.profile}
                        width={256}
                        height={256}
                    />
                </div>

                <hr className="sm:w-px! sm:h-full" />

                <Select data={data} />
            </div>
        </div>
    );
};
