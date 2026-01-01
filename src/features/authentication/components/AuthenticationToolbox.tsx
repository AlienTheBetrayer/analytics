"use client";

import Image from "next/image";
import { ProfileImage } from "@/features/profile/components/ProfileImage";
import { Tooltip } from "@/features/tooltip/components/Tooltip";
import { LinkButton } from "@/features/ui/linkbutton/components/LinkButton";
import { useAppStore } from "@/zustand/store";
import { Spinner } from "../../spinner/components/Spinner";
import { Button } from "@/features/ui/button/components/Button";
import { ToolboxElements } from "./ToolboxElements";

export const AuthenticationToolbox = () => {
    // zustand
    const status = useAppStore((state) => state.status);
    const profiles = useAppStore((state) => state.profiles);

    // ui states
    const loggedProfile = status ? profiles?.[status.id] : undefined;

    return (
        <div
            className={`hidden sm:flex items-center justify-center gap-2 min-h-8 min-w-8
                ml-auto z-2
                bg-background-a-5 backdrop-blur-3xl rounded-full
                ${!status ? "border-awaiting" : ""}`}
        >
            {!status || (status && !profiles?.[status.id]) ? (
                <Tooltip
                    type="modal"
                    direction='left'
                    disabledPointer={false}
                    element={<ToolboxElements />}
                >
                    <Button>
                        <Spinner />
                    </Button>
                </Tooltip>
            ) : (
                <nav className="flex gap-1 items-center p-2 h-full">
                    {status ? (
                        <Tooltip text="Go to your profile" direction="left">
                            <LinkButton
                                href="/profile"
                                style={
                                    loggedProfile?.profile.color
                                        ? {
                                              outline: `1px solid ${loggedProfile?.profile.color}`,
                                          }
                                        : {}
                                }
                                className="gap-2!"
                            >
                                {status && profiles?.[status.id] && (
                                    <ProfileImage
                                        profile={profiles[status.id].profile}
                                        width={16}
                                        height={16}
                                        className="w-6 aspect-square"
                                    />
                                )}
                                {loggedProfile?.user.username ?? "Account"}
                            </LinkButton>
                        </Tooltip>
                    ) : (
                        <>
                            <LinkButton href="/signup">
                                <Image
                                    width={16}
                                    height={16}
                                    alt=""
                                    src="/plus.svg"
                                />
                                Sign up
                            </LinkButton>
                            
                            <LinkButton href="/login">
                                <Image
                                    width={16}
                                    height={16}
                                    alt=""
                                    src="/auth.svg"
                                />
                                Log in
                            </LinkButton>
                        </>
                    )}
                </nav>
            )}
        </div>
    );
};
