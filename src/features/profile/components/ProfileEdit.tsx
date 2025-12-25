import Image from "next/image";
import { useState } from "react";
import { Button } from "@/features/ui/button/components/Button";
import { Input } from "@/features/ui/input/components/Input";
import { InputSelect } from "@/features/ui/inputselect/components/InputSelect";

export const ProfileEdit = () => {
	// input states
	const [status, setStatus] = useState<string>("");
	const [bio, setBio] = useState<string>("");

	return (
		<div className="flex flex-col w-full gap-4">
			<div className="flex flex-col gap-2">
				<Input
					placeholder="Status"
					value={status}
					onChange={(e) => setStatus(e)}
				/>
				<Input placeholder="Bio" value={bio} onChange={(e) => setBio(e)} />
				<InputSelect items={["everyone", "friends", "nobody"]}/>
			</div>

			<hr className="mt-auto" />
			<div className="flex flex-col gap-2">
				<Button>
					<Image width={20} height={20} src="/send.svg" alt="" />
					Apply changes
				</Button>
			</div>
		</div>
	);
};
