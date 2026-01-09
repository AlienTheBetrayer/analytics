import { Tooltip } from "@/features/tooltip/components/Tooltip";
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
        <ul className="flex gap-0.75">
            {colors[data.user.id].map((c) => (
                <Tooltip
                    key={`${c.slot}${c.color}`}
                    direction="top"
                    disabledPointer={false}
                    element={
                        <div className="box p-4!">
                            <div style={{ background: c.color }} className='w-8 h-8 rounded-xl'/>
                        </div>
                    }
                >
                    <li
                        className="w-2 h-2 rounded-full transition-all duration-300 hover:scale-150"
                        style={{ background: c.color }}
                    />
                </Tooltip>
            ))}
        </ul>
    );
};
