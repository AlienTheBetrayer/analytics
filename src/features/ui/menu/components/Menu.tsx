import { useState } from "react";
import { Button } from "../../button/components/Button";

type MenuItem = {
	title: string;
	element: React.ReactNode;
};

type Props = {
	items: MenuItem[];
};

export const Menu = ({ items }: Props) => {
	const [selectedItem, setSelectedItem] = useState<number>(0);

	return (
		<div className="flex flex-col bg-background-2 rounded-xl  grow">
			<ul className="p-2 flex items-center">
				{items.map((item, idx) => (
					<li key={item.title} className="w-full">
						<Button
							onClick={() => setSelectedItem(idx)}
							className={`w-full rounded-none outline-0! duration-300`}
						>
							{item.title}
						</Button>
					</li>
				))}
			</ul>

			<div className="grow">{items[selectedItem].element}</div>
		</div>
	);
};
