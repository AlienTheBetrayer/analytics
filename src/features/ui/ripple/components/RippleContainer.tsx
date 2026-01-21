import { rippleEnable, rippleDisable } from "@/features/ui/ripple/utils/ripple";
import { ComponentPropsWithoutRef } from "react";

type Props = {} & ComponentPropsWithoutRef<"div">;

export const RippleContainer = ({ className, children, ...rest }: Props) => {
    return (
        <div
            className={`ripple-container ripple  ${className ?? ""}`}
            onPointerEnter={(e) => {
                rippleEnable(e, "hover");
            }}
            onPointerLeave={(e) => {
                rippleDisable(e);
            }}
            {...rest}
        >
            {children}
        </div>
    );
};
