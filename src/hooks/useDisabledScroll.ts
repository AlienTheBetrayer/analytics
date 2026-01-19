import { useEffect, useState } from "react";

export const useDisabledScroll = () => {
    const [isDisabled, setIsDisabled] = useState<boolean>(false);

    useEffect(() => {
        if (isDisabled === true) {
            const prevent = (e: Event) => {
                e.preventDefault();
            };

            const preventKeys = (e: KeyboardEvent) => {
                const keys = [
                    "ArrowUp",
                    "ArrowDown",
                    "PageUp",
                    "PageDown",
                    "Space",
                    "Home",
                    "End",
                ];
                if (keys.includes(e.code)) {
                    e.preventDefault();
                }
            };

            window.addEventListener("wheel", prevent, { passive: false });
            window.addEventListener("touchmove", prevent, { passive: false });
            window.addEventListener("keydown", preventKeys, { passive: false });

            return () => {
                window.removeEventListener("wheel", prevent);
                window.removeEventListener("touchmove", prevent);
                window.removeEventListener("keydown", preventKeys);
            };
        }
    }, [isDisabled]);

    return {
        setIsDisabled,
    };
};
