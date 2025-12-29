import type React from "react";

export type MenuItem = {
	title?: string;
    titleElement: React.ReactNode;
	element: React.ReactNode;
	href?: string;
};
