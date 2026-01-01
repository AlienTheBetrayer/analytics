"use client";

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
            <nav className="flex gap-1 items-center justify-center min-h-14 min-w-14">
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
                            className="gap-2! p-0.5!"
                        >
                            <ProfileImage
                                profile={visibleProfile}
                                width={16}
                                height={16}
                                className="w-8 aspect-square"
                            />
                        </LinkButton>
                    </Tooltip>
                ) : (
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
                )}
            </nav>
        </div>
    );
};
