import { Spinner } from "@/features/spinner/components/Spinner";
import { Button } from "@/features/ui/button/components/Button";
import { LinkButton } from "@/features/ui/linkbutton/components/LinkButton";
import { useAppStore } from "@/zustand/store";

export const AuthRequired = () => {
	// zustand state
	const authenticationPromises = useAppStore(
		(state) => state.authenticationPromises,
	);

	// zustand functions
	const refresh = useAppStore((state) => state.refresh);

	return (
		<div className="flex flex-col items-center gap-4">
			<div className="flex flex-col gap-2">
				<span>Authentication is required.</span>
				<Spinner styles="big" />
			</div>
			<hr />
			<div className="grid grid-cols-2 w-full gap-2">
				<Button
					onClick={() => {
						refresh();
					}}
				>
					{authenticationPromises?.refresh === "pending" && <Spinner />}
					Refresh
				</Button>
				<LinkButton href="/login">Log in</LinkButton>
			</div>
		</div>
	);
};
