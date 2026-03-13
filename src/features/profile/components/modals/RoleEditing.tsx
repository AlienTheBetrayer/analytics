import { Tooltip } from "@/features/ui/popovers/components/tooltip/Tooltip";
import { Button } from "@/features/ui/button/components/Button";
import { Select } from "@/features/ui/select/components/Select";
import { AuthenticationRole } from "@/types/auth/authentication";
import Image from "next/image";
import { useState } from "react";
import { CacheAPIProtocol } from "@/query-api/protocol";
import { wrapPromise } from "@/promises/core";
import { PromiseState } from "@/promises/components/PromiseState";
import { updateUser } from "@/query-api/calls/users";

type Props = {
    data: CacheAPIProtocol["user"]["data"];
};

export const RoleEditing = ({ data }: Props) => {
    // react states
    const [role, setRole] = useState<AuthenticationRole>(data.role ?? "user");

    return (
        <ul className="relative box h-full gap-4! acrylic w-full">
            <li className="flex flex-col gap-1 items-center text-center">
                <div className="relative flex flex-col gap-1 items-center">
                    <span className="flex items-center">
                        <div className="w-1 h-1 rounded-full bg-blue-1" />
                        <Image
                            width={16}
                            height={16}
                            alt=""
                            src="/cube.svg"
                        />
                    </span>
                    <span>{data.username}</span>
                </div>
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
                    <small className="ml-auto truncate-left">(different roles have different permissions)</small>
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
                            wrapPromise("updateUser", () => {
                                return updateUser({
                                    id: data.id,
                                    username: data.username,
                                    data: { role },
                                });
                            });
                        }}
                    >
                        <PromiseState state="updateUser" />
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
