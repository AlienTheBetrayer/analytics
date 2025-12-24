import { Spinner } from "@/features/spinner/components/Spinner";
import { Button } from "@/features/ui/button/components/Button";
import { LinkButton } from "@/features/ui/linkbutton/components/LinkButton";
import { useAppStore } from "@/zustand/store";

export const FetchPrompt = () => {
	// zustand state
	const dataPromises = useAppStore((state) => state.dataPromises);

	// zustand functions
	const updateProjectList = useAppStore((state) => state.updateProjectList);

	return (
		<div className="flex flex-col gap-4">
			<div className="flex flex-col gap-2">
				<span className="text-center text-foreground-2! text-5!">
					Fetch required
				</span>
				<span className="text-center">
					The project / data has not been fetched yet
				</span>
			</div>

			<hr />
			<div className="flex flex-col gap-2">
				<Button
					onClick={() => {
						updateProjectList();
					}}
				>
					{dataPromises?.projects === "pending" && <Spinner />}
					Fetch
				</Button>
				<LinkButton style="button" href="/dashboard">
					Go to dashboard
				</LinkButton>
			</div>
		</div>
	);
};
