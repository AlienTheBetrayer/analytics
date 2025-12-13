import { Spinner } from "@/features/spinner/components/Spinner";
import { Button } from "@/features/ui/button/components/Button";
import Image from "next/image";
import downloadImg from "../../../public/download.svg";
import type { useData } from "../hooks/useData";

import serverImg from '../../../public/server.svg';

type Props = {
	controller: ReturnType<typeof useData>;
};

export const DashboardTopline = ({ controller }: Props) => {
	return (
		<div className="w-full flex flex-col border-b border-b-background-4 px-2 py-1 items-center gap-2 flex-wrap">
            <div className='flex gap-1 w-full items-center'>
                <Image src={serverImg} alt='' className='image invert-75!'/>
                <h3>
                    Analytics client
                </h3>
                <Button className='ml-auto'>
                    <small>
                        ✕ Hide
                    </small>
                </Button>
            </div>
			<div className='flex gap-1 w-full items-center'>
				<span className="flex gap-1.5 items-center">
					<div
						className={`rounded-full w-1.5 h-1.5 ${controller.data !== null ? "bg-[rgb(56,66,255)]" : "bg-red-500"} duration-1000`}
					/>
					{controller.data !== null ? "Synced" : "Fetching..."}
				</span>

				<div className="flex gap-1 ml-auto flex-wrap justify-center">
					<Button onClick={controller.resync}>
						{controller.isSyncing.current === true && (
							<Spinner className="w-3! h-3!" />
						)}
						<Image className="image invert-70!" alt="" src={downloadImg} />
						<mark>Sync</mark>
					</Button>

					<Button
						onClick={() => controller.setAutoSyncEnabled((prev) => !prev)}
					>
						{controller.autoSyncEnabled === false
							? "Enable auto-sync"
							: "Disable auto-sync"}
					</Button>
				</div>
			</div>
		</div>
	);
};
