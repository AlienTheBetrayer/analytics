import { Button } from "@/features/ui/button/components/Button";
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
            <Button onClick={onInteract} className='bg-background-1! hover:bg-background-2! active:bg-background-3! outline-0!'>
                <small>
                    Close
                </small>
            </Button>
		</div>
	);
};
