import { Tooltip } from "@/features/tooltip/components/Tooltip";
import { Button } from "@/features/ui/button/components/Button";
import { Topline } from "../toplines/preferences/Topline";
import Image from "next/image";
import { useState } from "react";
import { Checkbox } from "@/features/ui/checkbox/components/Checkbox";

export const Preferences = () => {
    // react states
    const [visibility, setVisibility] = useState<boolean>(true);

    return (
        <div className="flex flex-col gap-2 grow">
            <Topline />
            <hr />
            <form
                className="flex flex-col gap-2 grow"
                onSubmit={(e) => {
                    e.preventDefault();
                }}
            >
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
                    value={visibility}
                    onToggle={(f) => setVisibility(f)}
                >
                    Visibility
                </Checkbox>
                <hr className="mb-2" />

                <hr className="mt-auto" />
                <Tooltip
                    className="w-full"
                    direction="top"
                    text="Apply the preferences' changes"
                >
                    <Button
                        type="submit"
                        className="w-full"
                    >
                        <Image
                            alt=""
                            width={12}
                            height={12}
                            src="/checkmark.svg"
                        />
                        Apply changes
                    </Button>
                </Tooltip>
            </form>
        </div>
    );
};
