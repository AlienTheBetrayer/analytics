import { useParams } from "next/navigation";
import { Button } from "@/features/ui/button/components/Button";
import { Input } from "@/features/ui/input/components/Input";
import Image from "next/image";
import { useAppStore } from "@/zustand/store";
import { promiseStatus } from "@/utils/status";
import { useRef, useState } from "react";
import { Tooltip } from "@/features/tooltip/components/Tooltip";
import { LinkButton } from "@/features/ui/linkbutton/components/LinkButton";

export const Controller = () => {
    // zustand state
    const data = useAppStore((state) => state.data);
    const promises = useAppStore((state) => state.promises);

    // zustand functions
    const emulateEvent = useAppStore((state) => state.emulateEvent);

    // url
    const { id } = useParams<{ id: string | undefined }>();

    // refs
    const formRef = useRef<HTMLFormElement | null>(null);

    // input states
    const [name, setName] = useState<string>("");
    const [eventType, setEventType] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [isValid, setIsValid] = useState<boolean>(false);
    const [emulationStatus, setEmulationStatus] = useState<boolean>(false);

    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
                <span className="text-center text-foreground-2! text-5!">Emulation</span>
                <span className="text-center">Enter data that will be sent to the database</span>
            </div>
            <div className="flex flex-col gap-2">
                <form
                    className="flex flex-col gap-2"
                    ref={formRef}
                    onInput={() => {
                        setIsValid(formRef.current?.checkValidity() ?? false);
                    }}
                    onSubmit={(e) => {
                        e.preventDefault();

                        const project_name = id === undefined ? name : data?.[id].project.name;
                        if (!project_name) {
                            return;
                        }

                        emulateEvent(project_name, eventType, description).then(() => {
                            setEmulationStatus(true);
                        });
                    }}
                >
                    {id === undefined && (
                        <>
                            <label htmlFor="custom-name" className="flex flex-wrap">
                                Custom project&apos;s name
                                <small className="ml-auto">
                                    (since you didn&apos;t select any)
                                </small>
                            </label>
                            <Input
                                id="custom-name"
                                placeholder="at least 8 characters"
                                required
                                minLength={8}
                                value={name}
                                onChange={(e) => setName(e)}
                            />
                        </>
                    )}

                    <label htmlFor="event-type" className="flex flex-wrap">
                        Event type
                        <small className="ml-auto">(page_view, effect_click, ...)</small>
                    </label>
                    <Input
                        id="event-type"
                        placeholder="at least 5 characters"
                        required
                        minLength={5}
                        value={eventType}
                        onChange={(e) => setEventType(e)}
                    />

                    <label htmlFor="description" className="flex flex-wrap">
                        Description
                        <small className="ml-auto">(optional)</small>
                    </label>
                    <Input
                        id="description"
                        placeholder="64 characters max"
                        value={description}
                        maxLength={64}
                        onChange={(e) => setDescription(e)}
                    />

                    <hr className="mt-8" />

                    <Tooltip className="w-full" text="Emulate an event" isEnabled={isValid}>
                        <Button type="submit" className="w-full" isEnabled={isValid}>
                            {promiseStatus(promises.emulate)}
                            <Image width={20} height={20} src="/send.svg" alt="" />
                            Send
                        </Button>
                    </Tooltip>
                </form>

                {emulationStatus && (
                    <>
                        <hr />
                        <Tooltip className="w-full" text="Go back to the dashboard" direction="top">
                            <LinkButton className="w-full" href='/dashboard'>
                                <Image width={16} height={16} src="/launch.svg" alt="" />
                                View changes
                            </LinkButton>
                        </Tooltip>
                    </>
                )}
            </div>
        </div>
    );
};
