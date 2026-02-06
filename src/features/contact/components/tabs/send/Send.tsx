import { Preview } from "@/features/contact/components/tabs/send/Preview";
import {
    SendForm,
    SendFormContents,
    SendFormHandle,
} from "@/features/contact/components/tabs/send/SendForm";
import { Button } from "@/features/ui/button/components/Button";
import { useMessageBox } from "@/features/ui/messagebox/hooks/useMessageBox";
import { Tooltip } from "@/features/ui/popovers/components/tooltip/Tooltip";
import { wrapPromise } from "@/promises/core";
import { updateContact } from "@/query-api/calls/contact";
import { CacheAPIProtocol } from "@/query-api/protocol";
import { useQuery } from "@/query/core";
import { TabSelection } from "@/utils/other/TabSelection";
import Image from "next/image";
import { useRef, useState } from "react";

type Props =
    | {
          type: "send";
          data?: never;
      }
    | { type: "edit"; data: CacheAPIProtocol["contact_message"]["data"] };

export const Send = ({ type, data }: Props) => {
    // fetching
    const { data: status } = useQuery({ key: ["status"] });

    // react states
    const [contents, setContents] = useState<SendFormContents>({
        title: data?.title ?? "",
        message: data?.message ?? "",
        email: data?.email ?? "",
    });
    const [previewExpanded, setPreviewExpanded] = useState<boolean>(true);

    // message boxes
    const deleteBox = useMessageBox();

    // refs & handles
    const handle = useRef<SendFormHandle | null>(null);

    const isEditable =
        !status || (type === "edit" && status.id !== data.user_id);

    return (
        <div
            className={`flex flex-col items-center transition-all duration-500 gap-8 grow ${isEditable ? "opacity-30" : ""}`}
            inert={isEditable}
        >
            {deleteBox.render({
                children: "Everything from this form will disappear!",
                onSelect: (res) => {
                    if (res === "yes") {
                        setContents({ title: "", message: "", email: "" });
                    }
                },
            })}

            <ul className="box p-0! h-10! flex-row! w-full items-center mt-6! md:mt-0!">
                <li className="absolute left-1/2 -top-1/2 md:top-1/2 -translate-1/2">
                    <span className="flex items-center gap-1">
                        <Image
                            alt=""
                            width={16}
                            height={16}
                            src="/send.svg"
                        />
                        Form:
                    </span>
                </li>

                <li className="ml-auto!">
                    <Tooltip text="Wipe form">
                        <Button
                            aria-label="delete"
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
                </li>
            </ul>

            <div className="w-full grid lg:grid-cols-[1fr_40%] gap-8">
                <div className="flex flex-col items-center gap-4">
                    <ul className="box flex-row! items-center min-h-10 h-10! p-0! w-full">
                        <li className="absolute left-1/2 -top-1/2 md:top-1/2 -translate-1/2">
                            <span className="flex items-center gap-1">
                                <Image
                                    alt=""
                                    width={16}
                                    height={16}
                                    src="/send.svg"
                                />
                                Message:
                            </span>
                        </li>
                    </ul>

                    <hr />

                    <SendForm
                        type={type}
                        ref={handle}
                        onSubmit={() => {
                            wrapPromise("updateContact", () => {
                                if (
                                    !status ||
                                    !contents.email ||
                                    !contents.message ||
                                    !contents.title
                                ) {
                                    return Promise.reject();
                                }

                                return updateContact({
                                    ...(type === "edit"
                                        ? {
                                              type: "edit",
                                              message_id: data.id,
                                          }
                                        : { type: "send", user_id: status.id }),
                                    title: contents.title,
                                    message: contents.message,
                                    email: contents.email,
                                });
                            });
                        }}
                        onDelete={deleteBox.show}
                        contents={contents}
                        setContents={setContents}
                    />
                </div>

                <div className="flex flex-col items-center gap-4">
                    <ul className="box flex-row! items-center min-h-10 h-10! p-0! w-full">
                        <li>
                            <Tooltip text="Expanded / Collapsed">
                                <Button
                                    className="p-0!"
                                    onClick={() => {
                                        setPreviewExpanded((prev) => !prev);
                                    }}
                                >
                                    <Image
                                        alt="+"
                                        width={20}
                                        height={20}
                                        src="/collapse.svg"
                                    />
                                    <TabSelection
                                        condition={true}
                                        color={
                                            previewExpanded
                                                ? "var(--blue-1)"
                                                : "var(--orange-1)"
                                        }
                                    />
                                </Button>
                            </Tooltip>
                        </li>

                        <li className="absolute left-1/2 -top-1/2 md:top-1/2 -translate-1/2">
                            <span className="flex items-center gap-1">
                                <Image
                                    alt=""
                                    width={16}
                                    height={16}
                                    src="/eye.svg"
                                />
                                <mark>Preview:</mark>
                            </span>
                        </li>
                    </ul>

                    <hr />

                    <Preview
                        contents={contents}
                        handle={handle}
                        expanded={previewExpanded}
                        data={data}
                    />
                </div>
            </div>
        </div>
    );
};
