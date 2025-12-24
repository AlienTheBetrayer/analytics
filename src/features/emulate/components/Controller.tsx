import { useParams } from "next/navigation";
import { Button } from "@/features/ui/button/components/Button";
import { Input } from "@/features/ui/input/components/Input";

export const Controller = () => {
	// url
	const { id } = useParams<{ id: string | undefined }>();

	if (id === undefined)
		return (
			<span>
				No project is <u>selected</u>
			</span>
		);

	return (
		<div className="flex flex-col gap-4">
			<div className="flex flex-col gap-2">
				<span className="text-center text-foreground-2! text-5!">
					Emulation
				</span>
				<span className="text-center">
					Enter data that will be sent to the database
				</span>
			</div>
			<div className="flex flex-col gap-2">
				<form
					className="flex flex-col gap-2"
					onSubmit={(e) => {
						e.preventDefault();
					}}
				>
					<Input placeholder="Event Type" required minLength={5} />
					<Input placeholder="Description (optional)" />
					<Button type="submit">Send</Button>
				</form>
			</div>
		</div>
	);
};
