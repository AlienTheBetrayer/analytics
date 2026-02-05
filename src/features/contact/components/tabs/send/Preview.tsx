import { NoPreview } from "@/features/contact/components/errors/NoPreview";
import { SendFormContents } from "@/features/contact/components/tabs/send/SendForm";

type Props = {
    contents: SendFormContents;
};

export const Preview = ({ contents }: Props) => {
    if (!contents.email && !contents.message && !contents.title) {
        return (
            <div className="w-full h-full loading flex items-center justify-center">
                <div className="w-full max-w-3/4">
                    <NoPreview />
                </div>
            </div>
        );
    }

    return <div className="w-full h-full"></div>;
};
