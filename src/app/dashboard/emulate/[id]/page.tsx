"use server";
import { Emulate } from "@/features/emulate/components/Emulate";

const EmulatePage = async () => {
	return (
		<main className="relative flex flex-col my-auto w-full">
			<Emulate />
		</main>
	);
};

export default EmulatePage;
