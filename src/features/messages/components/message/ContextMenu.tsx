import "./ContextMenu.css";
import { Button } from "@/features/ui/button/components/Button";
import Image from "next/image";

export const ContextMenu = () => {
    return (
        <ul className="box acrylic p-4! rounded-2xl! gap-1! **:border-0! w-screen max-w-55 message-ctx">
            <li className="mt-6!">
                <Button>
                    <Image
                        alt=""
                        width={16}
                        height={16}
                        src="/back.svg"
                    />
                    <span>Reply</span>
                </Button>
            </li>

            <li>
                <Button>
                    <Image
                        alt=""
                        width={16}
                        height={16}
                        src="/pencil.svg"
                    />
                    <span>Edit</span>
                </Button>
            </li>

            <li>
                <Button>
                    <Image
                        alt=""
                        width={16}
                        height={16}
                        src="/pin.svg"
                    />
                    <span>Pin</span>
                </Button>
            </li>

            <li>
                <Button>
                    <Image
                        alt=""
                        width={16}
                        height={16}
                        src="/copy.svg"
                    />
                    <span>Copy</span>
                </Button>
            </li>

            <li>
                <Button>
                    <Image
                        alt=""
                        width={16}
                        height={16}
                        src="/back.svg"
                        className="-scale-x-100"
                    />
                    <span>Forward</span>
                </Button>
            </li>

            <li>
                <Button>
                    <Image
                        alt=""
                        width={16}
                        height={16}
                        src="/delete.svg"
                    />
                    <span>Delete</span>
                </Button>
            </li>

            <li>
                <Button>
                    <Image
                        alt=""
                        width={16}
                        height={16}
                        src="/select.svg"
                    />
                    <span>Select</span>
                </Button>
            </li>
        </ul>
    );
};
