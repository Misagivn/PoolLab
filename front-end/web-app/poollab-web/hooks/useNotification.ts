import { HubConnectionBuilder, HubConnection } from "@microsoft/signalr";
import { useEffect, useState } from "react";

const useNotification = () => {
    const [connection, setConnection] = useState<HubConnection | null>(null);
    const [notifications, setNotifications] = useState<string>("");
    
    useEffect(() => {
        const storeId = sessionStorage.getItem("storeId");
        const connect = new HubConnectionBuilder()
            .withUrl(`${process.env.NEXT_PUBLIC_LOCAL_SIGNAL_URL}/notificationHub`) // Thay URL bằng địa chỉ backend của bạn
            .withAutomaticReconnect()
            .build();

        connect.start()
            .then(() => {
                console.log("SignalR Connected!");
                connect.invoke("JoinBranchGroup", storeId)
                .then(() => console.log("Successfully joined group"))
                .catch((err) => console.error(`Error joining group: ${err.message}`));;
                connect.on("ReceiveNotification", (message: string) => {
                    setNotifications(message);
                });
            })
            .catch(err => console.error("SignalR Connection Error:", err));

        setConnection(connect);

        return () => {
            connect.stop();
        };
    }, []);

    return { notifications };
};

export default useNotification;