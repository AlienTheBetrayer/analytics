/** biome-ignore-all lint/suspicious/noArrayIndexKey: <> */
import "./Colors.css";
import Image from "next/image";
import { Button } from "@/features/ui/button/components/Button";
import { useColorModal } from "../../hooks/useColorModal";
import { Tooltip } from "@/features/ui/popovers/components/tooltip/Tooltip";
import { PromiseState } from "@/promises/components/PromiseState";
import { CacheAPIProtocol } from "@/query-api/protocol";

export const COLORS_GRID_SIZE = 4;

type Props = {
    data: CacheAPIProtocol["user"]["data"];
};

export const Colors = ({ data }: Props) => {
    // controller
    const controller = useColorModal(data);

    return (
        <div className="relative box acrylic gap-4!">
            <ul className="box h-10! p-0! flex-row! w-full items-center!">
                <li className="absolute left-1/2 top-1/2 -translate-1/2">
                    <span className="flex items-center w-full gap-1">
                        <Image
                            width={16}
                            height={16}
                            alt=""
                            src="/cube.svg"
                        />
                    </span>
                </li>

                <li className="ml-auto!">
                    <Button
                        aria-label="clear colors"
                        onClick={controller.clear}
                    >
                        <Image
                            alt=""
                            width={16}
                            height={16}
                            src="/delete.svg"
                        />
                    </Button>
                </li>
            </ul>

            <div className="flex flex-col md:flex-row gap-4">
                <ul
                    className="grid gap-1 w-screen max-w-48 self-center"
                    style={{
                        gridTemplateColumns: `repeat(${COLORS_GRID_SIZE}, minmax(0, 1fr))`,
                    }}
                >
                    {Array.from({
                        length: COLORS_GRID_SIZE * COLORS_GRID_SIZE,
                    }).map((_, idx) => (
                        <li
                            key={idx}
                            className={`flex aspect-square ${controller.selectedId === idx ? "color-selected" : ""}`}
                        >
                            <input
                                value={controller.colors[idx]}
                                onChange={(e) =>
                                    controller.set(idx, e.target.value)
                                }
                                onClick={() => controller.select(idx)}
                                type="color"
                                className="cursor-pointer outline-0 w-full h-full! rounded-full"
                            />
                        </li>
                    ))}
                </ul>

                <ul className="flex flex-col gap-2 w-screen max-w-64 min-w-0">
                    <li className="flex flex-col items-center">
                        <span className="flex items-center gap-1">
                            <Image
                                alt=""
                                width={16}
                                height={16}
                                src="/type.svg"
                            />
                            <span>Actions</span>
                        </span>
                    </li>

                    <ul className="flex flex-col gap-2">
                        <li className="flex flex-col w-full *:w-full gap-1">
                            <Tooltip
                                className="w-full"
                                text="Create a palette"
                            >
                                <Button
                                    onClick={controller.palette}
                                    className="w-full"
                                >
                                    <Image
                                        width={16}
                                        height={16}
                                        src="/type.svg"
                                        alt=""
                                    />
                                    Generate a palette
                                </Button>
                            </Tooltip>
                        </li>

                        <li className="flex flex-col w-full *:w-full gap-1">
                            <Tooltip
                                className="w-full"
                                text="Select a random color"
                            >
                                <Button
                                    onClick={controller.randomSelect}
                                    className="w-full"
                                >
                                    <Image
                                        width={16}
                                        height={16}
                                        src="/random.svg"
                                        alt=""
                                    />
                                    Random Select
                                </Button>
                            </Tooltip>
                        </li>

                        <li className="w-full">
                            <Tooltip
                                className="w-full flex flex-col gap-1 "
                                text="Smoothness of colors"
                            >
                                <input
                                    id="hue-rotation"
                                    type="range"
                                    value={controller.hueRotation}
                                    min={0}
                                    max={8}
                                    step={0.01}
                                    onChange={(e) => {
                                        controller.setHueRotation(
                                            Number(e.target.value),
                                        );
                                    }}
                                />
                            </Tooltip>
                        </li>
                    </ul>

                    <li className="flex flex-col gap-1 items-center">
                        <span className="flex items-center gap-1">
                            <Image
                                alt=""
                                width={16}
                                height={16}
                                src="/select.svg"
                            />
                            <span>Selected:</span>
                        </span>
                        <div
                            className="w-full h-5 rounded-full"
                            style={{
                                background:
                                    controller.selectedId !== undefined
                                        ? controller.colors[
                                              controller.selectedId
                                          ]
                                        : "#000",
                            }}
                        ></div>
                    </li>

                    <li className="w-full *:w-full">
                        <Tooltip text="Save your palette / color">
                            <Button
                                onClick={controller.apply}
                                className="w-full"
                            >
                                <PromiseState state="colorsUpdate" />
                                <Image
                                    width={16}
                                    height={16}
                                    src="/cube.svg"
                                    alt=""
                                />
                                <mark>Apply changes</mark>
                            </Button>
                        </Tooltip>
                    </li>
                </ul>
            </div>
        </div>
    );
};
