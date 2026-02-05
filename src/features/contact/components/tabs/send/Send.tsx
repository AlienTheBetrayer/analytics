import { SendForm } from "@/features/contact/components/tabs/send/SendForm";
import { Button } from "@/features/ui/button/components/Button";
import Image from "next/image";
import { useRef } from "react";

export const Send = () => {
    const formRef = useRef<{ showDeleteBox: () => void } | null>(null);

    return (
        <div className="flex flex-col items-center gap-8 grow">
            <ul className="box p-0! h-10! flex-row! w-full items-center mt-6! md:mt-0!">
                <li className="absolute left-1/2 -top-1/2 md:top-1/2 -translate-1/2">
                    <span className="flex items-center gap-1">
                        <Image
                            alt=""
                            width={16}
                            height={16}
                            src="/send.svg"
                        />
                        Send a message:
                    </span>
                </li>

                <li className="ml-auto!">
                    <Button
                        aria-label="delete"
                        onClick={() => formRef.current?.showDeleteBox()}
                    >
                        <Image
                            alt=""
                            width={16}
                            height={16}
                            src="/delete.svg"
                        />
                    </Button>
                </li>
            </ul>

            <hr />

            <SendForm
                type="edit"
                ref={formRef}
            />
        </div>
    );
};
