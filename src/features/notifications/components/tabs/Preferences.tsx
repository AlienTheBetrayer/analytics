import { Topline } from "../toplines/preferences/Topline";
import { Checkbox } from "@/features/ui/checkbox/components/Checkbox";
import { useLocalStore } from "@/zustand/localStore";

export const Preferences = () => {
    // local storage
    const preferences = useLocalStore((state) => state.preferences);
    const updatePreferences = useLocalStore((state) => state.updatePreferences);

    return (
        <div className="flex flex-col gap-2 grow">
            <Topline />

            <hr />

            <label
                htmlFor="visibility"
                className="flex whitespace-nowrap"
            >
                <span>Popups&apos; visiblity</span>
                <small className="ml-auto text-ellipsis-left">
                    (whether to show them when they occur)
                </small>
            </label>
            <Checkbox
                id="visibility"
                value={preferences.visibility}
                onToggle={(flag) => {
                    updatePreferences({ visibility: flag });
                }}
            >
                Visibility
            </Checkbox>
            <hr className="mb-2" />

            <hr className="mt-auto" />
        </div>
    );
};
