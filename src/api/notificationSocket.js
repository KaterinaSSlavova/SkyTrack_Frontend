import { Client } from "@stomp/stompjs";

const socketUrl = import.meta.env.VITE_WS_URL;
let client = null;

export function getNotification(onMessage) {
    client = new Client({
        brokerURL: `${socketUrl}/ws`,

        onConnect: () => {
            client.subscribe("/user/queue/notifications", (message) => {
                const notification = JSON.parse(message.body);
                onMessage(notification);
            });
        },

        onStompError: (frame) => {
            console.error("STOMP error", frame);
        },
    });

    client.activate();
}

export function disconnectNotificationSocket() {
    if (client) {
        client.deactivate();
        client = null;
    }
}