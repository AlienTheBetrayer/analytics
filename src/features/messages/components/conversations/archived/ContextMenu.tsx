import "../../message/ContextMenu.css";
import { Button } from "@/features/ui/button/components/Button";
import Image from "next/image";

export const ContextMenu = () => {
    return (
        <ul className="box acrylic p-4! rounded-2xl! gap-1! **:border-0! w-screen max-w-64 message-ctx">
            <li className="flex items-center gap-1 mb-6! self-center">
                <div className="w-1 h-1 rounded-full bg-blue-1" />
                <Image
                    alt=""
                    width={16}
                    height={16}
                    src="/archive.svg"
                />
            </li>

            <li>
                <Button>
                    <Image
                        alt=""
                        width={20}
                        height={20}
                        src="/collapse.svg"
                    />
                    <span>Collapse</span>
                </Button>
            </li>

            <li>
                <Button>
                    <Image
                        alt=""
                        width={16}
                        height={16}
                        src="/menu.svg"
                    />
                    <span>Move to main menu</span>
                </Button>
            </li>
        </ul>
    );
};
