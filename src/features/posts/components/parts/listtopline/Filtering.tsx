import { Button } from "@/features/ui/button/components/Button";
import { Checkbox } from "@/features/ui/checkbox/components/Checkbox";
import { PostFilteringColumn } from "@/types/zustand/posts";
import { useAppStore } from "@/zustand/store";
import Image from "next/image";

export const Filtering = () => {
    // zustand & localstore
    const postFiltering = useAppStore((state) => state.postFiltering);
    const updatePostFiltering = useAppStore(
        (state) => state.updatePostFiltering,
    );

    return (
        <div className="relative box p-4! gap-4! w-screen max-w-92 acrylic">
            <span className="flex flex-col items-center">
                <Image
                    alt="filter"
                    src="/filter.svg"
                    width={16}
                    height={16}
                />
                Filtering
            </span>

            <hr />

            <ul className="flex flex-col gap-1">
                {["Liked", "Edited", "With Images", "Raw"].map((tab) => (
                    <li key={tab}>
                        <Checkbox
                            value={postFiltering.column === tab}
                            onToggle={(flag) => {
                                updatePostFiltering({
                                    column: flag
                                        ? (tab as PostFilteringColumn)
                                        : undefined,
                                });
                            }}
                        >
                            {tab}
                        </Checkbox>
                    </li>
                ))}

                <li className="my-2!">
                    <hr />
                </li>

                <li className="w-full">
                    <Button
                        className="w-full"
                        onClick={() => {
                            updatePostFiltering({
                                column: undefined,
                            });
                        }}
                    >
                        <Image
                            alt=""
                            width={16}
                            height={16}
                            src="/delete.svg"
                        />
                        Delete filters
                    </Button>
                </li>
            </ul>
        </div>
    );
};
