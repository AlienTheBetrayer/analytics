import { ProfileDisplay } from "@/features/profile/components/ProfileDisplay";
import { CacheAPIProtocol } from "@/query-api/protocol";
import { useQuery } from "@/query/core";
import Image from "next/image";

type Props = {
    data: CacheAPIProtocol["user"]["data"];
    fetchKey: "friends" | "requests_incoming" | "requests_outcoming";
};

export const FriendsTab = ({ data, fetchKey }: Props) => {
    // fetching
    const { data: tabData, isLoading } = useQuery({
        key: [fetchKey, data.id],
    });

    if (isLoading) {
        return (
            <div className="flex flex-col gap-2 grow">
                {Array.from({ length: 4 }, (_, k) => (
                    <li
                        key={k}
                        className="w-full loading h-12"
                    />
                ))}
            </div>
        );
    }

    if (!tabData) {
        return null;
    }

    if (tabData && !tabData.length) {
        return (
            <div className="relative flex flex-col gap-2">
                {Array.from({ length: 4 }, (_, k) => (
                    <li
                        key={k}
                        className="w-full loading h-12"
                    />
                ))}

                <span className="flex items-center gap-1 absolute left-1/2 top-1/2 -translate-1/2">
                    <Image
                        alt=""
                        width={16}
                        height={16}
                        src="/cross.svg"
                    />
                    <Image
                        alt=""
                        width={16}
                        height={16}
                        src={
                            fetchKey === "friends"
                                ? "/friends.svg"
                                : "/auth.svg"
                        }
                    />
                    <span>
                        {fetchKey === "friends" ? "Friends" : "Requests"} are{" "}
                        <u>absent</u>
                    </span>
                </span>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-2 grow">
            <ul
                className="flex flex-col gap-2 overflow-y-auto max-h-128 scheme-dark"
                style={{ scrollbarWidth: "thin" }}
            >
                {tabData?.map((id) => (
                    <li key={id}>
                        <ProfileDisplay id={id} />
                    </li>
                ))}
            </ul>
        </div>
    );
};
