import { LinkButton } from "@/features/ui/linkbutton/components/LinkButton";
import { TabSelection } from "@/utils/other/TabSelection";
import Image from "next/image";
import { useParams } from "next/navigation";

export const Topline = () => {
    const { tab, id } = useParams<{ tab?: string; id?: string }>();

    return (
        <ul className="w-full max-w-400 mx-auto! box p-0! h-10! flex-row! my-2! gap-1!">
            <li className="absolute left-1/2 top-1/2 -translate-1/2 flex items-center gap-1">
                <div className="w-1 h-1 bg-blue-1 rounded-full" />
                <Image
                    alt=""
                    width={16}
                    height={16}
                    src="/phone.svg"
                />
            </li>

            <li>
                <LinkButton
                    href="/home"
                    ariaLabel="home"
                >
                    <Image
                        alt=""
                        width={16}
                        height={16}
                        src="/cube.svg"
                    />
                </LinkButton>
            </li>

            <li className="ml-auto!">
                <ul className="flex items-center gap-1">
                    <li>
                        <LinkButton
                            href="/contact/send"
                            ariaLabel="send"
                        >
                            <Image
                                alt=""
                                width={16}
                                height={16}
                                src="/send.svg"
                            />
                            Send
                            <TabSelection
                                condition={tab === "send"}
                                color="var(--blue-1)"
                            />
                        </LinkButton>
                    </li>

                    <li>
                        <LinkButton
                            href="/contact/list"
                            ariaLabel="list"
                        >
                            <Image
                                alt=""
                                width={16}
                                height={16}
                                src="/cubes.svg"
                            />
                            List
                            <TabSelection
                                condition={!tab || tab === "list"}
                                color="var(--blue-1)"
                            />
                        </LinkButton>
                    </li>
                </ul>
            </li>
        </ul>
    );
};
