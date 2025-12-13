import Image from "next/image";
import type { ComponentPropsWithoutRef } from "react";
import spinnerImg from "../../../public/loading.svg";
import "./Spinner.css";

type Props = {} & ComponentPropsWithoutRef<"img">;

export const Spinner = ({ className }: Props) => {
	return (
		<Image
			alt="Loading"
			src={spinnerImg}
			className={`loading-spinner ${className ?? ""}`}
		/>
	);
};
