import { Tooltip } from "@/features/tooltip/components/Tooltip";
import { Button } from "@/features/ui/button/components/Button";
import Image from "next/image";
import closeImg from "../../../public/close.svg";
import type { NotificationData } from "./Notification";

type Props = {
	data: NotificationData;
	onInteract?: () => void;
};

export const NotificationTopline = ({ data, onInteract }: Props) => {
	return (
		<div className="flex items-center justify-between px-4 py-1 border-b border-b-background-3">
			<h4>
				{data.type[0].toUpperCase()}
				{data.type.slice(1)}
			</h4>
			<Tooltip description="Hide notification" direction="top">
				<Button
					onClick={onInteract}
					className="bg-background-1! hover:bg-background-2! active:bg-background-3! outline-0!"
				>
					<Image className="image" alt="" src={closeImg} />
					<small>Close</small>
				</Button>
			</Tooltip>
		</div>
	);
};
