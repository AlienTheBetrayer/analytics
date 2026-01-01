"use client";

import Image from "next/image";
import { ProfileImage } from "@/features/profile/components/ProfileImage";
import { Tooltip } from "@/features/tooltip/components/Tooltip";
import { LinkButton } from "@/features/ui/linkbutton/components/LinkButton";
import { Spinner } from "../../spinner/components/Spinner";
import { Button } from "@/features/ui/button/components/Button";
import { ToolboxElements } from "./ToolboxElements";
import { useLocalStore } from "@/zustand/localStore";

export const AuthenticationToolbox = () => {
    // zustand's localstore
    const visibleProfile = useLocalStore((state) => state.visibleProfile);

    return (
        <div
            className={`hidden sm:flex items-center justify-center gap-2 min-h-8 min-w-8
                ml-auto z-2
                bg-background-a-5 backdrop-blur-3xl rounded-full
                ${!visibleProfile ? "border-awaiting" : ""}`}
        >
            {!visibleProfile ? (
                <Tooltip
                    type="modal"
                    direction="left"
                    disabledPointer={false}
                    element={<ToolboxElements />}
                >
                    <Button>
                        <Spinner />
                    </Button>
                </Tooltip>
            ) : (
                <nav className="flex gap-1 items-center p-2 h-full">
                    {visibleProfile ? (
                        <Tooltip text="Go to your profile" direction="left">
                            <LinkButton
                                href="/profile"
                                style={
                                    visibleProfile.color
                                        ? {
                                              outline: `1px solid ${visibleProfile.color}`,
                                          }
                                        : {}
                                }
                                className="gap-2!"
                            >
                                <ProfileImage
                                    profile={visibleProfile}
                                    width={16}
                                    height={16}
                                    className="w-6 aspect-square"
                                />
                                {visibleProfile.username ?? "Account"}
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
