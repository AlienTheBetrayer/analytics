import { DisplayFormat } from "@/features/posts/components/parts/listtopline/DisplayFormat";
import { Filtering } from "@/features/posts/components/parts/listtopline/Filtering";
import { Button } from "@/features/ui/button/components/Button";
import { Input } from "@/features/ui/input/components/Input";
import { Modal } from "@/features/ui/popovers/components/modal/Modal";
import { Tooltip } from "@/features/ui/popovers/components/tooltip/Tooltip";
import { Profile, User } from "@/types/tables/account";
import { TabSelection } from "@/utils/other/TabSelection";
import { useLocalStore } from "@/zustand/localStore";
import { useAppStore } from "@/zustand/store";
import Image from "next/image";

type Props = {
    data: { user: User; profile: Profile };
};

export const ListTopline = ({ data }: Props) => {
    // zustand & localstore
    const postFiltering = useAppStore((state) => state.postFiltering);
    const updatePostFiltering = useAppStore(
        (state) => state.updatePostFiltering,
    );
    const display = useLocalStore((state) => state.display);
    const toggleSorting = useLocalStore((state) => state.toggleSorting);
    const postIds = useAppStore((state) => state.postIds);

    const hasPost = !!(postIds[data.user.username]?.size ?? undefined);

    return (
        <ul
            className={`box rounded-full! flex-row! gap-1! h-10! p-0! items-center! ${!hasPost ? "opacity-30" : ""}`}
            inert={!hasPost}
        >
            <li className="absolute left-1/2 -translate-1/2 top-1/2">
                <span className="flex gap-1 items-center">
                    <div className="rounded-full w-1 h-1 bg-blue-1" />
                    <Image
                        width={16}
                        height={16}
                        alt=""
                        src="/book.svg"
                    />
                </span>
            </li>

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
                                transform: `rotate(${display.sorting.posts === "descendant" ? "0" : "180"}deg)`,
                            }}
                        />

                        <TabSelection
                            condition={true}
                            color={`var(${display.sorting.posts === "descendant" ? "--orange-1" : "--blue-1"}`}
                        />
                    </Button>
                </Tooltip>
            </li>

            <li>
                <Tooltip text="Filtering">
                    <Modal element={(hide) => <Filtering hide={hide} />}>
                        <Button className="aspect-square">
                            <Image
                                alt="filter"
                                src="/filter.svg"
                                width={16}
                                height={16}
                                className="duration-500! ease-out!"
                            />

                            <TabSelection
                                condition={true}
                                color={`var(${postFiltering.column === "Raw" ? "--orange-1" : "--blue-1"}`}
                            />
                        </Button>
                    </Modal>
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

            <li className="ml-auto!">
                <Tooltip text="Display format">
                    <Modal
                        element={(hide) => <DisplayFormat hide={hide} />}
                        direction="bottom-right"
                    >
                        <Button>
                            <Image
                                alt=""
                                width={16}
                                height={16}
                                src="/cubes.svg"
                            />
                        </Button>
                    </Modal>
                </Tooltip>
            </li>
        </ul>
    );
};
