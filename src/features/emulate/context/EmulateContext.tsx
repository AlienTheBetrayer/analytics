"use client";
import type React from "react";
import { createContext, useContext, useState } from "react";
import type { EmulateData, EmulateDataContext } from "../types/emulateContext";

export const EmulateContext = createContext<EmulateDataContext | null>(null);

type Props = {
	children: React.ReactNode;
};

export const EmulateProvider = ({ children }: Props) => {
	const [data, setData] = useState<EmulateData>({});

	return (
		<EmulateContext.Provider value={[data, setData]}>
			{children}
		</EmulateContext.Provider>
	);
};

export const useEmulateContext = () => {
	const ctx = useContext(EmulateContext);
	if (!ctx) throw new Error("useEmulateContext() is not used correctly.");
	return ctx;
};
