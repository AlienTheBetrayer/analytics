import Image from "next/image";
import type { ComponentPropsWithoutRef } from "react";
import "./Spinner.css";
import { SpinnerStyles } from "../utils/styles";

type Props = {
    styles?: keyof typeof SpinnerStyles;
    width?: number;
    height?: number;
} & Omit<ComponentPropsWithoutRef<"img">, "src" | "width" | "height">;

export const Spinner = ({
    className,
    styles,
    width,
    height,
    ...rest
}: Props) => {
    return (
        <Image
            alt="Loading"
            src="/spinner.svg"
            width={width ?? 16}
            height={height ?? 16}
            className={`loading-spinner ${className ?? ""} ${styles ? SpinnerStyles[styles] : ""}`}
            {...rest}
        />
    );
};
