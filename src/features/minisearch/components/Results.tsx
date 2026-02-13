import { MiniProfileDisplay } from "@/features/minisearch/components/MiniProfileDisplay";
import { NoFriends } from "@/features/minisearch/errors/NoFriends";
import { NoResults } from "@/features/minisearch/errors/NoResults";
import { useMiniSearch } from "@/features/minisearch/hooks/useMiniSearch";
import { MiniSearchData } from "@/features/minisearch/types/data";
import { Button } from "@/features/ui/button/components/Button";
import Image from "next/image";
import { useMemo, useState } from "react";

type Props = {
    type: "users" | "friends";
    view: "list" | "select";
    onSelect?: (users: MiniSearchData) => void;
    search: ReturnType<typeof useMiniSearch>;
};

export const Results = ({ type, view, onSelect, search }: Props) => {
    // view = select only
    const [selected, setSelected] = useState<Record<string, boolean>>({});
    const selectedToggled = useMemo(() => {
        return Object.entries(selected).flatMap((s) => (s[1] ? s[0] : []));
    }, [selected]);

    if (search.isLoading) {
        return (
            <div className="flex flex-col gap-2">
                {Array.from({ length: 4 }, (_, k) => (
                    <div
                        className="w-full h-8 loading"
                        key={k}
                    />
                ))}
            </div>
        );
    }

    if (!search.data) {
        return null;
    }

    if (!search.data.length) {
        return (
            <div className="flex items-center justify-center loading grow p-4">
                {type === "friends" ? <NoFriends /> : <NoResults />}
            </div>
        );
    }

    return (
        <ul className="flex flex-col gap-2">
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

            <hr />

            <Button
                onClick={() => {
                    console.log(selectedToggled);
                }}
            >
                <Image
                    alt=""
                    width={16}
                    height={16}
                    src="/imageadd.svg"
                />
                Add
                <small className="ml-1">({selectedToggled.length})</small>
            </Button>
        </ul>
    );
};
