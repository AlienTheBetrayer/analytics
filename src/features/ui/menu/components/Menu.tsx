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
			<ul className="p-2 flex items-center rounded-tl-xl rounded-tr-xl overflow-hidden">
				{items.map((item, idx) => (
					<li key={item.title} className="w-full">
						{type === "default" ? (
							<Button
								ref={(el) => {
									controller.buttonRefs.current[idx] = el;
								}}
								onClick={() => controller.select(idx)}
								className={`w-full rounded-none outline-0! border-0! duration-300 ease-out bg-transparent hover:bg-background-2! active:bg-background-3!
                                ${controller.selectedItem === idx ? "bg-background-1! brightness-200" : ""}`}
							>
								{item.title}
							</Button>
						) : (
							<LinkButton
								href={item.href ?? "/"}
								ref={(el) => {
									controller.buttonRefs.current[idx] = el;
								}}
								className={`w-full rounded-none outline-0! border-0! duration-300 ease-out focus-visible:bg-background-6! bg-transparent hover:bg-background-2! active:bg-background-3!
                                ${controller.selectedItem === idx ? "bg-background-3!" : ""}`}
							>
								{item.title}
							</LinkButton>
						)}
					</li>
				))}
				{controller.renderSelect()}
			</ul>

			<div className="flex grow w-full">{controller.renderElement()}</div>
		</div>
	);
};
