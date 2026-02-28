import { rippleDisable, rippleEnable } from "@/features/ui/ripple/utils/ripple";
import { type HTMLMotionProps, motion } from "motion/react";

type Props = {
    isEnabled?: boolean;
    styles?: string;
} & HTMLMotionProps<"button">;

export const Button = ({
    children,
    onClick,
    isEnabled = true,
    onPointerDown,
    onPointerEnter,
    onPointerLeave,
    onPointerUp,
    className,
    styles = "button",
    ...rest
}: Props) => {
    // main jsx
    return (
        <motion.button
            onClick={onClick}
            type="button"
            disabled={!isEnabled}
            onPointerDown={(e) => {
                rippleEnable(e);
                onPointerDown?.(e);
            }}
            onPointerEnter={(e) => {
                rippleEnable(e, "enter");
                onPointerEnter?.(e);
            }}
            onPointerLeave={(e) => {
                rippleDisable(e);
                onPointerLeave?.(e);
            }}
            onPointerUp={(e) => {
                rippleDisable(e);
                onPointerUp?.(e);
            }}
            className={`group ripple
                ${styles} 
                ${isEnabled !== true ? "pointer-events-none opacity-30" : ""}
                ${className ?? ""} `}
            {...rest}
        >
            {children}
        </motion.button>
    );
};
