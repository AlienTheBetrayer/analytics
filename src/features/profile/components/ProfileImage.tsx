import Image from "next/image";
import { CSSProperties } from "react";

type Props<T> = {
    profile?: T extends { avatar_url?: string; color?: string } ? T : never;
    src?: string;
    width?: number;
    height?: number;
    className?: string;
    style?: CSSProperties;
};

export const ProfileImage = <T,>({
    profile,
    src,
    width,
    height,
    style,
    className,
    ...rest
}: Props<T>) => {
    // ui derived states
    const url = src ?? profile?.avatar_url;

    return url ? (
        <Image
            width={width ?? 16}
            height={height ?? 16}
            src={url}
            alt="pfp"
            className={`rounded-full aspect-square invert-0! grayscale-0! ${className ?? ""}`}
            style={{ ...style }}
            {...rest}
        />
    ) : (
        <div
            className={`rounded-full aspect-square ${className ?? ""}`}
            style={{
                background: profile?.color ?? "var(--blue-3)",
                width,
                height,
                ...style,
            }}
        />
    );
};
