import { useCallback, useState } from "react";

export const useCheckbox = (value?: boolean, onToggle?: (flag: boolean) => void) => {
    // states
    const [isChecked, setIsChecked] = useState<boolean>(false);
    const inputValue = value ?? isChecked;

    const toggle = useCallback(() => {
        if (!value) {
            setIsChecked((prev) => !prev);
        }
        onToggle?.(!value);
    }, [value, onToggle]);

    const keyDown = useCallback(
        (e: React.KeyboardEvent<HTMLButtonElement>) => {
            if (e.code === "Space") {
                e.preventDefault();
                if (!value) {
                    setIsChecked((prev) => !prev);
                }
                onToggle?.(!value);
            }
        },
        [value, onToggle]
    );

    return {
        inputValue,
        isChecked,
        toggle,
        keyDown,
    };
};
