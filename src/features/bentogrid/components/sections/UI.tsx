import { BentoSection } from "@/features/bentogrid/components/parts/BentoSection";
import { Button } from "@/features/ui/button/components/Button";
import { Checkbox } from "@/features/ui/checkbox/components/Checkbox";
import { ImageSelectCircle } from "@/features/ui/imageselectcircle/components/ImageSelectCircle";
import { Input } from "@/features/ui/input/components/Input";
import { LinkButton } from "@/features/ui/linkbutton/components/LinkButton";
import { useMessageBox } from "@/features/ui/messagebox/hooks/useMessageBox";
import { Modal } from "@/features/ui/popovers/components/modal/Modal";
import { Tooltip } from "@/features/ui/popovers/components/tooltip/Tooltip";
import { PopoverDirection, PopoverDirections } from "@/features/ui/popovers/types/popover";
import { Select } from "@/features/ui/select/components/Select";
import Image from "next/image";
import { useMemo, useState } from "react";

export const UI = () => {
    // message boxes
    const box = useMessageBox();

    // modal states
    const [blur, setBlur] = useState<boolean>(false);
    const [direction, setDirection] = useState<PopoverDirection>("screen-middle");

    // react states
    const [image, setImage] = useState<string>("");

    // jsx
    return (
        <BentoSection
            src="/cubes.svg"
            text="UI"
            className="flex-row! items-center"
        >
            {box.render({
                children: "Focus-trapped + One line of code + Easy integration",
                onSelect: () => {},
            })}

            <div className="flex items-center justify-center w-full max-w-24">
                <ImageSelectCircle
                    containerClassName="w-full"
                    className="w-full aspect-square"
                    value={image}
                    onChange={(value) => {
                        if (value) {
                            setImage(URL.createObjectURL(value));
                        } else {
                            setImage("");
                        }
                    }}
                />
            </div>

            <ul className="w-full h-fit! gap-2 mx-auto! grid! auto-cols-fr grid-cols-2 sm:grid-cols-4">
                <li>
                    <Button className="w-full h-full">
                        <Image
                            alt=""
                            width={16}
                            height={16}
                            src="/click.svg"
                        />
                        Button
                    </Button>
                </li>

                <li>
                    <LinkButton
                        href="/home"
                        className="w-full h-full"
                    >
                        <Image
                            alt=""
                            width={16}
                            height={16}
                            src="/launch.svg"
                        />
                        LinkButton
                    </LinkButton>
                </li>

                <li>
                    <Checkbox className="w-full h-full">Checkbox</Checkbox>
                </li>

                <li>
                    <Input placeholder="Input..." />
                </li>

                <li>
                    <Select items={["Select", "Many", "Items", "At", "Once"]} />
                </li>

                <li>
                    <Button
                        className="w-full h-full"
                        onClick={box.show}
                    >
                        <div className="w-1 h-1 rounded-full bg-green-1" />
                        <Image
                            alt=""
                            width={16}
                            height={16}
                            src="/dashboard.svg"
                        />
                        Message Box
                    </Button>
                </li>

                <li>
                    <Tooltip
                        text="Single-line JSX for tooltips"
                        className="w-full h-full"
                    >
                        <Button className="w-full h-full">
                            <div className="w-1 h-1 rounded-full bg-blue-3" />
                            <Image
                                alt=""
                                width={16}
                                height={16}
                                src="/commentadd.svg"
                            />
                            Tooltip
                        </Button>
                    </Tooltip>
                </li>

                <li>
                    <Modal
                        className="w-full h-full"
                        direction={direction}
                        blur={blur}
                        element={(hide) => (
                            <ModalList
                                blur={blur}
                                direction={direction}
                                hide={hide}
                                onInteract={(res) => {
                                    switch (res.type) {
                                        case "blur": {
                                            setBlur(res.flag);
                                            break;
                                        }
                                        case "directions": {
                                            setDirection(res.direction);
                                            break;
                                        }
                                    }
                                }}
                            />
                        )}
                        tooltipClassName="w-screen max-w-81"
                    >
                        <Button className="w-full h-full">
                            <div className="w-1 h-1 rounded-full bg-blue-1" />
                            <Image
                                alt=""
                                width={16}
                                height={16}
                                src="/cube.svg"
                            />
                            Modal
                        </Button>
                    </Modal>
                </li>
            </ul>
        </BentoSection>
    );
};

type ListItem = {
    src: string;
    color: string;
    text: string;
    size?: number;
    type?: "nested" | "blur" | "directions";
};

type InteractFn = (arg: { type: "blur"; flag: boolean } | { type: "directions"; direction: PopoverDirection }) => void;

type ListProps = {
    blur: boolean;
    direction: PopoverDirection;
    hide: () => void;
    onInteract: InteractFn;
};

const ModalList = ({ blur, direction, hide, onInteract }: ListProps) => {
    const items = useMemo((): ListItem[] => {
        return [
            {
                src: "/link.svg",
                color: "var(--blue-1)",
                text: "Focus trapping",
            },
            {
                src: "/dash.svg",
                color: "var(--blue-3)",
                text: "Single-line",
            },
            {
                src: "/collapse.svg",
                color: "var(--orange-1)",
                text: `${PopoverDirections.length} directions`,
                size: 20,
                type: "directions",
            },
            {
                src: "/copy.svg",
                color: "var(--orange-3)",
                text: `Advanced nesting`,
                size: 14,
                type: "nested",
            },
            {
                src: "/drag.svg",
                color: "var(--red-1)",
                text: "Draggable & Closeable",
                size: 20,
            },
            {
                src: "/sun.svg",
                color: "var(--red-3)",
                text: "Portal-created",
                size: 14,
            },
            {
                src: "/cube.svg",
                color: "var(--green-3)",
                text: "Blur capability",
                size: 16,
                type: "blur",
            },
        ];
    }, []);

    return (
        <ul className="box acrylic p-4! gap-4!">
            <li>
                <span className="flex flex-col items-center">
                    <span className="flex items-center">
                        <div className="w-1 h-1 rounded-full bg-blue-1" />
                        <Image
                            alt=""
                            width={16}
                            height={16}
                            src="/cubes.svg"
                        />
                    </span>
                    <span>Features:</span>
                </span>
            </li>

            <li>
                <hr />
            </li>

            <li>
                <ul className="flex flex-col gap-1.5">
                    {items.map((item) => (
                        <li
                            className="box p-1! gap-2! flex-row! items-center loading"
                            key={item.text}
                        >
                            <span className="flex items-center gap-1 shrink-0">
                                <div
                                    className="box p-0! aspect-square bg-bg-2! flex-row! gap-0! items-center justify-center w-6! hover:blur-none! transition-all duration-500"
                                    style={item.type !== "blur" ? {} : { filter: "blur(1px)" }}
                                >
                                    <Image
                                        alt=""
                                        width={item.size || 16}
                                        height={item.size || 16}
                                        src={item.src}
                                    />
                                </div>

                                <div
                                    className="w-1 h-1 rounded-full"
                                    style={{ background: item.color }}
                                />

                                <span>{item.text}</span>
                            </span>

                            {(() => {
                                switch (item.type) {
                                    case "directions": {
                                        return (
                                            <Select
                                                items={[...PopoverDirections]}
                                                onChange={(item) =>
                                                    onInteract({
                                                        type: "directions",
                                                        direction: item as PopoverDirection,
                                                    })
                                                }
                                                className="items-center"
                                                value={direction}
                                            />
                                        );
                                    }
                                    case "nested": {
                                        return (
                                            <Modal
                                                className="ml-auto!"
                                                element={() => <ModalNested />}
                                            >
                                                <Button>
                                                    <div className="w-1 h-1 rounded-full bg-red-1" />
                                                    <Image
                                                        alt=""
                                                        width={16}
                                                        height={16}
                                                        src="/launch.svg"
                                                    />
                                                </Button>
                                            </Modal>
                                        );
                                    }
                                    case "blur": {
                                        return (
                                            <Checkbox
                                                onToggle={(flag) => {
                                                    onInteract({ type: "blur", flag });
                                                }}
                                                className="flex items-center w-fit! ml-auto"
                                                value={blur}
                                            >
                                                Toggle
                                            </Checkbox>
                                        );
                                    }
                                    default: {
                                        return null;
                                    }
                                }
                            })()}
                        </li>
                    ))}
                </ul>
            </li>
            <li>
                <hr />
            </li>

            <li className="w-full">
                <Button
                    onClick={hide}
                    className="w-full"
                >
                    <Image
                        alt=""
                        width={16}
                        height={16}
                        src="/send.svg"
                    />
                    OK
                </Button>
            </li>
        </ul>
    );
};

const ModalNested = () => {
    return (
        <div className="w-48! box p-4! gap-2!">
            <span className="flex flex-col items-center">
                <Image
                    alt=""
                    width={16}
                    height={16}
                    src="/cube.svg"
                />
                <span>Nested</span>
            </span>

            <hr />

            <Modal
                className="w-full"
                element={() => <ModalNested />}
            >
                <Button
                    className="w-full"
                    ref={(e) => {
                        if (e) {
                            e.focus();
                        }
                    }}
                >
                    <div className="w-1 h-1 rounded-full bg-green-1" />
                    <Image
                        alt=""
                        width={16}
                        height={16}
                        src="/click.svg"
                    />
                    Nest me!
                </Button>
            </Modal>
        </div>
    );
};
