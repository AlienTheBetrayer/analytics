import { Notification } from "@/types/other/notifications";
import Image from "next/image";

type Props = {
    data: Notification | undefined;
};

export const Topline = ({ data }: Props) => {
    return (
        <ul
            className={`box p-0! gap-1! flex-row! sticky! top-4 z-2 transition-all duration-300 h-10 min-h-10 items-center ${!data ? "opacity-30" : ""}`}
            inert={!data}
        >
            <li
                className="absolute flex gap-1 items-center left-1/2 top-1/2 -translate-1/2 transition-all duration-500"
                style={{ opacity: !data ? 0 : 1 }}
            >
                <Image
                    alt=""
                    width={16}
                    height={16}
                    src="/notification.svg"
                />
                <span>Notification</span>
            </li>

            <li
                className="select-none pointer-events-none transition-all duration-300 absolute inset-0 grid place-items-center z-1"
                style={{ opacity: data ? 0 : 1 }}
            >
                <span>
                    <mark>Select</mark> an existing notification to access
                </span>
            </li>
        </ul>
    );
};
