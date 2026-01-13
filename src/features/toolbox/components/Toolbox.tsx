import { useLocalStore } from "@/zustand/localStore";
import { Authentication } from "./Authentication";
import { Theme } from "./Theme";

export const Toolbox = () => {
    // zustand's localstore
    const visibleProfile = useLocalStore((state) => state.visibleProfile);

    return (
        <div
            className={`hidden sm:flex items-center justify-center gap-2 min-h-8 min-w-8
                        ml-auto z-2
                        bg-background-a-5 backdrop-blur-3xl rounded-full px-2
                        ${!visibleProfile ? "border-awaiting" : ""}`}
        >
            <Authentication/>
            <Theme/>
        </div>
    );
};
