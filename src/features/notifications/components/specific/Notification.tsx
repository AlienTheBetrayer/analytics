import { DashboardNotification } from "@/types/zustand/dashboard";

type Props = {
    data: DashboardNotification;
}

export const Notification = ({ data }: Props) => {
    return (
        <article className="box">
            {data.id}
        </article>
    )
}