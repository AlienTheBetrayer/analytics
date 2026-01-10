import Image from "next/image";
import { Display } from "./Display";

export const Dashboard = () => {
    return (
        <div className="flex flex-col gap-2">
            <div className="flex flex-col items-center">
                <Image
                    alt=""
                    width={16}
                    height={16}
                    src="/book.svg"
                    className="invert-60!"
                />
                <span className="text-foreground-5!">Dashboard-only</span>
                <hr className="mt-4" />
            </div>

            <Display />
        </div>
    );
};
