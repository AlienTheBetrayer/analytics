import { Button } from "@/features/ui/button/components/Button";
import { Input } from "@/features/ui/input/components/Input";
import { Tooltip } from "@/features/ui/popovers/components/tooltip/Tooltip";
import { TabSelection } from "@/utils/other/TabSelection";
import Image from "next/image";

export const ListTopline = () => {
    return (
        <ul className="box rounded-full! flex-row! gap-1! h-10! py-0!">
            <li>
                <Tooltip text="Sorting direction">
                    <Button className="aspect-square">
                        <Image
                            alt="sort"
                            src="/sort.svg"
                            width={16}
                            height={16}
                        />

                        <TabSelection
                            condition={true}
                            color="var(--blue-1)"
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

                    />
                </Tooltip>
            </li>
        </ul>
    );
};
