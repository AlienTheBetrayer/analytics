import { Tooltip } from "@/features/ui/popovers/components/tooltip/Tooltip";
import { Button } from "@/features/ui/button/components/Button";
import { Select } from "@/features/ui/select/components/Select";
import { AuthenticationRole } from "@/types/auth/authentication";
import { Profile, User } from "@/types/tables/account";
import { promiseStatus } from "@/utils/other/status";
import { useAppStore } from "@/zustand/store";
import Image from "next/image";
import { useState } from "react";

type Props = {
    data: { profile: Profile; user: User };
};

export const RoleEditing = ({ data }: Props) => {
    // zustand states
    const promises = useAppStore((state) => state.promises);

    // zustand functions
    const updateUser = useAppStore((state) => state.updateUser);

    // react states
    const [role, setRole] = useState<AuthenticationRole>(
        data.user.role ?? "user",
    );

    return (
        <div className="box h-full min-h-80">
            <div className="flex flex-col gap-4 h-full">
                <div className="flex flex-col gap-1 items-center">
                    <div className="relative flex gap-1">
                        <Image
                            width={16}
                            height={16}
                            alt=""
                            src="/cube.svg"
                        />
                        <span>{data.user.username}</span>
                    </div>

                    <span className="text-5! text-foreground-5!">
                        Role editing
                    </span>

                    <p>
                        Since you have full permissions, you can <u>edit</u>{" "}
                        this user&apos;s roles!
                    </p>
                </div>

                <hr />

                <div className="flex flex-col gap-2">
                    <label
                        htmlFor="role-select"
                        className="flex flex-wrap"
                    >
                        <span>Role</span>
                        <small className="ml-auto">
                            (different roles have different permissions)
                        </small>
                    </label>

                    <Select
                        id="role-select"
                        items={["user", "admin", "op"]}
                        value={role}
                        onChange={(e) => setRole(e as AuthenticationRole)}
                    />
                </div>

                <hr className="mt-auto" />

                <Tooltip
                    text="Change this user's role"
                    className="w-full"
                >
                    <Button
                        className="w-full"
                        onClick={() => {
                            updateUser({ id: data.user.id, data: { role } });
                        }}
                    >
                        {promiseStatus(promises.updateUser)}
                        <Image
                            width={20}
                            height={20}
                            alt=""
                            src="/send.svg"
                        />
                        Apply changes
                    </Button>
                </Tooltip>
            </div>
        </div>
    );
};
