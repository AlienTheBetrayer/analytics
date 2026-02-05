import { NoPreview } from "@/features/contact/components/errors/NoPreview";
import { PreviewButton } from "@/features/contact/components/parts/PreviewButton";
import {
    SendFormContents,
    SendFormHandle,
} from "@/features/contact/components/tabs/send/SendForm";
import { useQuery } from "@/query/core";
import { useEffect, useState } from "react";

type ToBoolean<T extends object> = {
    [K in keyof T]: boolean;
};

export type SendFormValidity = ToBoolean<SendFormContents>;

type Props = {
    contents: SendFormContents;
    handle: React.RefObject<SendFormHandle | null>;
    expanded?: boolean;
};

export const Preview = ({ contents, handle, expanded }: Props) => {
    // fetching
    const { data: status } = useQuery({ key: ["status"] });

    // error states
    const [validity, setValidity] = useState<SendFormValidity>({});

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
            <div className="w-full h-full loading flex items-center justify-center min-h-96">
                <div className="w-full max-w-3/4">
                    <NoPreview />
                </div>
            </div>
        );
    }

    return (
        <div className="w-full h-full flex items-center justify-center min-h-96">
            <PreviewButton
                type="form"
                avatar_color={status?.profile.color}
                expanded={expanded}
                contents={contents}
                validity={validity}
                username={status?.username}
                avatar_url={status?.profile.avatar_url}
            />
        </div>
    );
};
