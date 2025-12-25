import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

export const useInputSelect = (
	items: string[],
	value: string | undefined,
	onChange?: (item: string) => void,
) => {
	// states
	const [isExpanded, setIsExpanded] = useState<boolean>(false);
	const [selectedItem, setSelectedItem] = useState<string>(
		items.length > 0 ? items[0] : "",
	);

	// derived from state
	const inputValue = (value as string | undefined) ?? selectedItem;

	// refs
	const inputRef = useRef<HTMLButtonElement | null>(null);
	const expandRef = useRef<HTMLUListElement | null>(null);

	// position calculating
	// biome-ignore lint/correctness/useExhaustiveDependencies: <recalculate on expand open>
	useEffect(() => {
		const handle = () => {
			if (!(inputRef.current && expandRef.current)) return;

			const inputBounds = inputRef.current.getBoundingClientRect();

			expandRef.current.style.left = `${inputBounds.left}px`;
			expandRef.current.style.width = `${inputBounds.width}px`;
			expandRef.current.style.top = `${inputBounds.top + inputBounds.height}px`;
		};
		handle();

		window.addEventListener("resize", handle);
		return () => window.removeEventListener("resize", handle);
	}, [isExpanded]);

	// hotkeys
	useEffect(() => {
		const handle = (e: KeyboardEvent) => {
			if (!(inputRef.current && inputRef.current === document.activeElement))
				return;

			switch (e.code) {
				case "Escape":
					inputRef.current.blur();
					break;
			}
		};

		window.addEventListener("keydown", handle);
		return () => window.removeEventListener("keydown", handle);
	}, []);

	// click away
	useEffect(() => {
		const handle = (e: PointerEvent) => {
			if (!(inputRef.current && expandRef.current)) return;

			const el = e.target as HTMLElement;

			if (!(inputRef.current.contains(el) || expandRef.current.contains(el))) {
				setIsExpanded(false);
			}
		};

		window.addEventListener("pointerdown", handle);
		return () => window.removeEventListener("pointerdown", handle);
	}, []);

	const render = useCallback(() => {
		return createPortal(
			<AnimatePresence>
				{isExpanded && (
					<motion.ul
						className="absolute flex-col overflow-hidden rounded-xl border-2 border-background-5"
						ref={expandRef}
						initial={{ height: "0px" }}
						animate={{ height: "auto" }}
						exit={{ height: "0px" }}
						transition={{ type: "spring", stiffness: 200, damping: 30 }}
					>
						{items.map((item) => (
							<li key={item} className="w-full">
								<button
									type="button"
									className={`flex w-full bg-linear-to-bl 
            from-background-a-2 to-background-a-1 backdrop-blur-xl p-2 focus:border-blue-1 
             hover:brightness-125 transition-colors duration-150 cursor-pointer ${item === inputValue ? "brightness-200" : ""}`}
									onClick={() => {
										value === undefined
											? setSelectedItem(item)
											: onChange?.(item);
										setIsExpanded(false);
									}}
								>
									{item}
									{item === inputValue && (
										<Image
											src="/checkmark.svg"
											width={10}
											height={10}
											alt="selected"
											className="ml-auto"
										/>
									)}
								</button>
							</li>
						))}
					</motion.ul>
				)}
			</AnimatePresence>,
			document.body,
		);
	}, [items, isExpanded, onChange, value, inputValue]);

	const expandToggle = useCallback(() => {
		setIsExpanded((prev) => !prev);
	}, []);

	return {
		inputRef,
		render,
		expandToggle,
		inputValue,
	};
};
