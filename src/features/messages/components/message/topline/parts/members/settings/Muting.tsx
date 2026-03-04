import { MemberSettingsProps } from "@/features/messages/components/message/topline/parts/members/settings/MemberSettings";
import { Button } from "@/features/ui/button/components/Button";
import { Input } from "@/features/ui/input/components/Input";
import { Select } from "@/features/ui/select/components/Select";
import { PromiseState } from "@/promises/components/PromiseState";
import { wrapPromise } from "@/promises/core";
import { updateConversationMembers } from "@/query-api/calls/conversation_members";
import { useQuery } from "@/query/core";
import Image from "next/image";
import { useState } from "react";

export const MuteOptions = [
    "Seconds",
    "Minutes",
    "Hours",
    "Days",
    "Weeks",
    "Months",
] as const;

export const Muting = ({ data, conversationData }: MemberSettingsProps) => {
    const { data: status } = useQuery({ key: ["status"] });
    const [time, setTime] = useState<string>("");
    const [option, setOption] =
        useState<(typeof MuteOptions)[number]>("Minutes");

    return (
        <div className="box p-4! gap-4! items-center w-full acrylic">
            <span className="flex items-center gap-1">
                <div className="w-1 h-1 rounded-full bg-blue-1" />
                <Image
                    alt="mute"
                    width={16}
                    height={16}
                    src="/auth.svg"
                />
            </span>

            <form
                className="flex flex-col w-full"
                onSubmit={(e) => {
                    e.preventDefault();

                    if (!status) {
                        return;
                    }

                    wrapPromise("muteMember", () => {
                        return updateConversationMembers({
                            type: "mute",
                            time,
                            option,
                            conversation_id: conversationData.id,
                            user: status,
                            user_ids: [data.user_id],
                        });
                    });
                }}
            >
                <ul className="w-full *:w-full flex flex-col gap-2">
                    <li>
                        <Input
                            required
                            type="number"
                            placeholder="Time..."
                            value={time}
                            onChange={(value) => setTime(value)}
                        />
                    </li>

                    <li>
                        <Select
                            items={[...MuteOptions]}
                            value={option}
                            onChange={(item) =>
                                setOption(item as (typeof MuteOptions)[number])
                            }
                        />
                    </li>

                    <li>
                        <hr />
                    </li>

                    <li>
                        <Button
                            type="submit"
                            className="w-full"
                        >
                            <PromiseState state="muteMember" />
                            <Image
                                alt="mute"
                                width={16}
                                height={16}
                                src="/auth.svg"
                            />
                            Mute
                        </Button>
                    </li>
                </ul>
            </form>
        </div>
    );
};
