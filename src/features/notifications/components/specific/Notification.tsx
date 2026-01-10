import { DashboardNotification } from "@/types/zustand/dashboard";

type Props = {
    data: DashboardNotification;
};

export const Notification = ({ data }: Props) => {
    return (
        <article className="box">
            <span>{data.id}</span>
            <span>{data.status}</span>
            <span>{data.title}</span>
            <span>{data.description}</span>
        </article>
    );
};
