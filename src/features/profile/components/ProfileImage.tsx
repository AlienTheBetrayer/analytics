import Image from "next/image";
import type { Profile } from "@/types/api/database/profiles";

type Props = {
	profile?: Profile;
	src?: string;
	width?: number;
	height?: number;
	layout?: string;
	objectFit?: string;
	className?: string;
};

export const ProfileImage = ({
	profile,
	src,
	width,
	height,
	layout,
	objectFit,
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
			className={`rounded-full ${className ?? ""} aspect-square invert-0! grayscale-0!`}
			layout={layout}
			objectFit={objectFit}
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
