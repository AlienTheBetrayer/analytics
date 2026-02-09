import { Tooltip } from "@/features/ui/popovers/components/tooltip/Tooltip";
import { Button } from "@/features/ui/button/components/Button";
import { Select } from "@/features/ui/select/components/Select";
import { NotificationTab } from "@/types/other/notifications";
import { useAppStore } from "@/zustand/store";
import Image from "next/image";
import { CloseButton } from "@/features/ui/closebutton/components/CloseButton";

type Props = {
    tab: NotificationTab;
    hide: () => void;
};

export const Sort = ({ tab, hide }: Props) => {
    // zustand
    const filter = useAppStore((state) => state.filter)[tab];
    const setNotificationFilter = useAppStore(
        (state) => state.setNotificationFilter,
    );

    return (
        <div className="relative box p-4! gap-4! acrylic min-w-92">
            <CloseButton hide={hide} />

            <span className="flex flex-col items-center">
                <Image
                    alt="filter"
                    src="/sort.svg"
                    width={16}
                    height={16}
                />
                Sorting
            </span>

            <hr />
            <div className="flex gap-2">
                <Tooltip
                    className="w-full"
                    direction="top"
                    text="Column to sort by"
                >
                    <Select
                        items={["Title", "Description", "Status", "Sent Date"]}
                        value={filter.sorting?.column ?? "Status"}
                        onChange={(item) => {
                            setNotificationFilter({
                                type: "sort",
                                tab,
                                column: [item],
                            });
                        }}
                    />
                </Tooltip>

                <Tooltip
                    direction="top"
                    text={
                        filter?.sorting?.direction === "ascendant"
                            ? "Ascendant"
                            : "Descendant"
                    }
                >
                    <Button
                        className="aspect-square p-0!"
                        onClick={() => {
                            setNotificationFilter({
                                type: "sort",
                                tab,
                                direction:
                                    filter?.sorting?.direction === "ascendant"
                                        ? "descendant"
                                        : "ascendant",
                            });
                        }}
                    >
                        <Image
                            alt=""
                            src="/sort.svg"
                            width={16}
                            height={16}
                            className="duration-500! ease-out!"
                            style={{
                                transform:
                                    filter?.sorting?.direction === "ascendant"
                                        ? `rotate(180deg)`
                                        : `rotate(0deg)`,
                            }}
                        />
                    </Button>
                </Tooltip>
            </div>
            <hr />

            <div className="flex w-full">
                <Tooltip
                    text="Remove sorting filters"
                    className="w-full"
                >
                    <Button
                        className="w-full"
                        onClick={() => {
                            setNotificationFilter({
                                type: "sort",
                                tab,
                                column: ["Sent Date"],
                                direction: "descendant",
                            });
                        }}
                    >
                        <small>
                            <Image
                                alt=""
                                src="/delete.svg"
                                width={16}
                                height={16}
                            />
                        </small>
                        Undo sorting
                    </Button>
                </Tooltip>
            </div>
        </div>
    );
};
