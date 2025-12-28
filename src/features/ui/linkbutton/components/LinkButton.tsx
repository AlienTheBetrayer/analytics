import type { Url } from "next/dist/shared/lib/router/router";
import Link from "next/link";
import { type CSSProperties, forwardRef } from "react";
import { LinkButtonStyles } from "../utils/styles";

type Props = {
	children: React.ReactNode;
	href: Url;
	className?: string;
	isEnabled?: boolean;
	styles?: keyof typeof LinkButtonStyles;
	style?: CSSProperties;
};

export const LinkButton = forwardRef<HTMLAnchorElement, Props>(
	(
		{
			className,
			children,
			href,
			isEnabled = true,
			style = {},
			styles = "button",
		}: Props,
		ref,
	) => {
		return (
			<Link
				ref={ref}
				href={href}
                style={style}
				className={`flex gap-1 items-center justify-center group ${LinkButtonStyles[styles]} ${isEnabled !== true ? "pointer-events-none opacity-30" : ""} ${className ?? ""} 
                `}
			>
				{children}
			</Link>
		);
	},
);
