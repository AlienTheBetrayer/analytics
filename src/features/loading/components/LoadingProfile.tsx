export const LoadingProfile = () => {
    return (
        <>
            <div className="w-full flex items-center h-10 px-4 gap-2 my-4">
                <div className="loading w-full max-w-48 h-6 rounded-full!" />

                <div className="loading w-full max-w-16 h-6 rounded-full! ml-auto" />
                <div className="loading w-full max-w-48 h-6 rounded-full!" />
            </div>

            <div className="w-full grid gap-16 lg:grid-cols-[30%_1fr] p-6! min-h-128">
                <div className="flex flex-col gap-4 items-center">
                    <div className="loading w-full max-w-81 aspect-square rounded-full!" />
                    <div className="loading w-full h-8 mt-auto" />
                </div>

                <div className="flex flex-col gap-8">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="loading w-full h-8" />
                        <div className="loading w-full h-8" />
                    </div>

                    <div className="loading w-full h-8" />
                    <div className="loading w-full h-8" />
                    <div className="loading w-full h-8" />
                    <div className="loading w-full h-8" />

                    <div className="loading w-full h-8 mt-auto" />
                </div>
            </div>
        </>
    );
};
