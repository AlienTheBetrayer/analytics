"use client";

import { ProfileImage } from "@/features/profile/components/ProfileImage";
import { Tooltip } from "@/features/tooltip/components/Tooltip";
import { LinkButton } from "@/features/ui/linkbutton/components/LinkButton";
import { Button } from "@/features/ui/button/components/Button";
import { useLocalStore } from "@/zustand/localStore";
import { AuthElements } from "./AuthElements";
import { LoadingToolbox } from "@/features/loading/components/LoadingToolbox";

export const AuthButton = () => {
    // zustand's localstore
    const visibleProfile = useLocalStore((state) => state.visibleProfile);

    return (
        <nav className="flex gap-1 items-center justify-center min-h-14 min-w-14">
            {visibleProfile ? (
                <Tooltip
                    text="Go to your profile"
                    direction="bottom"
                >
                    <LinkButton
                        href="/profile"
                        style={
                            visibleProfile.color
                                ? {
                                      outline: `1px solid ${visibleProfile.color}`,
                                  }
                                : {}
                        }
                        className="gap-2! p-0!"
                    >
                        <ProfileImage
                            profile={visibleProfile}
                            width={16}
                            height={16}
                            className="w-9 aspect-square"
                        />
                    </LinkButton>
                </Tooltip>
            ) : (
                <Tooltip text="Sign up / Log in">
                    <Tooltip
                        type="modal"
                        direction="left"
                        disabledPointer={false}
                        element={<AuthElements />}
                    >
                        <Button className="p-0!">
                            <LoadingToolbox />
                        </Button>
                    </Tooltip>
                </Tooltip>
            )}
        </nav>
    );
};
