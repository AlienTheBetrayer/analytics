import { CreateBoard } from "@/features/messages/components/noteboard/CreateBoard";
import { DisplayFormat } from "@/features/messages/components/noteboard/DisplayFormat";
import { Button } from "@/features/ui/button/components/Button";
import { Input } from "@/features/ui/input/components/Input";
import { LinkButton } from "@/features/ui/linkbutton/components/LinkButton";
import { useMessageBox } from "@/features/ui/messagebox/hooks/useMessageBox";
import { Modal } from "@/features/ui/popovers/components/modal/Modal";
import { Tooltip } from "@/features/ui/popovers/components/tooltip/Tooltip";
import { deleteNoteboard, upsertNoteboard } from "@/query-api/calls/notes";
import { CacheAPIProtocol } from "@/query-api/protocol";
import { TabSelection } from "@/utils/other/TabSelection";
import { useAppStore } from "@/zustand/store";
import Image from "next/image";
import { redirect, useParams } from "next/navigation";

type Props = {
    data?: CacheAPIProtocol["noteboards"]["data"][number] | null;
};

export const NoteboardTopline = ({ data }: Props) => {
    const { extra } = useParams<{
        extra?: string;
    }>();

    const deleteBox = useMessageBox();
    const display = useAppStore((state) => state.display.notes);
    const updateDisplay = useAppStore((state) => state.updateDisplay);

    return (
        <ul className="box min-h-10! h-10! gap-1! p-0! items-center! flex-row!">
            {deleteBox.render({
                children:
                    "This board will disappear forever along with its elements!",
                onSelect: (res) => {
                    if (!data) {
                        return;
                    }

                    if (res === "yes") {
                        deleteNoteboard({
                            user_id: data?.user_id,
                            noteboard_id: data.id,
                        });
                        redirect("/messages/notes/board");
                    }
                },
            })}

            {!extra && (
                <>
                    <li>
                        <Tooltip
                            direction="bottom"
                            text="Sorting direction"
                        >
                            <Button
                                onClick={() =>
                                    updateDisplay({
                                        notes: { reversed: !display.reversed },
                                    })
                                }
                            >
                                <Image
                                    alt=""
                                    width={16}
                                    height={16}
                                    src="/sort.svg"
                                    className={`${display.reversed ? "rotate-180" : ""} duration-500!`}
                                />
                                <TabSelection
                                    condition={true}
                                    color={
                                        display.reversed
                                            ? "var(--orange-1)"
                                            : "var(--blue-1)"
                                    }
                                />
                            </Button>
                        </Tooltip>
                    </li>
                    <li>
                        <Tooltip
                            direction="bottom"
                            text="Filter by title"
                        >
                            <Input
                                placeholder="Filter..."
                                value={display.filter}
                                onChange={(value) =>
                                    updateDisplay({ notes: { filter: value } })
                                }
                            />
                        </Tooltip>
                    </li>
                </>
            )}

            <li className="ml-auto!">
                <Tooltip
                    direction="bottom"
                    text="Back"
                >
                    <LinkButton
                        href={
                            !extra ? "/messages/notes" : "/messages/notes/board"
                        }
                    >
                        <Image
                            alt="back"
                            width={16}
                            height={16}
                            src="/back.svg"
                        />
                    </LinkButton>
                </Tooltip>
            </li>

            {!extra && (
                <>
                    <li>
                        <Modal
                            tooltipClassName="w-screen max-w-96"
                            element={() => <CreateBoard type="create" />}
                            direction="bottom-left"
                        >
                            <Tooltip
                                direction="bottom"
                                text="Create"
                            >
                                <Button>
                                    <Image
                                        alt=""
                                        width={16}
                                        height={16}
                                        src="/plus.svg"
                                    />
                                </Button>
                            </Tooltip>
                        </Modal>
                    </li>

                    <li>
                        <Modal
                            tooltipClassName="w-screen max-w-lg"
                            element={() => <DisplayFormat />}
                            direction="bottom-left"
                        >
                            <Tooltip
                                direction="bottom"
                                text="Display Format"
                            >
                                <Button>
                                    <Image
                                        alt=""
                                        width={16}
                                        height={16}
                                        src="/cubes.svg"
                                    />
                                </Button>
                            </Tooltip>
                        </Modal>
                    </li>
                </>
            )}

            {extra && (
                <>
                    <li>
                        <Modal
                            tooltipClassName="w-screen max-w-96"
                            direction="bottom-left"
                            element={() => (
                                <CreateBoard
                                    type="edit"
                                    data={data}
                                />
                            )}
                        >
                            <Tooltip
                                direction="bottom"
                                text="Edit board"
                            >
                                <Button>
                                    <Image
                                        alt=""
                                        width={16}
                                        height={16}
                                        src="/pencil.svg"
                                    />
                                </Button>
                            </Tooltip>
                        </Modal>
                    </li>

                    <li>
                        <Tooltip
                            direction="bottom"
                            text="Delete board"
                        >
                            <Button onClick={deleteBox.show}>
                                <Image
                                    alt=""
                                    width={16}
                                    height={16}
                                    src="/delete.svg"
                                />
                            </Button>
                        </Tooltip>
                    </li>

                    <li>
                        <Tooltip
                            direction="bottom"
                            text={data?.pinned ? "Unpin" : "Pin"}
                            isEnabled={!!data}
                        >
                            <Button
                                onClick={() => {
                                    if (!data) {
                                        return;
                                    }

                                    upsertNoteboard({
                                        type: "edit",
                                        user_id: data.user_id,
                                        noteboard_id: data.id,
                                        pinned: !data.pinned,
                                    });
                                }}
                            >
                                <Image
                                    alt=""
                                    width={14}
                                    height={14}
                                    src="/pin.svg"
                                    className={data?.pinned ? "" : "opacity-30"}
                                />
                            </Button>
                        </Tooltip>
                    </li>
                </>
            )}
        </ul>
    );
};
