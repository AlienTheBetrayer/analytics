import { rippleEnable, rippleDisable } from "@/features/ui/ripple/utils/ripple";
import type { Url } from "next/dist/shared/lib/router/router";
import Link from "next/link";
import { type CSSProperties, forwardRef } from "react";

type Props = {
    children?: React.ReactNode;
    href: Url;
    className?: string;
    isEnabled?: boolean;
    styles?: string;
    newTab?: boolean;
    style?: CSSProperties;
    ariaLabel?: string;
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
            ariaLabel,
            newTab = false,
        }: Props,
        ref,
    ) {
        // main jsx
        return (
            <Link
                ref={ref}
                href={href}
                style={style}
                target={`${newTab ? "_blank" : "_self"}`}
                rel="noopener noreferrer"
                className={`group ripple
                    ${styles ?? "button"}
                    ${(isEnabled ?? true) !== true ? "pointer-events-none opacity-30" : ""} 
                    ${className ?? ""} 
                `}
                aria-label={ariaLabel}
                onPointerDown={(e) => {
                    rippleEnable(e);
                }}
                onPointerEnter={(e) => {
                    rippleEnable(e, "enter");
                }}
                onPointerLeave={(e) => {
                    rippleDisable(e);
                }}
                onPointerUp={(e) => {
                    rippleDisable(e);
                }}
            >
                {children}
            </Link>
        );
    },
);
