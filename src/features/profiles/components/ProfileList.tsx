"use client";

import { useEffect, useState } from "react";
import { Spinner } from "@/features/spinner/components/Spinner";
import { Button } from "@/features/ui/button/components/Button";
import { Select } from "@/features/ui/select/components/Select";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useAppStore } from "@/zustand/store";
import { type ProfileListVersions, ProfileListVersionsArray } from "../types/versions";
import { Desktop } from "./listversions/Desktop";

export const ProfileList = () => {
    // zustand state
    const profiles = useAppStore((state) => state.profiles);
    const promises = useAppStore((state) => state.promises);

    // zustand functions
    const getAllProfiles = useAppStore((state) => state.getAllProfiles);

    // list items handling
    const [listItems, setListItems] = useState<string[]>(ProfileListVersionsArray);
    const [listVersion, setListVersion] = useState<ProfileListVersions>("desktop");
    const isMobile = useMediaQuery("(max-width: 640px)");

    // switching to mobile version when we're on desktop
    useEffect(() => {
        requestAnimationFrame(() => {
            if (isMobile) {
                if (listVersion === "desktop") {
                    setListVersion("mobile");
                }
                setListItems(ProfileListVersionsArray.filter((v) => v !== "desktop"));
            } else {
                setListItems(ProfileListVersionsArray);
            }
        });
    }, [listVersion, isMobile]);

    useEffect(() => {
        getAllProfiles();
    }, [getAllProfiles]);

    if (profiles === undefined || promises?.profiles === "pending") {
        return (
            <div className="flex flex-col w-full max-w-lg box m-auto">
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                        <span className="text-center text-foreground-2! text-5!">
                            Fetching profiles...
                        </span>
                        <span className="text-center">Wait until they all load</span>
                    </div>

                    <hr />
                    <div className="flex flex-col gap-2 items-center justify-center">
                        <span>
                            If something went wrong - click this button to attempt to fix it.
                        </span>
                        <Button
                            onClick={() => {
                                getAllProfiles(false);
                            }}
                        >
                            Re-fetch
                        </Button>
                    </div>
                    <Spinner styles="big" />
                </div>
            </div>
        );
    }

    const profileListVersion = () => {
        switch (listVersion) {
            case "desktop":
                return <Desktop profiles={profiles} />;
        }
    };

    return (
        <div className="flex flex-col w-full max-w-3xl box m-auto">
            <div className="flex flex-col gap-4 p-2">
                <div className="flex flex-col gap-2">
                    <span className="text-center text-foreground-2! text-5!">Profiles</span>
                    <span className="text-center">All the profiles that you can see are here</span>
                </div>
                <hr />
                <div className="flex flex-col gap-2">
                    <span className="flex flex-wrap justify-between ">
                        <b className="whitespace-nowrap">Display type</b>
                        <small className="ml-auto">(gets saved)</small>
                    </span>
                    <Select
                        items={listItems}
                        value={listVersion}
                        onChange={(e) => setListVersion(e as ProfileListVersions)}
                    />
                </div>
                <hr />
                {profileListVersion()}
            </div>
        </div>
    );
};
