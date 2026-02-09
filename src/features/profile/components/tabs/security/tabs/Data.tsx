import { Tooltip } from "@/features/ui/popovers/components/tooltip/Tooltip";
import { Button } from "@/features/ui/button/components/Button";
import { Checkbox } from "@/features/ui/checkbox/components/Checkbox";
import { Input } from "@/features/ui/input/components/Input";
import Image from "next/image";
import { useState } from "react";
import { CacheAPIProtocol } from "@/query-api/protocol";
import { PromiseState } from "@/promises/components/PromiseState";
import { updateUser } from "@/query-api/calls/users";
import { wrapPromise } from "@/promises/core";
import { redirect } from "next/navigation";

type Props = {
    data: CacheAPIProtocol["user"]["data"];
};

export const Data = ({ data }: Props) => {
    // internal states
    const [fieldsEnabled, setFieldsEnabled] = useState<{
        password: boolean;
        username: boolean;
    }>({ password: false, username: false });

    const [password, setPassword] = useState<string>("");
    const [username, setUsername] = useState<string>(data.username);

    return (
        <form
            className="flex flex-col grow"
            onSubmit={async (e) => {
                e.preventDefault();
                await wrapPromise("updateUser", () => {
                    return updateUser({
                        id: data.id,
                        username: data.username,
                        data: {
                            ...(fieldsEnabled.password && { password }),
                            ...(fieldsEnabled.username && { username }),
                        },
                    });
                });
                if (username) {
                    redirect(`/profile/${username}`);
                }
            }}
        >
            <ul className="flex flex-col gap-8 grow">
                <li className="flex flex-col gap-2">
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
                </li>

                <li className="flex flex-col gap-2">
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
                </li>

                <li className="mt-auto! flex flex-col gap-2">
                    <Tooltip
                        className="w-full"
                        text="Change your password"
                        isEnabled={Object.values(fieldsEnabled).some(Boolean)}
                    >
                        <Button
                            type="submit"
                            className="w-full"
                            isEnabled={Object.values(fieldsEnabled).some(
                                Boolean,
                            )}
                        >
                            <PromiseState state="updateUser" />
                            <Image
                                src="/send.svg"
                                width={16}
                                height={16}
                                alt=""
                            />
                            Apply changes
                        </Button>
                    </Tooltip>
                </li>
            </ul>
        </form>
    );
};
