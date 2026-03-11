/** @format */

import { Main } from "@/features/messages/components/message/topline/parts/Main";
import { Secondary } from "@/features/messages/components/message/topline/parts/Secondary";

export const MessagesTopline = () => {
    return (
        <div className="flex flex-col gap-2">
            <Main />
            <Secondary />
        </div>
    );
};
