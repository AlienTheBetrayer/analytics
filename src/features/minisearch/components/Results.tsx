import { MiniProfileDisplay } from "@/features/minisearch/components/MiniProfileDisplay";
import { NoFriends } from "@/features/minisearch/errors/NoFriends";
import { NoResults } from "@/features/minisearch/errors/NoResults";
import { useMiniSearch } from "@/features/minisearch/hooks/useMiniSearch";
import { Button } from "@/features/ui/button/components/Button";
import { PromiseState } from "@/promises/components/PromiseState";
import Image from "next/image";
import { useMemo, useState } from "react";

type Props = {
    type: "users" | "friends";
    view: "list" | "select";
    onSelect?: (ids: string[]) => void;
    search: ReturnType<typeof useMiniSearch>;
    promiseState?: string;
    isEnabled?: boolean;
    required?: boolean;
    text?: string;
};

export const Results = ({
    type,
    view,
    onSelect,
    search,
    isEnabled,
    required,
    text,
    promiseState,
}: Props) => {
    // view = select only
    const [selected, setSelected] = useState<Record<string, boolean>>({});
    const selectedToggled = useMemo(() => {
        return Object.entries(selected).flatMap((s) => (s[1] ? s[0] : []));
    }, [selected]);

    if (search.isLoading) {
        return (
            <div className="flex flex-col gap-2 justify-between grow">
                {Array.from({ length: 5 }, (_, k) => (
                    <div
                        className="w-full h-8 loading"
                        key={k}
                    />
                ))}
            </div>
        );
    }

    if (!search.data) {
        return (
            <span className="flex flex-col gap-1 m-auto items-center">
                <Image
                    alt=""
                    width={16}
                    height={16}
                    src="/type.svg"
                />
                <span>
                    <mark>Results</mark> will appear here
                </span>
            </span>
        );
    }

    if (!search.data.length) {
        return (
            <div className="flex items-center justify-center loading grow p-4">
                {type === "friends" ? <NoFriends /> : <NoResults />}
            </div>
        );
    }

    return (
        <ul className="flex flex-col gap-2 grow">
            {search.data.map((d) => (
                <li key={d.id}>
                    {view === "list" ? (
                        <MiniProfileDisplay
                            data={d}
                            view="list"
                        />
                    ) : (
                        <MiniProfileDisplay
                            data={d}
                            view={view}
                            value={selected[d.id]}
                            onSelect={(flag) =>
                                setSelected((prev) => ({
                                    ...prev,
                                    [d.id]: flag,
                                }))
                            }
                        />
                    )}
                </li>
            ))}

            {view === "select" && (
                <>
                    <li className="mt-auto!">
                        <hr />
                    </li>

                    <li className="w-full">
                        <Button
                            className="w-full"
                            isEnabled={
                                isEnabled !== false &&
                                (!required ? true : !!selectedToggled.length)
                            }
                            onClick={() => onSelect?.(selectedToggled)}
                        >
                            {promiseState && (
                                <PromiseState state={promiseState} />
                            )}
                            <Image
                                alt=""
                                width={16}
                                height={16}
                                src="/imageadd.svg"
                            />
                            {text ?? "Add"}
                            {!!selectedToggled.length && (
                                <small className="ml-1">
                                    ({selectedToggled.length})
                                </small>
                            )}
                        </Button>
                    </li>
                </>
            )}
        </ul>
    );
};
