import { WrongURL } from "@/features/join/components/errors/WrongURL";
import { JoinView } from "@/features/join/components/JoinView";
import { useParams } from "next/navigation";

export const Select = () => {
    const { id } = useParams<{ id?: string }>();

    if (!id) {
        return (
            <div className="flex items-center justify-center p-4 grow bg-bg-1 rounded-4xl! loading">
                <WrongURL />
            </div>
        );
    }

    return (
        <div className="box grow p-0! overflow-hidden">
            <JoinView id={id} />
        </div>
    );
};
