type HeaderButton = {
	text: string;
	href: string;
    className?: string;
};

export const HeaderButtons: HeaderButton[] = [
	{
		text: "Home",
		href: "/home",
	},
    {
        text: "Information",
        href: "/information",
    },
	{
		text: "Dashboard",
		href: "/dashboard",
        className: "ml-auto"
	},
];
