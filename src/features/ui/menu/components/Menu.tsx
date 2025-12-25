import { Button } from "../../button/components/Button";
import { useMenu } from "../hooks/useMenu";
import type { MenuItem } from "../types/menu";

type Props = {
	items: MenuItem[];
};

export const Menu = ({ items }: Props) => {
	// controller
	const controller = useMenu(items);

	return (
		<div className="flex flex-col grow">
			<ul className="p-2 flex items-center rounded-tl-xl rounded-tr-xl overflow-hidden">
				{items.map((item, idx) => (
					<li key={item.title} className="w-full">
						<Button
							ref={(el) => {
								controller.buttonRefs.current[idx] = el;
							}}
							onClick={() => controller.select(idx)}
							className={`w-full rounded-none outline-0! border-0! duration-300 bg-transparent! hover:bg-background-2! active:bg-background-3!`}
						>
							{item.title}
						</Button>
					</li>
				))}
				{controller.renderSelect()}
			</ul>

			<div className="grow">{controller.renderElement()}</div>
		</div>
	);
};
