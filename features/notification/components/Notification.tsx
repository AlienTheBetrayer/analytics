import { type HTMLMotionProps, motion } from "motion/react";
import { NotificationMain } from "./NotificationMain";
import { NotificationTopline } from "./NotificationTopline";

type NotificationType = "error" | "warning" | "information";

export type NotificationData = {
	type: NotificationType;
	content: string;
};

type Props = {
	data: NotificationData;
	onInteract?: () => void;
} & HTMLMotionProps<"div">;

export const Notification = ({
	data,
	className,
	onInteract,
	...rest
}: Props) => {
	const outline = () => {
		switch (data.type) {
			case "error":
				return "hsl(0,50%,50%)";
			case "information":
				return "hsl(240,50%,50%)";
			case "warning":
				return "hsl(39,50%,50%)";
		}
	};

	return (
		<motion.div
			initial={{ opacity: 0, y: 200 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: 200 }}
			transition={{ ease: "backInOut", duration: 0.8 }}
			className={`flex flex-col fixed bottom-4 right-4 h-38 min-w-64 bg-background-a-1 outline-1 rounded-xl backdrop-blur-[2px] z-9999 ${className ?? ""}`}
			style={{ outlineColor: outline() }}
			{...rest}
		>
			<NotificationTopline data={data} onInteract={onInteract} />
			<NotificationMain data={data} />
		</motion.div>
	);
};
