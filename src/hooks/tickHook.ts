import React, { useEffect, useState } from "react";

export function useTick(active: boolean|Boolean) {
    const [tick, setTick] = useState(new Date().getTime());
    useEffect(() => {
        let interval:any = null
        if(active) {
            interval = setInterval(() => setTick(new Date().getTime()), 1000);
        }
        return () => {
            if(interval) {
                clearInterval(interval);
            }
        }
    }, []);
    return tick;
}