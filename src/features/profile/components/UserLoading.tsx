import { Spinner } from "@/features/spinner/components/Spinner";

export const UserLoading = () => {
	return (
		<div className="box max-w-lg w-full m-auto">
			<span className="m-auto">Loading profile...</span>
			<Spinner styles="big" />
		</div>
	);
};
