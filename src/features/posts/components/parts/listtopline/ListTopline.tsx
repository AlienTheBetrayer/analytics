import { Button } from "@/features/ui/button/components/Button";
import { Input } from "@/features/ui/input/components/Input";
import { Tooltip } from "@/features/ui/popovers/components/tooltip/Tooltip";
import { TabSelection } from "@/utils/other/TabSelection";
import { useLocalStore } from "@/zustand/localStore";
import { useAppStore } from "@/zustand/store";
import Image from "next/image";

export const ListTopline = () => {
    // zustand & localstore
    const postFiltering = useAppStore((state) => state.postFiltering);
    const updatePostFiltering = useAppStore(
        (state) => state.updatePostFiltering,
    );
    const sorting = useLocalStore((state) => state.sorting);
    const toggleSorting = useLocalStore((state) => state.toggleSorting);

    return (
        <ul className="box rounded-full! flex-row! gap-1! h-10! p-0! items-center!">
            <li>
                <Tooltip text="Sorting direction">
                    <Button
                        className="aspect-square"
                        onClick={() => {
                            toggleSorting("posts");
                        }}
                    >
                        <Image
                            alt="sort"
                            src="/sort.svg"
                            width={16}
                            height={16}
                            className="duration-500! ease-out!"
                            style={{
                                transform: `rotate(${sorting.posts === "descendant" ? "0" : "180"}deg)`,
                            }}
                        />

                        <TabSelection
                            condition={true}
                            color={`var(${sorting.posts === "descendant" ? "--orange-1" : "--blue-1"}`}
                        />
                    </Button>
                </Tooltip>
            </li>

            <li className="self-stretch flex items-center">
                <hr className="w-px! h-1/3 bg-background-6" />
            </li>

            <li>
                <Tooltip text="Filters every field">
                    <Input
                        className="rounded-full!"
                        placeholder="Filter..."
                        value={postFiltering.filter}
                        onChange={(filter) => {
                            updatePostFiltering({ filter });
                        }}
                    />
                </Tooltip>
            </li>
        </ul>
    );
};
