import { useParams } from "next/navigation";
import { Button } from "@/features/ui/button/components/Button";
import { Input } from "@/features/ui/input/components/Input";
import Image from "next/image";
import { useRef, useState } from "react";
import { Tooltip } from "@/features/ui/popovers/components/tooltip/Tooltip";
import { LinkButton } from "@/features/ui/linkbutton/components/LinkButton";
import { wrapPromise } from "@/promises/core";
import { PromiseState } from "@/promises/components/PromiseState";
import { dashboardEmulateEvents } from "@/query-api/calls/dashboard";
import { CacheAPIProtocol } from "@/query-api/protocol";
import { useQuery } from "@/query/core";

type Props = {
    data: CacheAPIProtocol["projects"]["data"];
};

export const Controller = ({ data }: Props) => {
    // url
    const { id } = useParams<{ id: string | undefined }>();

    // refs
    const formRef = useRef<HTMLFormElement | null>(null);

    // fetching
    const { data: status } = useQuery({ key: ["status"] });

    // input states
    const [name, setName] = useState<string>("");
    const [eventType, setEventType] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [isValid, setIsValid] = useState<boolean>(false);
    const [emulationStatus, setEmulationStatus] = useState<boolean>(false);

    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
                <span className="text-center text-foreground-2! text-5!">
                    Emulation
                </span>
                <span className="text-center">
                    Enter data that will be sent to the database
                </span>
            </div>

            <div className="flex flex-col gap-2">
                <form
                    className={`flex flex-col gap-2 ${!status || status?.role === "user" ? "opacity-30" : ""}`}
                    inert={!status || status?.role === "user"}
                    ref={formRef}
                    onInput={() => {
                        setIsValid(formRef.current?.checkValidity() ?? false);
                    }}
                    onSubmit={(e) => {
                        e.preventDefault();

                        const project_name = !id ? name : data[id]?.name;
                        if (!project_name) {
                            return;
                        }

                        wrapPromise("emulateEvents", () => {
                            setEmulationStatus(true);
                            return dashboardEmulateEvents({
                                project_name,
                                event_type: eventType,
                                description,
                            });
                        });
                    }}
                >
                    {!id && (
                        <>
                            <label
                                htmlFor="custom-name"
                                className="flex whitespace-nowrap"
                            >
                                Custom project&apos;s name
                                <small className="text-ellipsis-left ml-auto">
                                    (since you didn&apos;t select any)
                                </small>
                            </label>
                            <Input
                                id="custom-name"
                                placeholder="at least 8 characters"
                                required
                                minLength={8}
                                maxLength={40}
                                value={name}
                                onChange={(e) => setName(e)}
                            />
                        </>
                    )}

                    <label
                        htmlFor="event-type"
                        className="flex whitespace-nowrap"
                    >
                        Event type
                        <small className="text-ellipsis-left ml-auto">
                            (page_view, effect_click, other)
                        </small>
                    </label>
                    <Input
                        id="event-type"
                        placeholder="at least 5 characters"
                        required
                        maxLength={40}
                        minLength={5}
                        value={eventType}
                        onChange={(e) => setEventType(e)}
                    />

                    <label
                        htmlFor="description"
                        className="flex whitespace-nowrap"
                    >
                        Description
                        <small className="text-ellipsis-left ml-auto">
                            (optional)
                        </small>
                    </label>
                    <Input
                        id="description"
                        placeholder="64 characters max"
                        value={description}
                        maxLength={64}
                        onChange={(e) => setDescription(e)}
                    />

                    <hr className="mt-8" />

                    <Tooltip
                        className="w-full"
                        text="Emulate an event"
                        isEnabled={isValid}
                    >
                        <Button
                            type="submit"
                            className="w-full"
                            isEnabled={isValid}
                        >
                            <PromiseState state="emulateEvents" />
                            <Image
                                width={16}
                                height={16}
                                src="/cubeadd.svg"
                                alt=""
                            />
                            Emulate
                        </Button>
                    </Tooltip>
                </form>

                {emulationStatus && (
                    <>
                        <hr />
                        <Tooltip
                            className="w-full"
                            text="Go back to the dashboard"
                            direction="top"
                        >
                            <LinkButton
                                className="w-full"
                                href="/dashboard"
                            >
                                <Image
                                    width={16}
                                    height={16}
                                    src="/launch.svg"
                                    alt=""
                                />
                                View changes
                            </LinkButton>
                        </Tooltip>
                    </>
                )}
            </div>
        </div>
    );
};
