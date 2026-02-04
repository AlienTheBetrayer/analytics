export const LoadingProfile = () => {
    return (
        <>
            <div className="w-full h-6 loading mb-4" />

            <div className="flex flex-col-reverse lg:grid lg:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                    <div className="w-full h-6 loading mb-4" />

                    <div className="flex flex-col gap-4 my-auto">
                        <div className="w-full h-48 rounded-4xl! loading" />
                        <div className="w-full h-48 rounded-4xl! loading" />
                        <div className="w-full h-48 rounded-4xl! loading" />
                    </div>
                </div>

                <div className="flex flex-col gap-2">
                    <div className="w-full h-6 loading mb-4" />

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
            </div>
        </>
    );
};
