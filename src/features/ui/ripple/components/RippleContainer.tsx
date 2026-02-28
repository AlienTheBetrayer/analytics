import { rippleEnable } from "@/features/ui/ripple/utils/ripple";
import { ComponentPropsWithoutRef } from "react";

type Props = {} & ComponentPropsWithoutRef<"div">;

export const RippleContainer = ({ className, children, ...rest }: Props) => {
    return (
        <div
            className={`ripple-container ripple  ${className ?? ""}`}
            onPointerEnter={(e) => {
                rippleEnable(e);
            }}
            {...rest}
        >
            {children}
        </div>
    );
};
