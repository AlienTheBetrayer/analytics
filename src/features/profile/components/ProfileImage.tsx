import Image from "next/image";
import type { Profile } from "@/types/api/database/profiles";

type Props = {
	profile?: Profile;
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
	const url = src ?? profile?.avatar;

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
