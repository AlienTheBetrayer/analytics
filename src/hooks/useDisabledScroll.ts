import { useState, useEffect, useMemo } from "react";

export const useDisabledScroll = () => {
    const [isDisabled, setIsDisabled] = useState<boolean>(false);

    useEffect(() => {
        if (isDisabled) {
            const originalStyle = window.getComputedStyle(
                document.body,
            ).overflow;
            document.body.style.overflow = "hidden";

            return () => {
                document.body.style.overflow = originalStyle;
            };
        }
    }, [isDisabled]);

    return useMemo(() => {
        return { setIsDisabled };
    }, [setIsDisabled]);
};
