import { Spinner } from "@/features/spinner/components/Spinner";

export const UserLoading = () => {
	return (
		<div className="box max-w-lg w-full h-full max-h-lg m-auto">
			<span className="m-auto">Loading profile...</span>
			<Spinner styles="big" />
		</div>
	);
};
