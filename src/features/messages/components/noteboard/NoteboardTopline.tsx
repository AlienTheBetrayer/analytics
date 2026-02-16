import { CreateBoard } from "@/features/messages/components/noteboard/CreateBoard";
import { DisplayFormat } from "@/features/messages/components/noteboard/DisplayFormat";
import { Button } from "@/features/ui/button/components/Button";
import { LinkButton } from "@/features/ui/linkbutton/components/LinkButton";
import { Modal } from "@/features/ui/popovers/components/modal/Modal";
import { Tooltip } from "@/features/ui/popovers/components/tooltip/Tooltip";
import { PromiseState } from "@/promises/components/PromiseState";
import { wrapPromise } from "@/promises/core";
import { CacheAPIProtocol } from "@/query-api/protocol";
import { queryInvalidate } from "@/query/auxiliary";
import { useQuery } from "@/query/core";
import Image from "next/image";
import { useParams } from "next/navigation";

type Props = {
    data?: CacheAPIProtocol["noteboards"]["data"][number] | null;
};

export const NoteboardTopline = ({ data }: Props) => {
    const { data: status } = useQuery({ key: ["status"] });
    const { extra } = useParams<{
        extra?: string;
    }>();

    return (
        <ul className="box min-h-10! h-10! gap-1! p-0! items-center! flex-row!">
            {data ? (
                <li className="flex items-center gap-1 ml-4!">
                    <div className="bg-blue-1 rounded-full w-1 h-1" />
                    <Image
                        alt=""
                        width={16}
                        height={16}
                        src="/dashboard.svg"
                    />
                    <span>{data.title}</span>
                </li>
            ) : (
                <li className="flex items-center gap-1 ml-4!">
                    <div className="bg-blue-1 rounded-full w-1 h-1" />
                    <Image
                        alt=""
                        width={16}
                        height={16}
                        src="/dashboard.svg"
                    />
                    <span>Board</span>
                </li>
            )}

            <li className="ml-auto!">
                <Tooltip
                    direction="top"
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

            <li>
                <Modal
                    element={() => <CreateBoard />}
                    direction="bottom-left"
                >
                    <Tooltip
                        direction="top"
                        text="Create"
                    >
                        <Button>
                            <Image
                                alt=""
                                width={16}
                                height={16}
                                src="/cubeadd.svg"
                            />
                        </Button>
                    </Tooltip>
                </Modal>
            </li>

            <li>
                <Modal
                    element={() => <DisplayFormat />}
                    direction="bottom-left"
                >
                    <Tooltip
                        direction="top"
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

            <li>
                <Tooltip
                    direction="top"
                    text="Re-fetch notes"
                >
                    <Button
                        onClick={() => {
                            if (!status) {
                                return;
                            }

                            wrapPromise("reload", async () => {
                                return queryInvalidate({
                                    key: ["noteboards", status.id],
                                    silent: false,
                                });
                            });
                        }}
                    >
                        <PromiseState state="reload" />
                        <Image
                            alt=""
                            width={14}
                            height={14}
                            src="/reload.svg"
                        />
                    </Button>
                </Tooltip>
            </li>
        </ul>
    );
};
