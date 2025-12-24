import Image from "next/image";
import type { ComponentPropsWithoutRef } from "react";
import "./Spinner.css";
import { SpinnerStyles } from "../utils/styles";

type Props = {
	styles?: keyof typeof SpinnerStyles;
} & ComponentPropsWithoutRef<"img">;

export const Spinner = ({ className, styles }: Props) => {
	return (
		<Image
			alt="Loading"
			src="/spinner.svg"
			width={16}
			height={16}
			className={`loading-spinner ${className ?? ""} ${styles ? SpinnerStyles[styles] : ""}`}
		/>
	);
};
