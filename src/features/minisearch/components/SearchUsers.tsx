import { Button } from "@/features/ui/button/components/Button";
import { Input } from "@/features/ui/input/components/Input";
import { PromiseState } from "@/promises/components/PromiseState";
import Image from "next/image";
import { useState } from "react";

type Props = {
    onSearch: (query: string) => void;
};
export const SearchUsers = ({ onSearch }: Props) => {
    const [search, setSearch] = useState<string>("");

    return (
        <form
            className="flex flex-col gap-2"
            onSubmit={(e) => {
                e.preventDefault();
                if (!search.trim().length) {
                    return;
                }

                onSearch(search);
            }}
        >
            <Input
                required
                placeholder="Search..."
                value={search}
                onChange={(value) => setSearch(value)}
            />
            <Button type="submit">
                <PromiseState state="miniSearch" />
                <Image
                    alt=""
                    width={16}
                    height={16}
                    src="/server.svg"
                />
                Fetch
            </Button>
        </form>
    );
};
