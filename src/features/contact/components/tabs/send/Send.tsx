import { Preview } from "@/features/contact/components/tabs/send/Preview";
import {
    SendForm,
    SendFormContents,
    SendFormHandle,
} from "@/features/contact/components/tabs/send/SendForm";
import { Button } from "@/features/ui/button/components/Button";
import { useMessageBox } from "@/features/ui/messagebox/hooks/useMessageBox";
import { Tooltip } from "@/features/ui/popovers/components/tooltip/Tooltip";
import Image from "next/image";
import { useRef, useState } from "react";

export const Send = () => {
    // react states
    const [contents, setContents] = useState<SendFormContents>({});

    // message boxes
    const deleteBox = useMessageBox();

    // refs & handles
    const handle = useRef<SendFormHandle | null>(null);

    return (
        <div className="flex flex-col items-center gap-8 grow">
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
                        Sending:
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
                    <span className="flex items-center gap-1">
                        <Image
                            alt=""
                            width={16}
                            height={16}
                            src="/send.svg"
                        />
                        Message:
                    </span>
                    <hr />
                    <SendForm
                        ref={handle}
                        onSubmit={() => {}}
                        onDelete={deleteBox.show}
                        contents={contents}
                        setContents={setContents}
                    />
                </div>

                <div className="flex flex-col items-center gap-4">
                    <span className="flex items-center gap-1">
                        <Image
                            alt=""
                            width={16}
                            height={16}
                            src="/eye.svg"
                        />
                        <mark>Preview:</mark>
                    </span>
                    <hr />
                    <Preview
                        contents={contents}
                        handle={handle}
                    />
                </div>
            </div>
        </div>
    );
};
