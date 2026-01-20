import { Tooltip } from "@/features/ui/popovers/components/tooltip/Tooltip";
import { Button } from "@/features/ui/button/components/Button";
import { Select } from "@/features/ui/select/components/Select";
import { AuthenticationRole } from "@/types/auth/authentication";
import { Profile, User } from "@/types/tables/account";
import { useAppStore } from "@/zustand/store";
import Image from "next/image";
import { useState } from "react";
import { PromiseStatus } from "@/features/ui/promisestatus/components/PromiseStatus";
import { CloseButton } from "@/features/ui/closebutton/components/CloseButton";

type Props = {
    data: { profile: Profile; user: User };
    hide: () => void;
};

export const RoleEditing = ({ data, hide }: Props) => {
    // zustand states
    const promises = useAppStore((state) => state.promises);

    // zustand functions
    const updateUser = useAppStore((state) => state.updateUser);

    // react states
    const [role, setRole] = useState<AuthenticationRole>(
        data.user.role ?? "user",
    );

    return (
        <ul className="relative box h-full gap-4! min-h-80">
            <CloseButton hide={hide} />

            <li className="flex flex-col gap-1 items-center text-center">
                <div className="relative flex gap-1">
                    <Image
                        width={16}
                        height={16}
                        alt=""
                        src="/cube.svg"
                    />
                    <span>{data.user.username}</span>
                </div>

                <span className="text-5!">Role editing</span>

                <p>
                    Since you have full permissions, you can <u>edit</u> this
                    user&apos;s roles!
                </p>
            </li>

            <li>
                <hr />
            </li>

            <li className="flex flex-col gap-2">
                <label
                    className="flex items-center gap-1"
                    htmlFor="role-select"
                >
                    <span>Role</span>
                    <small className="ml-auto text-ellipsis-left">
                        (different roles have different permissions)
                    </small>
                </label>

                <Select
                    id="role-select"
                    items={["user", "admin", "op"]}
                    value={role}
                    onChange={(e) => setRole(e as AuthenticationRole)}
                />
            </li>

            <li className="mt-auto!">
                <hr />
            </li>

            <li>
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
                        <PromiseStatus status={promises.updateUser} />
                        <Image
                            width={20}
                            height={20}
                            alt=""
                            src="/send.svg"
                        />
                        Apply changes
                    </Button>
                </Tooltip>
            </li>
        </ul>
    );
};
