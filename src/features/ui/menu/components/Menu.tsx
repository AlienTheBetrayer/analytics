import { Tooltip } from "@/features/tooltip/components/Tooltip";
import { Button } from "../../button/components/Button";
import { LinkButton } from "../../linkbutton/components/LinkButton";
import { useMenu } from "../hooks/useMenu";
import type { MenuItem } from "../types/menu";

type Props = {
    items: MenuItem[];
    type?: "default" | "link";
    value?: number;
    color?: string;
};

export const Menu = ({ items, value, type = "default", color }: Props) => {
    // controller
    const controller = useMenu(items, value, type, color);

    return (
        <div className="flex flex-col grow h-full w-full gap-2">
            <ul className="flex items-center">
                {items.map((item, idx) => (
                    <li key={item.title ?? idx} className="w-full">
                        {type === "default" ? (
                            <Tooltip className='w-full' text={item.tooltip ?? item.title}>
                                <Button
                                    ref={(el) => {
                                        controller.buttonRefs.current[idx] = el;
                                    }}
                                    onClick={() => controller.select(idx)}
                                    className={`p-2! w-full rounded-none border-0! border-b-2!
                                    ${controller.selectedItem === idx ? "brightness-200" : ""}`}
                                >
                                    {item.titleElement}
                                </Button>
                            </Tooltip>
                        ) : (
                            <Tooltip className='w-full' text={item.tooltip ?? item.title}>
                                <LinkButton
                                    href={item.href ?? "/"}
                                    ref={(el) => {
                                        controller.buttonRefs.current[idx] = el;
                                    }}
                                    className={`p-2! rounded-none! border-0! border-b-2! 
                                    
                                ${controller.selectedItem === idx ? "brightness-200" : ""}`}
                                >
                                    {item.titleElement}
                                </LinkButton>
                            </Tooltip>
                        )}
                    </li>
                ))}
                {controller.renderSelect()}
            </ul>

            <div className="flex grow w-full">{controller.renderElement()}</div>
        </div>
    );
};
