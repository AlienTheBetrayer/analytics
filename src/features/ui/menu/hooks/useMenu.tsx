import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { MenuItem } from "../types/menu";

export const useMenu = (items: MenuItem[]) => {
	// states
	const [selectedItem, setSelectedItem] = useState<number>(0);

	// refs
	const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);
	const selectRef = useRef<HTMLDivElement | null>(null);

	// positioning
	useEffect(() => {
		const handle = () => {
			if (!(buttonRefs.current[selectedItem] && selectRef.current)) return;

			const buttonBounds =
				buttonRefs.current[selectedItem].getBoundingClientRect();
			selectRef.current.style.left = `${buttonBounds.left}px`;
			selectRef.current.style.top = `${buttonBounds.bottom}px`;
			selectRef.current.style.width = `${buttonBounds.width}px`;
			selectRef.current.style.display = `block`;
		};
		handle();

		window.addEventListener("resize", handle);
		return () => window.removeEventListener("resize", handle);
	}, [selectedItem]);

	const select = useCallback((idx: number) => {
		setSelectedItem(idx);
	}, []);

	// rendering
	const renderElement = useCallback(() => {
		return items[selectedItem].element;
	}, [selectedItem, items]);

	const renderSelect = useCallback(() => {
		return createPortal(
			<div
				className="absolute hidden transition-all duration-300 ease-out h-[1.5px] bg-blue-1"
				ref={selectRef}
			/>,
			document.body,
		);
	}, []);

	return {
		selectedItem,
		buttonRefs,
		select,
		renderElement,
		renderSelect,
	};
};
