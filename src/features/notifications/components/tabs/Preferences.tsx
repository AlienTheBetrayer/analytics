import { Topline } from "../toplines/preferences/Topline";
import { Checkbox } from "@/features/ui/checkbox/components/Checkbox";
import { useLocalStore } from "@/zustand/localStore";

export const Preferences = () => {
    // local storage
    const preferences = useLocalStore((state) => state.preferences);
    const updatePreferences = useLocalStore((state) => state.updatePreferences);

    return (
        <div className="box grow bg-bg-2! p-4! border-0! gap-4!">
            <Topline />

            <label
                htmlFor="visibility"
                className="flex whitespace-nowrap"
            >
                <span>Popups&apos; visiblity</span>
                <small className="ml-auto truncate-left">
                    (whether to show them when they occur)
                </small>
            </label>
            <Checkbox
                className="not-hover:bg-bg-1!"
                id="visibility"
                value={preferences.visibility}
                onToggle={(flag) => {
                    updatePreferences({ visibility: flag });
                }}
            >
                Visibility
            </Checkbox>
        </div>
    );
};
