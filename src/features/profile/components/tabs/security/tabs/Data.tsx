import { usePopup } from "@/features/ui/popup/hooks/usePopup";
import { Tooltip } from "@/features/ui/popovers/components/tooltip/Tooltip";
import { Button } from "@/features/ui/button/components/Button";
import { Checkbox } from "@/features/ui/checkbox/components/Checkbox";
import { Input } from "@/features/ui/input/components/Input";
import { Profile, User } from "@/types/tables/account";
import { promiseStatus } from "@/utils/other/status";
import { useAppStore } from "@/zustand/store";
import Image from "next/image";
import { redirect } from "next/navigation";
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
    const [fieldsEnabled, setFieldsEnabled] = useState<{
        password: boolean;
        username: boolean;
    }>({ password: false, username: false });

    const [password, setPassword] = useState<string>("");
    const [username, setUsername] = useState<string>(data.user.username);

    return (
        <form
            className="flex flex-col gap-4 grow"
            onSubmit={async (e) => {
                e.preventDefault();
                await updateUser({
                    id: data.user.id,
                    data: {
                        ...(fieldsEnabled.password && { password }),
                        ...(fieldsEnabled.username && { username }),
                    },
                });
                redirect("/profile");
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
                    <span>Username</span>
                    <small className="ml-auto text-ellipsis-left">
                        (a new username)
                    </small>
                </label>

                <div className="flex items-center gap-2">
                    <Checkbox
                        className="rounded-full! w-8! justify-center!"
                        onToggle={(e) =>
                            setFieldsEnabled((prev) => ({
                                ...prev,
                                username: e,
                            }))
                        }
                        value={fieldsEnabled.username}
                    />
                    <hr className="w-px! h-1/3 bg-background-a-10" />

                    <Input
                        id="username"
                        type="username"
                        isEnabled={fieldsEnabled.username}
                        value={username}
                        onChange={(e) => setUsername(e)}
                        placeholder="at least 6 characters"
                        minLength={6}
                        required
                    />
                </div>
            </div>

            <hr />

            <div className="flex flex-col gap-2">
                <label
                    htmlFor="password"
                    className="flex items-center gap-1"
                >
                    <Image
                        alt=""
                        width={16}
                        height={16}
                        src="/security.svg"
                    />
                    <span>Password</span>
                    <small className="ml-auto text-ellipsis-left">
                        (a new strong password)
                    </small>
                </label>

                <div className="flex gap-2 items-center">
                    <Checkbox
                        className="rounded-full! w-8! justify-center!"
                        onToggle={(e) =>
                            setFieldsEnabled((prev) => ({
                                ...prev,
                                password: e,
                            }))
                        }
                        value={fieldsEnabled.password}
                    />
                    <hr className="w-px! h-1/3 bg-background-a-10" />

                    <Input
                        id="password"
                        isEnabled={fieldsEnabled.password}
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e)}
                        placeholder="at least 6 characters"
                        minLength={6}
                        required
                    />
                </div>
            </div>

            <hr className="mt-auto -mb-2" />

            <Tooltip
                className="w-full"
                text="Change your password"
                isEnabled={Object.values(fieldsEnabled).some(Boolean)}
            >
                <Button
                    type="submit"
                    className="w-full"
                    isEnabled={Object.values(fieldsEnabled).some(Boolean)}
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
        </form>
    );
};
