"use server";
import { Emulate } from "@/features/emulate/components/Emulate";
import { EmulateProvider } from "@/features/emulate/context/EmulateContext";

type Props = {
	params: Promise<{ id: string }>;
};

const EmulatePage = async ({ params }: Props) => {
	// url
	const { id } = await params;

	if (Array.isArray(id)) return null;

	return (
		<EmulateProvider>
			<main className="relative flex flex-col my-auto w-full">
				<Emulate id={id} />
			</main>
		</EmulateProvider>
	);
};

export default EmulatePage;
