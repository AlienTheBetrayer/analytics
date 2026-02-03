import { Tooltip } from "@/features/ui/popovers/components/tooltip/Tooltip";
import { Button } from "@/features/ui/button/components/Button";
import { LinkButton } from "@/features/ui/linkbutton/components/LinkButton";
import Image from "next/image";
import { queryInvalidate } from "@/query/auxiliary";
import { useParams } from "next/navigation";
import { wrapPromise } from "@/promises/core";
import { PromiseState } from "@/promises/components/PromiseState";
import { AbsentData } from "@/features/ui/absentdata/components/AbsentData";

export const NoResults = () => {
    // url
    const { query } = useParams<{ query?: string }>();

    return (
        <AbsentData
            title={
                <>
                    <u>No</u> users found
                </>
            }
            description={
                <>
                    The query you have prompted seems <mark>valid</mark>, but we
                    have <u>not</u> found any users with it, try <b>changing</b>{" "}
                    the query to something else, either you messed up or the
                    user actually does not exist
                </>
            }
        >
            <>
                <Tooltip
                    text="Attempt a re-fetch"
                    className="w-full"
                    isEnabled={!!query?.trim().length}
                >
                    <Button
                        className="w-full"
                        onClick={() => {
                            if (!query?.trim().length) {
                                return;
                            }

                            wrapPromise("noResultsSearch", async () => {
                                return queryInvalidate({
                                    key: ["search", query],
                                });
                            });
                        }}
                    >
                        <PromiseState state="noResultsSearch" />
                        <Image
                            width={16}
                            height={16}
                            alt=""
                            src="/server.svg"
                        />
                        Re-fetch
                    </Button>
                </Tooltip>

                <LinkButton
                    className="w-full"
                    href="/home"
                >
                    <Image
                        width={16}
                        height={16}
                        alt=""
                        src="/cube.svg"
                    />
                    Home
                </LinkButton>
            </>
        </AbsentData>
    );
};
