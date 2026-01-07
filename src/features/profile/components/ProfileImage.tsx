import Image from "next/image";
import { VisibleProfile } from "@/types/zustand/local";
import { Profile } from "@/types/tables/account";

type Props = {
    profile?: Profile | VisibleProfile;
    src?: string;
    width?: number;
    height?: number;
    className?: string;
};

export const ProfileImage = ({
    profile,
    src,
    width,
    height,
    className,
    ...rest
}: Props) => {
    // ui derived states
    const url = src ?? profile?.avatar_url;

    return url ? (
        <Image
            width={width ?? 16}
            height={height ?? 16}
            src={url}
            alt="pfp"
            className={`rounded-full aspect-square invert-0! grayscale-0! ${className ?? ""}`}
            {...rest}
        />
    ) : (
        <div
            className={`rounded-full aspect-square ${className ?? ""}`}
            style={{
                background: profile?.color ?? "var(--blue-3)",
                width,
                height,
            }}
        />
    );
};
