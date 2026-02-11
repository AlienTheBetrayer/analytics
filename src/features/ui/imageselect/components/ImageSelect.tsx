import { Tooltip } from "@/features/ui/popovers/components/tooltip/Tooltip";
import { Button } from "@/features/ui/button/components/Button";
import { Edit } from "@/features/ui/imageselect/components/Edit";
import { Error } from "@/features/ui/imageselect/components/Error";
import { AnimatePresence } from "motion/react";
import Image from "next/image";
import {
    useState,
    ComponentPropsWithoutRef,
    useRef,
    useEffect,
    forwardRef,
    useImperativeHandle,
} from "react";
import { Modal } from "@/features/ui/popovers/components/modal/Modal";
import { FileSelect } from "@/features/ui/fileselect/components/FileSelect";

type Props = {
    onSelect: (file: File | null | undefined) => void;
    onError?: (file: File) => void;
    value?: File | null | undefined;
    sizeLimit?: number;
} & Omit<ComponentPropsWithoutRef<"input">, "onSelect" | "onError" | "value">;

export const ImageSelect = forwardRef<HTMLInputElement, Props>(
    function ImageSelectComponent(
        { value, onSelect, onError, sizeLimit = 0.5 }: Props,
        ref,
    ) {
        // states
        const [file, setFile] = useState<File | null>(null);
        const [error, setError] = useState<boolean>(false);

        const fileValue = value !== undefined ? value : file;

        // refs
        const inputRef = useRef<HTMLInputElement | null>(null);
        const buttonRef = useRef<HTMLButtonElement | null>(null);

        useImperativeHandle(ref, () => inputRef.current!, []);

        useEffect(() => {
            if (!fileValue) {
                buttonRef.current?.focus();
            }
        }, [fileValue]);

        return (
            <Tooltip
                direction="bottom"
                className="w-full"
                text={`${fileValue ? "Open an image editor" : "Prompt a file explorer"}`}
            >
                <Modal
                    className="w-full"
                    direction="top"
                    element={(hide) => (
                        <Edit
                            file={fileValue}
                            onEdit={() => {
                                inputRef.current?.click();
                            }}
                            onDelete={() => {
                                onSelect?.(null);
                                if (onSelect === undefined) {
                                    setFile(null);
                                }
                                hide?.();
                            }}
                        />
                    )}
                >
                    <Button
                        ref={buttonRef}
                        className="w-full h-full p-3! focus-within:outline-blue-1!"
                        style={{
                            outlineColor: fileValue
                                ? "var(--blue-3)"
                                : "transparent",
                        }}
                        onClick={() => {
                            if (!fileValue) {
                                inputRef.current?.click();
                            }
                        }}
                    >
                        <Image
                            alt=""
                            width={16}
                            height={16}
                            src={`${fileValue ? "/pencil.svg" : "/launch.svg"}`}
                        />

                        <span>{fileValue ? "Modify" : "Browse"}</span>

                        {fileValue && (
                            <div className="absolute right-3.5 top-1/2 -translate-y-1/2 p-2 aspect-square rounded-full outline-2 outline-blue-1">
                                <Image
                                    alt=""
                                    width={16}
                                    height={16}
                                    src="/checkmark.svg"
                                />
                            </div>
                        )}

                        <AnimatePresence>
                            {error && <Error sizeLimit={sizeLimit} />}
                        </AnimatePresence>
                    </Button>

                    <FileSelect
                        ref={inputRef}
                        sizeLimit={sizeLimit || 1}
                        onSelect={(file) => {
                            onSelect(file);
                            setFile(file ?? null);
                        }}
                        onError={(file) => {
                            setError(true);
                            setTimeout(() => {
                                setError(false);
                            }, 10000);
                            onError?.(file);
                        }}
                    />
                </Modal>
            </Tooltip>
        );
    },
);
