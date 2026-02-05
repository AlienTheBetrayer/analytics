import { NoPreview } from "@/features/contact/components/errors/NoPreview";
import {
    SendFormContents,
    SendFormHandle,
} from "@/features/contact/components/tabs/send/SendForm";
import { ProfileImage } from "@/features/profile/components/ProfileImage";
import { LinkButton } from "@/features/ui/linkbutton/components/LinkButton";
import { useQuery } from "@/query/core";
import Image from "next/image";
import { useEffect, useState } from "react";

type ToBoolean<T extends object> = {
    [K in keyof T]: boolean;
};

type Props = {
    contents: SendFormContents;
    handle: React.RefObject<SendFormHandle | null>;
    expanded?: boolean;
};

export const Preview = ({ contents, handle, expanded }: Props) => {
    // fetching
    const { data: status } = useQuery({ key: ["status"] });

    // error states
    const [validity, setValidity] = useState<ToBoolean<SendFormContents>>({});

    useEffect(() => {
        requestAnimationFrame(() => {
            setValidity((prev) => ({
                ...prev,
                email: handle.current?.email.current?.checkValidity(),
                message: handle.current?.message.current?.checkValidity(),
                title: handle.current?.title.current?.checkValidity(),
            }));
        });
    }, [contents, handle]);

    // fallbacks
    if (!contents.email && !contents.message && !contents.title) {
        return (
            <div className="w-full h-full loading flex items-center justify-center min-h-72">
                <div className="w-full max-w-3/4">
                    <NoPreview />
                </div>
            </div>
        );
    }

    return (
        <div className="w-full h-full flex items-center justify-center min-h-72">
            <LinkButton
                href={`/profile/`}
                className={`flex! p-4! w-full h-fit ${expanded ? "h-full max-h-full" : "max-h-32"} focus-within:max-h-fit hover:max-h-fit justify-start! items-stretch! rounded-4xl! gap-4!`}
                style={{
                    interpolateSize: "allow-keywords",
                }}
            >
                <div className="flex flex-col items-center w-full max-w-16 truncate gap-2">
                    {status && (
                        <span className="whitespace-nowrap">
                            <mark>{status.username}</mark>
                        </span>
                    )}

                    {status?.profile.avatar_url ? (
                        <ProfileImage
                            className="w-full aspect-square!"
                            profile={status.profile}
                            width={256}
                            height={256}
                        />
                    ) : (
                        <div className="w-full aspect-square loading rounded-full!" />
                    )}
                </div>

                <ul className="grid grid-flow-row grid-rows-[1.5rem_1.5rem_1fr] wrap-anywhere items-center w-full grow gap-1 overflow-hidden text-center">
                    <li className="h-full">
                        {contents.title ? (
                            <span
                                className={`overflow-hidden ${!validity.title ? "invalid" : ""}`}
                            >
                                {contents.title}
                            </span>
                        ) : (
                            <div className="flex items-center justify-center w-full loading rounded-lg! h-full">
                                <span>
                                    <small className="flex items-center gap-1">
                                        <Image
                                            alt=""
                                            width={16}
                                            height={16}
                                            src="/menu.svg"
                                        />
                                        <u>Title</u>
                                    </small>
                                </span>
                            </div>
                        )}
                    </li>

                    <li className="h-full">
                        {contents.email ? (
                            <span
                                className={`overflow-hidden ${!validity.email ? "invalid" : ""}`}
                            >
                                {contents.email}
                            </span>
                        ) : (
                            <div className="flex items-center justify-center w-full loading rounded-lg! h-full">
                                <span>
                                    <small className="flex items-center gap-1">
                                        <Image
                                            alt=""
                                            width={16}
                                            height={16}
                                            src="/email.svg"
                                        />
                                        <u>E-mail</u>
                                    </small>
                                </span>
                            </div>
                        )}
                    </li>

                    <li className="h-full">
                        {contents.message ? (
                            <span
                                className={`overflow-hidden ${!validity.message ? "invalid" : ""}`}
                            >
                                {contents.message}
                            </span>
                        ) : (
                            <div className="flex items-center justify-center w-full loading rounded-lg! h-full">
                                <span>
                                    <small className="flex items-center gap-1">
                                        <Image
                                            alt=""
                                            width={16}
                                            height={16}
                                            src="/commentadd.svg"
                                        />
                                        <u>Message</u>
                                    </small>
                                </span>
                            </div>
                        )}
                    </li>
                </ul>
            </LinkButton>
        </div>
    );
};
