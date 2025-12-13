type Props = {} & React.ComponentPropsWithoutRef<"button">;

export const Button = ({ children, onClick, className, ...rest }: Props) => {
	return (
		<button
			{...rest}
			onClick={onClick}
			className={`flex gap-1 rounded-3xl outline-1 outline-background-5 items-center bg-background-3 min-w-12 min-h-8 px-2 hover:bg-background-4 active:bg-background-5 transition duration-150 cursor-pointer ${className ?? ""} `}
		>
			{children}
		</button>
	);
};
