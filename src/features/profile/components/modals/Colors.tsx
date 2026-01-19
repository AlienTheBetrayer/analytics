/** biome-ignore-all lint/suspicious/noArrayIndexKey: <> */
import "./Colors.css";
import Image from "next/image";
import { Spinner } from "@/features/spinner/components/Spinner";
import { Button } from "@/features/ui/button/components/Button";
import { promiseStatus } from "@/utils/other/status";
import { useAppStore } from "@/zustand/store";
import { useColorModal } from "../../hooks/useColorModal";
import { Tooltip } from "@/features/popovers/components/tooltip/Tooltip";
import { Profile, User } from "@/types/tables/account";
import { useEffect } from "react";

export const COLORS_GRID_SIZE = 4;

type Props = {
    data: { profile: Profile; user: User };
};

export const Colors = ({ data }: Props) => {
    // zustand states
    const colors = useAppStore((state) => state.colors);
    const promises = useAppStore((state) => state.promises);
    const getUsers = useAppStore((state) => state.getUsers);

    // controller
    const controller = useColorModal(data);

    // fetching
    useEffect(() => {
        getUsers({ id: [data.user.id], select: ["colors"] });
    }, [data, getUsers]);

    return (
        <div
            className="box min-w-0!"
            tabIndex={-1}
        >
            <div className="flex w-full items-center justify-between">
                <span className="flex items-center w-full gap-1">
                    <Image
                        width={16}
                        height={16}
                        alt=""
                        src="/cube.svg"
                    />
                    Color panel
                </span>
                <span>
                    <small>(save your colors here)</small>
                </span>
            </div>

            <div className="grid md:grid-flow-col gap-4">
                {!colors[data.user.id] ? (
                    <div className="flex w-screen max-w-64">
                        <Spinner
                            styles="big"
                            className="m-auto"
                        />
                    </div>
                ) : (
                    <ul
                        className="grid gap-1 w-screen max-w-64 self-center"
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
                                    className="cursor-pointer outline-0 w-full h-full!"
                                />
                            </li>
                        ))}
                    </ul>
                )}

                <hr className="md:w-px! md:h-full! border-background-5!" />

                <ul className="flex flex-col gap-4 w-screen max-w-64 min-w-0">
                    <li className="flex flex-col w-fit gap-1">
                        <span>Actions</span>
                    </li>

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

                        <ul className="grid grid-cols-2 gap-2">
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
                                        Select
                                    </Button>
                                </Tooltip>
                            </li>

                            <li className="w-full *:w-full">
                                <Tooltip text="Clear the palette">
                                    <Button
                                        onClick={controller.clear}
                                        className="w-full"
                                    >
                                        <Image
                                            width={16}
                                            height={16}
                                            src="/cross.svg"
                                            alt=""
                                        />
                                        <u>Clear</u>
                                    </Button>
                                </Tooltip>
                            </li>
                        </ul>
                    </li>

                    <li className="w-full">
                        <Tooltip
                            className="w-full flex flex-col gap-1 "
                            text="Smoothness of colors"
                        >
                            <label
                                htmlFor="hue-rotation"
                                className="self-start"
                            >
                                Hue Rotation
                            </label>

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

                    <li>
                        <hr />
                    </li>

                    <li className="flex flex-col gap-1">
                        <span className="self-start">Selected:</span>
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

                    <li className="mt-auto!">
                        <hr />
                    </li>

                    <li className="w-full *:w-full">
                        <Tooltip text="Save your palette / color">
                            <Button
                                onClick={controller.apply}
                                className="w-full"
                            >
                                {promiseStatus(promises.colorsUpdate)}
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
