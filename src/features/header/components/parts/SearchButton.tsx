import { Button } from "@/features/ui/button/components/Button";
import { Input } from "@/features/ui/input/components/Input";
import Image from "next/image";
import { redirect } from "next/navigation";
import { useCallback, useState } from "react";

export const SearchButton = () => {
    // react states
    const [isFocused, setIsFocused] = useState<boolean>(false);
    const [search, setSearch] = useState<string>("");

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
            onKeyDown={(e) => {
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
            <Button
                className="absolute rounded-l-none! left-full border-l-0! h-full aspect-square p-0!"
                onClick={querySearch}
            >
                <Image
                    alt="search"
                    width={16}
                    height={16}
                    src="/pencil.svg"
                />
            </Button>
        </Input>
    );
};
