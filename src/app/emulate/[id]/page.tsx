"use server";
import { Emulate } from "@/features/emulate/components/Emulate";

type Props = {
	params: Promise<{ id: string }>;
};

const EmulatePage = async ({ params }: Props) => {
	// url
	const { id } = await params;

	if (Array.isArray(id)) return null;

	return (
		<main className="relative flex flex-col my-auto w-full">
			<Emulate/>
		</main>
	);
};

export default EmulatePage;
