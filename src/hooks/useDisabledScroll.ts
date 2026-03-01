import { useEffect, useState } from "react";

let lockCount = 0;
let originalScrollY = 0;

export const useDisabledScroll = () => {
    const [isDisabled, setIsDisabled] = useState<boolean>(false);

    useEffect(() => {
        if (!isDisabled) {
            return;
        }

        if (!lockCount) {
            originalScrollY = window.scrollY;
            document.body.style.position = "fixed";
            document.body.style.top = `-${originalScrollY}px`;
            document.body.style.width = "100%";
            document.body.style.overflowY = "scroll";
        }

        lockCount++;

        return () => {
            lockCount--;

            if (!lockCount) {
                document.body.style.position = "";
                document.body.style.top = "";
                document.body.style.width = "";
                document.body.style.overflowY = "";
                window.scrollTo(0, originalScrollY);
                originalScrollY = 0;
            }
        };
    }, [isDisabled]);

    return {
        setIsDisabled,
    };
};
