export const LoadingSearch = () => {
    return (
        <div className="flex flex-col gap-2">
            <div className="w-full h-8 loading" />
            <div className="w-full h-8 loading" />

            <div className="w-full h-0.5 loading my-4" />

            {Array.from({ length: 4 }, (v, k) => (
                <LoadingSearchEntryUser key={k} />
            ))}
        </div>
    );
};

export const LoadingSearchEntryUser = () => {
    return (
        <div className="flex flex-col w-full h-32 loading rounded-[10vw]!">
            <ul className="flex grow p-4! gap-4 w-full">
                <li className="flex flex-col w-full max-w-24">
                    <div className="loading w-full aspect-square rounded-full!" />
                </li>

                <li className="flex flex-col w-full max-w-24 gap-2">
                    <div className="loading w-full h-6 loading" />
                    <div className="loading w-full h-6 loading" />
                    <div className="loading w-full h-6 loading" />
                </li>

                <li className="flex flex-col w-full gap-2">
                    <div className="loading w-full h-6 loading" />
                    <div className="loading w-full h-6 loading" />
                    <div className="loading w-full h-6 loading" />
                </li>
            </ul>
        </div>
    );
};
