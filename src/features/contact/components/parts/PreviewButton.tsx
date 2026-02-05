import { PreviewDate } from "@/features/contact/components/parts/Date";
import { SendFormValidity } from "@/features/contact/components/tabs/send/Preview";
import { SendFormContents } from "@/features/contact/components/tabs/send/SendForm";
import { ProfileImage } from "@/features/profile/components/ProfileImage";
import { LinkButton } from "@/features/ui/linkbutton/components/LinkButton";
import { Tooltip } from "@/features/ui/popovers/components/tooltip/Tooltip";
import { CacheAPIProtocol } from "@/query-api/protocol";
import { relativeTime } from "@/utils/other/relativeTime";
import Image from "next/image";

type Props = {
    username?: string;
    avatar_url?: string;
    avatar_color?: string;
    contents: SendFormContents;
    validity?: SendFormValidity;
    expanded?: boolean;
} & (
    | { type: "form"; contents: SendFormContents }
    | { type: "message"; contents: CacheAPIProtocol["contact_message"]["data"] }
);

export const PreviewButton = ({
    type,
    username,
    avatar_color,
    avatar_url,
    contents,
    validity = { title: true, message: true, email: true },
    expanded,
}: Props) => {
    return (
        <Tooltip
            element={
                type === "form" ? (
                    <div className="box flex-row! p-2!">
                        <Image
                            alt=""
                            width={16}
                            height={16}
                            src="/eye.svg"
                        />
                        <span>Preview</span>
                    </div>
                ) : (
                    <PreviewDate data={contents} />
                )
            }
            className="w-full"
        >
            <LinkButton
                href={
                    type === "form"
                        ? `/contact/send/`
                        : `/contact/view/${contents.id}`
                }
                className={`flex flex-col p-4! w-full h-fit 
                 justify-start! items-stretch! rounded-4xl! 
                 ${expanded ? "h-full max-h-full" : "max-h-96 md:max-h-32"} `}
                style={{
                    interpolateSize: "allow-keywords",
                }}
            >
                {type === "message" && (
                    <ul className="absolute right-4 top-2 flex items-center gap-1 whitespace-nowrap">
                        {contents.edited_at && (
                            <li className="flex items-center gap-1">
                                <Image
                                    alt=""
                                    width={16}
                                    height={16}
                                    src="/pencil.svg"
                                />
                            </li>
                        )}

                        <li className="flex items-center gap-1">
                            <Image
                                alt=""
                                width={16}
                                height={16}
                                src="/imageadd.svg"
                            />
                            <span>{relativeTime(contents.created_at)}</span>
                        </li>
                    </ul>
                )}

                <div className="flex flex-col md:flex-row gap-4 w-full grow">
                    <div className="flex flex-col self-center md:self-auto items-center w-full max-w-16 truncate gap-2">
                        {username && (
                            <span className="whitespace-nowrap">
                                <mark>{username}</mark>
                            </span>
                        )}

                        {avatar_url ? (
                            <ProfileImage
                                className="w-full aspect-square!"
                                src={avatar_url}
                                width={256}
                                height={256}
                            />
                        ) : avatar_color ? (
                            <div
                                className="w-full aspect-square rounded-full!"
                                style={{
                                    background: avatar_color,
                                }}
                            />
                        ) : (
                            <div className="w-full aspect-square loading rounded-full!" />
                        )}
                    </div>

                    <ul className="grid grid-flow-row grid-rows-[1.5rem_1.5rem_1fr] wrap-anywhere items-center w-full grow gap-1 overflow-hidden text-center">
                        <li className="h-full">
                            {contents.title ? (
                                <span
                                    className={`overflow-hidden ${!validity?.title ? "invalid" : ""}`}
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
                                    className={`overflow-hidden ${!validity?.email ? "invalid" : ""}`}
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
                                    className={`overflow-hidden ${!validity?.message ? "invalid" : ""}`}
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
                </div>
            </LinkButton>
        </Tooltip>
    );
};
