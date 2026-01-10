import { DashboardNotification } from "@/types/zustand/dashboard";
import { AbsentNotification } from "../../errors/AbsentNotification";

type Props = {
    data: DashboardNotification | undefined;
};

export const Display = ({ data }: Props) => {
    if (!data) {
        return <AbsentNotification />;
    }

    return (
        <div>
            <div className="box">
                <span>{data.id}</span>
                <span>{data.status}</span>
                <span>{data.title}</span>
                <span>{data.description}</span>
            </div>
        </div>
    );
};
