import Image from "next/image";
import type { ComponentPropsWithoutRef } from "react";
import spinnerImg from "../../../public/loading.svg";
import "./Spinner.css";
import { SpinnerStyles } from "../utils/styles";

type Props = {
	styles?: keyof typeof SpinnerStyles;
} & ComponentPropsWithoutRef<"img">;

export const Spinner = ({ className, styles }: Props) => {
	return (
		<Image
			alt="Loading"
			src={spinnerImg}
			className={`loading-spinner ${className ?? ""} ${styles ? SpinnerStyles[styles] : ""}`}
		/>
	);
};
