import { Button } from "@/features/ui/button/components/Button";
import { HTMLMotionProps } from "motion/react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

type Props = {
    ref: React.RefObject<HTMLElement | null>;
} & Omit<HTMLMotionProps<"button">, "ref">;

export const DragButton = ({ ref, className, ...rest }: Props) => {
    // states
    const [grabbing, setGrabbing] = useState<boolean>(false);

    // refs
    const initPos = useRef<[number, number]>([0, 0]);
    const initPosBox = useRef<[number, number]>([0, 0]);

    // hotkeys
    useEffect(() => {
        const handle = (e: KeyboardEvent) => {
            switch (e.code) {
                case "Escape": {
                    setGrabbing(false);
                    break;
                }
            }
        };

        window.addEventListener("keydown", handle);
        return () => window.removeEventListener("keydown", handle);
    }, []);

    // moving
    useEffect(() => {
        if (!grabbing || !ref.current) {
            return;
        }

        const handle = (e: PointerEvent) => {
            if (!ref.current) {
                return;
            }

            const { clientX: x, clientY: y } = e;
            const diff = [x - initPos.current[0], y - initPos.current[1]];

            ref.current.style.left = `${initPosBox.current[0] + diff[0]}px`;
            ref.current.style.top = `${initPosBox.current[1] + diff[1]}px`;
        };

        window.addEventListener("pointermove", handle);
        return () => window.removeEventListener("pointermove", handle);
    }, [grabbing, ref]);

    // pointer toggling
    useEffect(() => {
        const handleUp = () => {
            setGrabbing(false);
        };

        const handleDown = (e: PointerEvent) => {
            if (!ref.current) {
                return;
            }

            const { clientX: x, clientY: y } = e;
            const rect = ref.current.getBoundingClientRect();

            initPos.current = [x, y];
            initPosBox.current = [rect.left, rect.top];
        };

        window.addEventListener("pointerup", handleUp);
        window.addEventListener("pointerdown", handleDown);
        return () => {
            window.removeEventListener("pointerup", handleUp);
            window.removeEventListener("pointerdown", handleDown);
        };
    }, [ref]);

    return (
        <Button
            aria-label="drag"
            className={`absolute! rounded-lg! left-4 top-2 min-w-6! min-h-6! w-6! h-6! p-0! cursor-grab! active:cursor-grabbing! group
                    ${className ?? ""}`}
            onPointerDown={() => setGrabbing(true)}
            onPointerUp={() => setGrabbing(false)}
            {...rest}
        >
            <Image
                alt="x"
                width={24}
                height={24}
                src="/drag.svg"
                className={`${grabbing ? "rotate-360" : "rotate-180"} duration-500! group-active:animate-pulse select-none`}
                draggable={false}
            />
        </Button>
    );
};
