import { Input } from "@/features/ui/input/components/Input";
import { useState } from "react";

export const SearchButton = () => {
    // react states
    const [isFocused, setIsFocused] = useState<boolean>(false);

    return (
        <Input
            placeholder="Search..."
            container={{
                style: {
                    transition: `300ms ease-out`,
                    width: isFocused ? "100%" : "50%",
                },
                onFocus: () => {
                    setIsFocused(true);
                },
                onBlur: () => {
                    setIsFocused(false);
                },
            }}
        />
    );
};
