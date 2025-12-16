import { Spinner } from "@/features/spinner/components/Spinner";
import { Tooltip } from "@/features/tooltip/components/Tooltip";
import { Button } from "@/features/ui/button/components/Button";
import Image from "next/image";
import downloadImg from "../../../public/download.svg";
import serverImg from "../../../public/server.svg";
import { useDashboardContext } from "../context/DashboardContext";
import type { useData } from "../hooks/useData";

type Props = {
	controller: ReturnType<typeof useData>;
};

export const DashboardTopline = ({ controller }: Props) => {
	const [, dispatch] = useDashboardContext();

	const statusText = () => {
		if (controller.data !== null) {
			if (controller.hasErrored === true) {
				return "Failed";
			} else {
				return "Synced";
			}
		} else {
			if (controller.hasErrored === true) {
				return "Fixing...";
			} else {
				return "Fetching...";
			}
		}
	};

	return (
		<div className="w-full flex relative flex-col border-b-2 border-b-background-4 p-3 items-center gap-2 flex-wrap">
			<div className="relative flex gap-1 w-full items-center">
				<Image src={serverImg} alt="" className="image w-5! h-5!" />
				<h3>Analytics client</h3>
				<Tooltip
					description="Hide this dashboard"
					direction="top"
					className="ml-auto"
				>
					<Button
						onClick={() => dispatch({ type: "SET_IS_VISIBLE", flag: false })}
					>
						<small>✕ Hide</small>
					</Button>
				</Tooltip>
			</div>
			<div className="flex gap-1 w-full items-center">
				<span className="flex gap-1.5 items-center">
					<div
						className={`rounded-full w-1.5 h-1.5 ${controller.data !== null ? "bg-[rgb(56,66,255)]" : "bg-red-500"} duration-1000`}
					/>
					{statusText()}
				</span>

				<div className="flex gap-1 ml-auto flex-wrap justify-center">
					<Tooltip description="Re-download database data">
						<Button onClick={controller.resync}>
							{controller.isSyncing.current === true && (
								<Spinner className="w-3! h-3!" />
							)}
							<Image className="image invert-70!" alt="" src={downloadImg} />
							<mark>{controller.hasErrored ? "Fix" : "Sync"}</mark> data
						</Button>
					</Tooltip>
				</div>
			</div>
		</div>
	);
};
