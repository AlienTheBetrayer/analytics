import { useSecurity } from "@/features/profile/hooks/useSecurity";
import { Spinner } from "@/features/spinner/components/Spinner";
import { Tooltip } from "@/features/tooltip/components/Tooltip";
import { Button } from "@/features/ui/button/components/Button";
import { Input } from "@/features/ui/input/components/Input";
import { Profile, User } from "@/types/tables/account";
import { promiseStatus } from "@/utils/other/status";
import { useAppStore } from "@/zustand/store";
import Image from "next/image";
import { useState } from "react";
import { Sessions } from "./Sessions";

type Props = {
    data: { user: User; profile: Profile };
};
export const Form = ({ data }: Props) => {
    // zustand
    const promises = useAppStore((state) => state.promises);
    const updateUser = useAppStore((state) => state.updateUser);
    const getSessions = useAppStore((state) => state.getSessions);

    // internal states
    const [password, setPassword] = useState<string>("");

    // currently authenticated sessions + messageboxes
    const { currentSessions, terminateMessageBox } = useSecurity(data);

    return (
        <div className="flex flex-col gap-2">
            {terminateMessageBox.render()}

            <form
                className="flex flex-col gap-2"
                onSubmit={(e) => {
                    e.preventDefault();
                    updateUser({
                        id: data.user.id,
                        data: { password },
                    });
                }}
            >
                <label
                    htmlFor="bio"
                    className="flex items-center gap-1"
                >
                    <Image
                        alt=""
                        width={16}
                        height={16}
                        src="/security.svg"
                    />
                    <b>Password</b>
                    <small className="ml-auto text-ellipsis-left">
                        (a new strong password)
                    </small>
                </label>

                <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e)}
                    placeholder="at least 6 characters"
                    minLength={6}
                    required
                />

                <hr className="mt-auto" />

                <Tooltip
                    className="w-full"
                    text="Change your password"
                >
                    <Button
                        type="submit"
                        className="w-full"
                    >
                        {promiseStatus(promises.updateUser)}
                        <Image
                            src="/send.svg"
                            width={20}
                            height={20}
                            alt=""
                        />
                        Apply changes
                    </Button>
                </Tooltip>
            </form>

            <hr />
            <span className="flex items-center gap-2">
                <Image
                    alt=""
                    width={16}
                    height={16}
                    src="/auth.svg"
                />
                <b>Sessions</b>

                <Tooltip
                    text="Re-load visible sessions"
                    direction="top"
                    disabledPointer
                >
                    <Button
                        className="p-0!"
                        onClick={() => {
                            getSessions({
                                user_id: data.user.id,
                                caching: false,
                                promiseKey: "sessionsReload",
                            });
                        }}
                    >
                        {promises.sessionsReload === "pending" ? (
                            <Spinner />
                        ) : (
                            <Image
                                src="/reload.svg"
                                width={12}
                                height={12}
                                alt="refresh"
                            />
                        )}
                    </Button>
                </Tooltip>
                <small className="ml-auto text-ellipsis-left">
                    (all your logged in accounts)
                </small>
            </span>

            <Sessions
                data={data}
                currentSessions={currentSessions}
            />

            <hr className="mt-auto!" />
            <Tooltip
                text="Keep only this session logged in"
                direction="bottom"
                className="w-full"
                disabledPointer
            >
                <Button
                    className="w-full"
                    onClick={() => {
                        terminateMessageBox.show();
                    }}
                >
                    {promiseStatus(promises.terminateSessions)}
                    <Image
                        src="/auth.svg"
                        width={16}
                        height={16}
                        alt=""
                    />
                    Terminate other sessions
                </Button>
            </Tooltip>
        </div>
    );
};
