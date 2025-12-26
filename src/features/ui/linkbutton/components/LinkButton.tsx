import type { Url } from "next/dist/shared/lib/router/router";
import Link from "next/link";
import { LinkButtonStyles } from "../utils/styles";
import { forwardRef } from "react";

type Props = {
	children: React.ReactNode;
	href: Url;
	className?: string;
	isEnabled?: boolean;
	style?: keyof typeof LinkButtonStyles;
};

export const LinkButton = forwardRef<HTMLAnchorElement, Props>(({
	className,
	children,
	href,
	isEnabled = true,
	style = "button",
}: Props, ref) => {
	return (
		<Link
            ref={ref}
			href={href}
			className={`flex gap-1 items-center justify-center group ${LinkButtonStyles[style]} ${isEnabled !== true ? "pointer-events-none opacity-30" : ""} ${className ?? ""} 
            `}
		>
			{children}
		</Link>
	);
});
