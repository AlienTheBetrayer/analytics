import { usePopup } from "@/features/popup/hooks/usePopup";
import { Tooltip } from "@/features/tooltip/components/Tooltip";
import { Button } from "@/features/ui/button/components/Button";
import { Input } from "@/features/ui/input/components/Input";
import { Profile, User } from "@/types/tables/account";
import { promiseStatus } from "@/utils/other/status";
import { useAppStore } from "@/zustand/store";
import Image from "next/image";
import { useState } from "react";

type Props = {
    data: { user: User; profile: Profile };
    terminateMessageBox: ReturnType<typeof usePopup>;
};

export const Data = ({ data, terminateMessageBox }: Props) => {
    // zusatnd
    const updateUser = useAppStore((state) => state.updateUser);
    const promises = useAppStore((state) => state.promises);

    // internal states
    const [password, setPassword] = useState<string>("");

    return (
        <form
            className="flex flex-col gap-4 grow"
            onSubmit={(e) => {
                e.preventDefault();
                updateUser({
                    id: data.user.id,
                    data: { password },
                });
            }}
        >
            {terminateMessageBox.render()}

            <div className="flex flex-col gap-2">
                <label
                    htmlFor="username"
                    className="flex items-center gap-1"
                >
                    <Image
                        alt=""
                        width={16}
                        height={16}
                        src="/pencil.svg"
                    />
                    <b>Username</b>
                    <small className="ml-auto text-ellipsis-left">
                        (a new username)
                    </small>
                </label>
                <Input
                    type="username"
                    value={password}
                    onChange={(e) => setPassword(e)}
                    placeholder="at least 6 characters"
                    minLength={6}
                    required
                />
            </div>

            <hr />

            <div className="flex flex-col gap-2">
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
            </div>

            <div className="flex flex-col gap-2 mt-auto">
                <hr />
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
                            width={16}
                            height={16}
                            alt=""
                        />
                        Apply changes
                    </Button>
                </Tooltip>
            </div>
        </form>
    );
};
