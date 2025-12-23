import type { Url } from "next/dist/shared/lib/router/router";
import Link from "next/link";
import { LinkButtonStyles } from "../utils/styles";

type Props = {
	children: React.ReactNode;
	href: Url;
	className?: string;
	isEnabled?: boolean;
	style?: keyof typeof LinkButtonStyles;
};

export const LinkButton = ({
	className,
	children,
	href,
	isEnabled = true,
	style = "button",
}: Props) => {
	return (
		<Link
			href={href}
			className={`${LinkButtonStyles[style]} ${isEnabled !== true ? "pointer-events-none opacity-30" : ""} ${className ?? ""} 
            `}
		>
			{children}
		</Link>
	);
};
