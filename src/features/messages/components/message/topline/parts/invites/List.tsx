/** @format */

import { NoInvitations } from "@/features/messages/components/errors/NoInvitations";
import { InviteDisplay } from "@/features/messages/components/message/topline/parts/invites/InviteDisplay";
import { useQuery } from "@/query/core";
import { useAppStore } from "@/zustand/store";

type Props = {
    onNavigate: () => void;
};

export const List = ({ onNavigate }: Props) => {
    // zustand
    const conversation = useAppStore((state) => state.conversation);

    // fetching
    const { data, isLoading } = useQuery({
        key: ["invitations", conversation?.id],
        revalidate: true,
    });

    // loading fallback
    if (isLoading) {
        return (
            <div className="flex flex-col gap-2 items-center grow">
                {Array.from({ length: 5 }, (_, k) => (
                    <div
                        className="w-full h-8 loading"
                        key={k}
                    />
                ))}
            </div>
        );
    }

    // empty fallback
    if (!data?.length) {
        return (
            <div className="flex items-center justify-center loading">
                <NoInvitations onNavigate={onNavigate} />
            </div>
        );
    }

    // jsx
    return (
        <ul
            className="flex flex-col items-center gap-2 max-h-64 overflow-y-auto scheme-dark"
            style={{
                scrollbarWidth: "thin",
            }}
        >
            {data.map((i) => (
                <li
                    key={i.id}
                    className="w-full"
                >
                    <InviteDisplay data={i} />
                </li>
            ))}
        </ul>
    );
};
