import { MessageBox } from "@/features/ui/messagebox/components/MessageBox";
import { ComponentProps, useCallback, useState } from "react";

export const useMessageBox = () => {
    const [visibility, setVisibility] = useState(false);

    const show = useCallback(() => {
        setVisibility(true);
    }, []);

    const hide = useCallback(() => {
        setVisibility(false);
    }, []);

    const render = useCallback(
        (props: Omit<ComponentProps<typeof MessageBox>, "visibility">) => {
            return (
                <MessageBox
                    visibility={visibility}
                    onSelect={(res) => {
                        setVisibility(false);
                        props.onSelect(res);
                    }}
                >
                    {props.children}
                </MessageBox>
            );
        },
        [visibility],
    );

    return {
        show,
        hide,
        render,
    };
};
