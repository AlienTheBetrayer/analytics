import { NoInvitation } from "@/features/join/components/errors/NoInvitation";
import { NotAuthenticated } from "@/features/join/components/errors/NotAuthenticated";
import { WrongURL } from "@/features/join/components/errors/WrongURL";
import { JoinDisplay } from "@/features/join/components/JoinDisplay";
import { Spinner } from "@/features/ui/spinner/components/Spinner";
import { useQuery } from "@/query/core";
import Image from "next/image";
import { useParams } from "next/navigation";

export const JoinView = () => {
    // url
    const { id } = useParams<{ id?: string }>();

    // fetching
    const { data: status } = useQuery({
        key: ["status"],
    });
    const { data, isLoading } = useQuery({
        key: ["invitation", id, status?.id ?? null],
    });

    let error: "id" | "data" | "status" | "loading" | undefined = undefined;

    if (isLoading) {
        error = "loading";
    } else if (!id) {
        error = "id";
    } else if (!status) {
        error = "status";
    } else if (!data) {
        error = "data";
    }

    if (error) {
        return (
            <div className="flex flex-col items-center gap-4 p-4 grow bg-bg-1 rounded-4xl!">
                <span className="flex items-center gap-1 mx-auto">
                    <div className="w-1 h-1 rounded-full bg-red-1" />
                    <Image
                        alt=""
                        width={16}
                        height={16}
                        src="/send.svg"
                    />
                    Invitation
                </span>

                <div className="flex flex-col gap-2 items-center justify-center loading rounded-4xl p-4 grow w-full">
                    {(() => {
                        switch (error) {
                            case "loading": {
                                return <Spinner />;
                            }
                            case "id": {
                                return <WrongURL />;
                            }
                            case "data": {
                                return <NoInvitation />;
                            }
                            case "status": {
                                return <NotAuthenticated />;
                            }
                        }
                    })()}
                </div>
            </div>
        );
    }

    if (!data) {
        return null;
    }

    return (
        <div className="flex flex-col items-center gap-4 grow">
            <JoinDisplay data={data} />
        </div>
    );
};
