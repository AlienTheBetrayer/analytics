import Image from "next/image";
import { Tooltip } from "@/features/tooltip/components/Tooltip";
import { useAppStore } from "@/zustand/store";
import downloadImg from "../../../public/download.svg";
import serverImg from "../../../public/server.svg";
import { Button } from "../../ui/button/components/Button";

export const Topline = () => {
	// zustand
	const status = useAppStore((state) => state.status);

	return (
		<nav className="flex flex-col items-center gap-2">
			<div className="flex gap-1 w-full items-center">
				<Image src={serverImg} alt="" className="image w-5! h-5!" />
				<span>Client</span>
			</div>

			<div className="flex gap-2 w-full">
				<span className="flex gap-1 items-center">
					<div
						className={`rounded-full w-1.5 h-1.5 ${status?.isLoggedIn !== null ? "bg-[rgb(56,66,255)]" : "bg-red-500"} duration-1000`}
					/>
					{status?.isLoggedIn === null ? "Syncing..." : "Synced"}
				</span>

				<Tooltip description="Re-sync all data" className="ml-auto">
					<Button>
						<Image src={downloadImg} alt="" className="image" />
						<mark>Sync</mark>
					</Button>
				</Tooltip>
			</div>
		</nav>
	);
};
