import type { NotificationData } from "./Notification";

type Props = {
    data: NotificationData;
};

export const NotificationMain = ({ data }: Props) => {
    const messageDescription = () => {
        switch(data.type) {
            case 'information':
                return 'Message:';
            case 'error':
                return 'Response:';
            case 'warning':
                return 'Caution:';
        }
    }

    return (
        <div className="flex flex-col grow px-4 py-1">
            <p>
                <small>
                    {messageDescription()}
                </small>
            </p>
            <p>
                {data.content}
            </p>
        </div>
    );
};
