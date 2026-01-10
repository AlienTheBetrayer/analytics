import { Filtering } from "@/features/dashboard/components/topline/events/Filtering";
import { MessageBox } from "@/features/messagebox/components/MessageBox";
import { usePopup } from "@/features/popup/hooks/usePopup";
import { Tooltip } from "@/features/tooltip/components/Tooltip";
import { Button } from "@/features/ui/button/components/Button";
import { useLocalStore } from "@/zustand/localStore";
import Image from "next/image";

export const Topline = () => {
    // zustand
    const notifications = useLocalStore((state) => state.notifications);
    const hasNotification = !!Object.keys(notifications.dashboard).length;
    const clearNotifications = useLocalStore(
        (state) => state.clearNotifications
    );

    // messageboxes
    const deleteBox = usePopup(({ hide }) => (
        <MessageBox
            description="Deleting will clear all the notifications that you had on this specific tab"
            onInteract={(res) => {
                hide();
                if (res === "yes") {
                    clearNotifications({ type: "account" });
                }
            }}
        />
    ));

    return (
        <div
            className={`box p-0! gap-1! flex-row! transition-all duration-300 h-10 min-h-10 items-center ${!hasNotification ? "opacity-30" : ""}`}
            inert={!hasNotification}
        >
            {deleteBox.render()}

            <div
                className="absolute flex gap-1 items-center left-1/2 top-1/2 -translate-1/2 transition-all duration-500"
                style={{ opacity: !hasNotification ? 0 : 1 }}
            >
                <Image
                    alt=""
                    width={16}
                    height={16}
                    src="/dashboard.svg"
                />
                <span>Dashboard-only</span>
            </div>

            <div
                className="select-none pointer-events-none transition-all duration-300 absolute inset-0 grid place-items-center z-1"
                style={{ opacity: hasNotification ? 0 : 1 }}
            >
                <span>
                    <mark>Fetch</mark> notifications to access
                </span>
            </div>

            <Tooltip
                disabledPointer={false}
                type="modal"
                direction="bottom-right"
                element={<Filtering />}
            >
                <Tooltip
                    text="Filter events"
                    direction="top"
                >
                    <Button className="aspect-square">
                        <Image
                            alt="filter"
                            src="/filter.svg"
                            width={16}
                            height={16}
                        />

                        <div
                            className="absolute right-1 top-1 rounded-full w-1 h-1 transition-all duration-300"
                            // style={{
                            //     background: eventFilters[
                            //         selectedProjectId ?? ""
                            //     ]?.eventsFiltering
                            //         ? "var(--blue-1)"
                            //         : "transparent",
                            // }}
                        />
                    </Button>
                </Tooltip>
            </Tooltip>

            <Tooltip
                className="ml-auto"
                direction="top"
                text="Wipe all notifications on this tab"
            >
                <Button
                    className="p-0!"
                    onClick={deleteBox.show}
                >
                    <Image
                        alt=""
                        width={16}
                        height={16}
                        src="/delete.svg"
                    />
                </Button>
            </Tooltip>
        </div>
    );
};
