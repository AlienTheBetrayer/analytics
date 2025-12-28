/** biome-ignore-all lint/suspicious/noArrayIndexKey: <> */
import './Colors.css';
import Image from "next/image";
import { Button } from "@/features/ui/button/components/Button";
import { useColorModal } from "../../hooks/useColorModal";

export const COLORS_GRID_SIZE = 4;

export const Colors = () => {
	// controller
	const controller = useColorModal();

	return (
		<div className="box min-w-0! h-screen max-h-128 md:max-h-90">
			<span className="flex justify-center items-center w-full">
				<b>Color panel</b>
			</span>

			<div className="flex flex-col h-full gap-4 md:flex-row">
				<ul
					className="grid gap-2 w-screen max-w-64 self-center"
					style={{
						gridTemplateColumns: `repeat(${COLORS_GRID_SIZE}, minmax(0, 1fr))`,
					}}
				>
					{Array.from({ length: COLORS_GRID_SIZE * COLORS_GRID_SIZE }).map(
						(_, idx) => (
							<li key={idx} className={`flex aspect-square ${controller.selectedId === idx ? 'color-selected' : ''}`}>
								<input
									value={controller.colors[idx]}
									onChange={(e) => controller.set(idx, e.target.value)}
									onClick={() => controller.select(idx)}
									type="color"
									className="cursor-pointer outline-0 w-full h-full!"
								/>
							</li>
						),
					)}
				</ul>

				<hr className="md:w-px! md:h-full! border-background-5!" />
				<ul className="flex flex-col gap-1.5 w-screen max-w-64 min-w-0">
					<li className="flex flex-col w-fit gap-1">
						<span>
							<b>Panel options</b>
						</span>
					</li>
					<li className="flex flex-col w-full *:w-full gap-1">
						<Button>
							<Image width={16} height={16} src="/random.svg" alt="" />
							Randomly select
						</Button>
					</li>
					<li className="flex flex-col w-full *:w-full gap-1">
						<Button onClick={controller.palette}>
							<Image width={16} height={16} src="/type.svg" alt="" />
							Generate a palette
						</Button>
					</li>
					<hr />
					<li className="flex flex-col gap-1">
						<label htmlFor="hue-rotation" className="self-start">
							<b>Hue Rotation</b>
						</label>
						<input
							id="hue-rotation"
							type="range"
							className="w-full"
							value={controller.hueRotation}
							min={0}
							max={8}
							step={0.01}
							onChange={(e) => {
								controller.setHueRotation(Number(e.target.value));
							}}
						/>
					</li>
					<hr />
					{controller.selectedId !== undefined && (
						<li className="flex flex-col gap-1">
							<span className="self-start">
								<b>Selected:</b>
							</span>
							<div
								className="w-full h-5 rounded-full"
								style={{ background: controller.colors[controller.selectedId] }}
							></div>
						</li>
					)}
					<hr className="mt-auto" />
					<li className="w-full *:w-full">
						<Button>
							<Image width={16} height={16} src="/cube.svg" alt="" />
							<b>
								<mark>Apply changes</mark>
							</b>
						</Button>
					</li>
					<li className="w-full *:w-full">
						<Button onClick={controller.clear}>
							<Image width={16} height={16} src="/cross.svg" alt="" />
							<u>Clear</u>
						</Button>
					</li>
				</ul>
			</div>
		</div>
	);
};
