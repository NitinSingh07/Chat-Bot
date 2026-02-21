"use client";

import { useMutation, useQuery } from "convex/react";
import { useEffect } from "react";
import { api } from "../../convex/_generated/api";

export function PresenceHandler() {
    const me = useQuery(api.users.getMe);
    const setStatus = useMutation(api.users.setStatus);

    useEffect(() => {
        // Wait until current user record exists in the DB
        if (!me) return;
        setStatus({ isOnline: true });

        // Heartbeat every 15s to keep status fresh and prevent timeout
        const interval = setInterval(() => {
            setStatus({ isOnline: true });
        }, 15000);

        const handleUnload = () => {
            setStatus({ isOnline: false });
        };

        window.addEventListener("beforeunload", handleUnload);

        return () => {
            clearInterval(interval);
            window.removeEventListener("beforeunload", handleUnload);
        };
    }, [me?._id, setStatus]);

    return null;
}
