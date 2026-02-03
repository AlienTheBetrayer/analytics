import { Tooltip } from "@/features/ui/popovers/components/tooltip/Tooltip";
import { CacheAPIProtocol } from "@/query-api/protocol";
import { useQuery } from "@/query/core";

type Props = {
    data: CacheAPIProtocol["user"]["data"];
};

export const ColorSwatches = ({ data }: Props) => {
    // fetching
    const { data: colors } = useQuery({ key: ["colors", data.id] });

    if (!colors?.length) {
        return null;
    }

    return (
        <ul className="flex">
            {colors.map((c) => (
                <li
                    className="px-px!"
                    key={`${c.slot}${c.color}`}
                >
                    <Tooltip
                        direction="top"
                        element={
                            <div className="box p-4!">
                                <div
                                    style={{ background: c.color }}
                                    className="w-8 h-8 rounded-xl"
                                />
                            </div>
                        }
                    >
                        <div
                            className="w-2.25 h-2.25 rounded-full transition-all duration-300 hover:scale-150"
                            style={{ background: c.color }}
                        />
                    </Tooltip>
                </li>
            ))}
        </ul>
    );
};
