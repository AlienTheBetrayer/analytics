import { Button } from "@/features/ui/button/components/Button";
import { Input } from "@/features/ui/input/components/Input";
import { Tooltip } from "@/features/ui/popovers/components/tooltip/Tooltip";
import Image from "next/image";
import { redirect, useParams } from "next/navigation";
import { useCallback, useState } from "react";

export const SearchButton = () => {
    // url states
    const { query } = useParams<{ query?: string }>();

    // react states
    const [isFocused, setIsFocused] = useState<boolean>(false);
    const [search, setSearch] = useState<string>(query ?? "");

    const querySearch = useCallback(() => {
        if (!search.trim().length) {
            return;
        }

        redirect(`/search/${search}`);
    }, [search]);

    return (
        <Input
            className="rounded-r-none"
            value={search}
            onChange={(value) => setSearch(value)}
            placeholder="Search..."
            autocomplete={["*", "warlock"]}
            onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                switch (e.code) {
                    case "Enter": {
                        querySearch();
                        break;
                    }
                }
            }}
            container={{
                style: {
                    height: "100%",
                    transition: `300ms ease-out`,
                    width: isFocused ? "100%" : "75%",
                },
                onFocus: () => {
                    setIsFocused(true);
                },
                onBlur: () => {
                    setIsFocused(false);
                },
            }}
        >
            <Tooltip
                text="Search available users"
                className="absolute left-full h-full"
            >
                <Button
                    className="rounded-l-none! border-l-0! border-2! h-full! aspect-square p-0!"
                    onClick={querySearch}
                >
                    <Image
                        alt="search"
                        width={16}
                        height={16}
                        src="/pencil.svg"
                    />
                </Button>
            </Tooltip>
        </Input>
    );
};
