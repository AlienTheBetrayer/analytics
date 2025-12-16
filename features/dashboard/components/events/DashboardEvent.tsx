import type { AnalyticsMetaType } from "@/app/types/database";
import { relativeTime } from "@/utils/relativeTime";
import "./DashboardEvent.css";

import { Spinner } from "@/features/spinner/components/Spinner";
import { Tooltip } from "@/features/tooltip/components/Tooltip";
import { Button } from "@/features/ui/button/components/Button";
import { useLocalStore } from "@/zustand/localStore";
import Image from "next/image";
import calendarImg from "../../../../public/calendar.svg";
import descriptionImg from "../../../../public/description.svg";
import typeImg from "../../../../public/type.svg";

type Props = {
	event: AnalyticsMetaType;
	onDelete?: (id: string) => void;
	isLoading?: boolean;
};

export const DashboardEvent = ({ event, onDelete, isLoading }: Props) => {
	// zustand
	const isLoggedIn = useLocalStore((state) => state.isLoggedIn);

	return (
		<Tooltip
			description={event.description ?? "No description"}
			title={event.type}
			direction="top"
			element={
				<Tooltip
					description="Delete this event"
					direction="top"
					isEnabled={isLoggedIn}
				>
					<Button isEnabled={isLoggedIn} onClick={() => onDelete?.(event.id)}>
						{isLoading && <Spinner />}
						Delete
					</Button>
				</Tooltip>
			}
		>
			<li className="dashboard-event relative gap-3 bg-linear-to-r from-background-1 to-background-2 rounded-3xl
            border-2 border-background-4 
            px-4! py-2! hover:brightness-200 duration-300 transition-all">
				<EventProperty eventType="Type" value={event.type} image={typeImg} />
				<EventProperty
					eventType="Description"
					value={event.description ?? "No description"}
					image={descriptionImg}
				/>
				<EventProperty
					eventType="When"
					value={relativeTime(event.created_at)}
					image={calendarImg}
				/>
				<Button
					className="delete-event-button"
					onClick={() => onDelete?.(event.id)}
					isEnabled={isLoggedIn}
				>
					{isLoading && <Spinner />}
					Delete
				</Button>

				<div className="absolute inset-0 grid place-items-center pointer-events-none select-none">
					<span className={`text-5xl! opacity-30 transition-all duration-300`}>
						<small>{event.type[0].toUpperCase()}</small>
					</span>
				</div>
			</li>
		</Tooltip>
	);
};

type PropertyProps = {
	eventType: string;
	value: string;
	className?: string;
	image?: string;
};

const EventProperty = ({
	eventType,
	value,
	image,
	className,
}: PropertyProps) => {
	return (
		<div className={`dashboard-event-element flex flex-col ${className ?? ""}`}>
			<span>
				<small className="flex items-center gap-1">
					{image && <Image className="image invert-70!" alt="" src={image} />}

					{eventType}
				</small>
			</span>
			<span>{value}</span>
		</div>
	);
};
