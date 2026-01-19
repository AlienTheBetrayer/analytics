import { Tooltip } from "@/features/ui/popovers/components/tooltip/Tooltip";
import { Profile, User } from "@/types/tables/account";
import { useAppStore } from "@/zustand/store";

type Props = {
    data: { user: User; profile: Profile };
};

export const ColorSwatches = ({ data }: Props) => {
    // zustand
    const colors = useAppStore((state) => state.colors);

    if (!colors[data.user.id]?.length) {
        return null;
    }

    return (
        <ul className="flex">
            {colors[data.user.id].map((c) => (
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
