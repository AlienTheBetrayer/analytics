import { Button } from "@/features/ui/button/components/Button";
import { LinkButton } from "@/features/ui/linkbutton/components/LinkButton";
import { PromiseState } from "@/promises/components/PromiseState";
import { wrapPromise } from "@/promises/core";
import { dashboardSync } from "@/query-api/calls/dashboard";
import Image from "next/image";

export const FetchPrompt = () => {
    return (
        <div className="flex flex-col gap-4 rounded-4xl!">
            <div className="flex flex-col gap-2 items-center max-w-xl mx-auto">
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
                        wrapPromise("dashboardSync", () => {
                            return dashboardSync({});
                        });
                    }}
                >
                    <PromiseState state="dashboardSync" />
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
