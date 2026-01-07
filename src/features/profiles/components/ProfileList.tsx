"use client";

import { useEffect, useState } from "react";
import { Spinner } from "@/features/spinner/components/Spinner";
import { Button } from "@/features/ui/button/components/Button";
import { Select } from "@/features/ui/select/components/Select";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useAppStore } from "@/zustand/store";
import { type ProfileListVersions } from "../types/versions";
import { Desktop } from "./listversions/Desktop";
import { Compact } from "./listversions/Compact";
import { Mobile } from "./listversions/Mobile";
import { useLocalStore } from "@/zustand/localStore";

export const ProfileList = () => {
    // zustand state
    const profiles = useAppStore((state) => state.profiles);
    const promises = useAppStore((state) => state.promises);

    // zustand functions
    const getAllProfiles = useAppStore((state) => state.getAllProfiles);

    // list items handling
    const [listItems, setListItems] = useState<string[]>(["desktop", "mobile", "compact"]);
    const isMobile = useMediaQuery("(max-width: 640px)");

    // fetching
    useEffect(() => {
        getAllProfiles();
    }, [getAllProfiles]);

    // showing desktop tab only on desktop
    useEffect(() => {
        requestAnimationFrame(() => {
            setListItems(isMobile ? ["mobile", "compact"] : ["desktop", "mobile", "compact"]);
        });
    }, [isMobile]);

    // localstorage
    const profilesMenuType = useLocalStore((state) => state.profilesMenuType);
    const setProfilesMenuType = useLocalStore((state) => state.setProfilesMenuType);

    if (!profiles || promises?.profiles === "pending") {
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
        switch (profilesMenuType) {
            case "desktop":
                return <Desktop profiles={profiles} />;
            case "mobile":
                return <Mobile profiles={profiles} />;
            case "compact":
                return <Compact profiles={profiles} />;
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
                        value={profilesMenuType}
                        onChange={(e) => setProfilesMenuType(e as ProfileListVersions)}
                    />
                </div>
                <hr />
                {profileListVersion()}
            </div>
        </div>
    );
};
