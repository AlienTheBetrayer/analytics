import type { Url } from "next/dist/shared/lib/router/router";
import Link from "next/link";
import { type CSSProperties, forwardRef } from "react";

type Props = {
    children: React.ReactNode;
    href: Url;
    className?: string;
    isEnabled?: boolean;
    styles?: string;
    newTab?: boolean;
    style?: CSSProperties;
};

export const LinkButton = forwardRef<HTMLAnchorElement, Props>(
    function LinkButton(
        {
            className,
            children,
            href,
            isEnabled,
            style,
            styles,
            newTab = false,
        }: Props,
        ref
    ) {
        return (
            <Link
                ref={ref}
                href={href}
                style={style}
                target={`${newTab ? "_blank" : "_self"}`}
                rel="noopener noreferrer"
                className={`group 
                    ${styles ?? "button"}
                    ${(isEnabled ?? true) !== true ? "pointer-events-none opacity-30" : ""} 
                    ${className ?? ""} 
                `}
            >
                {children}
            </Link>
        );
    }
);
