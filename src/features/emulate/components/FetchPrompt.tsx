import { Button } from "@/features/ui/button/components/Button";
import { LinkButton } from "@/features/ui/linkbutton/components/LinkButton";
import { promiseStatus } from "@/utils/other/status";
import { useAppStore } from "@/zustand/store";
import Image from "next/image";

export const FetchPrompt = () => {
    // zustand state
    const promises = useAppStore((state) => state.promises);

    // zustand functions
    const sync = useAppStore((state) => state.sync);

    return (
        <div className="flex flex-col gap-4 p-6! rounded-4xl!">
            <div className="flex flex-col gap-2 items-center">
                <Image
                    alt=""
                    src="/prohibited.svg"
                    width={16}
                    height={16}
                />
                <span className="text-center text-foreground-2! text-5!">
                    Fetch required
                </span>
                <span className="text-center">
                    The project you were trying to access has <u>not</u> been
                    fetched yet. Check your <b>URL</b> or try to{" "}
                    <mark>re-fetch</mark> below and the project list will be
                    shown. If nothing helps, then the data is absent.
                </span>
            </div>

            <hr />
            <div className="flex flex-col gap-1">
                <Button
                    onClick={() => {
                        sync();
                    }}
                >
                    {promiseStatus(promises.sync)}
                    <Image
                        width={16}
                        height={16}
                        alt=""
                        src="/server.svg"
                    />
                    Fetch
                </Button>

                <LinkButton href="/dashboard">
                    <Image
                        width={16}
                        height={16}
                        alt=""
                        src="/dashboard.svg"
                    />
                    Go to dashboard
                </LinkButton>
            </div>
        </div>
    );
};
