import { ComponentPropsWithoutRef, forwardRef } from "react";

type Props = {
    onSelect: (file: File | undefined) => void;
    onError?: (file: File) => void;
    sizeLimit: number;
} & Omit<ComponentPropsWithoutRef<"input">, "onSelect" | "onError">;

export const FileSelect = forwardRef<HTMLInputElement, Props>(
    function FileSelectComponent(
        { onSelect, onError, sizeLimit, className, ...rest }: Props,
        ref,
    ) {
        return (
            <input
                ref={ref}
                id="image"
                type="file"
                accept="image/*"
                aria-hidden="true"
                className={`absolute opacity-0 w-0 h-0 pointer-events-none ${className ?? ""}`}
                tabIndex={-1}
                onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) {
                        return;
                    }

                    if (file.size / 1024 / 1024 > sizeLimit) {
                        onError?.(file);
                        return;
                    }

                    onSelect(file);
                }}
                {...rest}
            />
        );
    },
);
