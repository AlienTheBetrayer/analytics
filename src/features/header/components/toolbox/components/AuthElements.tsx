import { Button } from "@/features/ui/button/components/Button";
import { Checkbox } from "@/features/ui/checkbox/components/Checkbox";
import { LinkButton } from "@/features/ui/linkbutton/components/LinkButton";
import { PromiseState } from "@/promises/components/PromiseState";
import { wrapPromise } from "@/promises/core";
import { applicationLogout } from "@/query-api/calls/auth";
import { useQuery } from "@/query/core";
import Image from "next/image";
import { useState } from "react";

export const AuthElements = () => {
    // status
    const { data: status } = useQuery({ key: ["status"] });

    // button disability
    const [logoutEnabled, setLogoutEnabled] = useState<boolean>(false);

    return (
        <div className="relative box gap-4! acrylic h-full w-full">
            <div className="flex flex-col gap-1 items-center">
                <div className="relative flex gap-1">
                    <Image
                        width={16}
                        height={16}
                        alt=""
                        src="/server.svg"
                    />
                    <span>Authentication</span>
                </div>
                <p>This will unlock many features and pages</p>
            </div>

            <hr />

            <ul className="flex flex-col gap-2">
                <li>
                    <LinkButton
                        href="/signup"
                        className="w-full"
                    >
                        <Image
                            alt=""
                            width={16}
                            height={16}
                            src="/pencil.svg"
                        />
                        Sign up
                    </LinkButton>
                </li>

                <li>
                    <LinkButton
                        href="/login"
                        className="w-full"
                    >
                        <Image
                            alt=""
                            width={16}
                            height={16}
                            src="/security.svg"
                        />
                        Log in
                    </LinkButton>
                </li>

                {status && (
                    <li className="flex items-center gap-1">
                        <Checkbox
                            className="w-fit!"
                            value={logoutEnabled}
                            onToggle={setLogoutEnabled}
                        />

                        <Button
                            className="w-full"
                            onClick={() => {
                                wrapPromise("logout", () => {
                                    return applicationLogout();
                                });
                            }}
                            isEnabled={logoutEnabled}
                        >
                            <PromiseState state="logout" />
                            <Image
                                alt=""
                                width={16}
                                height={16}
                                src="/delete.svg"
                            />
                            <u>Log out</u>
                        </Button>
                    </li>
                )}
            </ul>
        </div>
    );
};
