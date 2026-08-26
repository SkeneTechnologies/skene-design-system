'use client';
import { useEffect, useRef, useState } from 'react';
/** Scale a fixed-width scene to fit its container width. */
export function useContainerScale(designWidth = 700) {
    const containerRef = useRef(null);
    const [scale, setScale] = useState(1);
    useEffect(() => {
        const el = containerRef.current;
        if (!el)
            return;
        const ro = new ResizeObserver(([entry]) => {
            setScale(entry.contentRect.width / designWidth);
        });
        ro.observe(el);
        return () => ro.disconnect();
    }, [designWidth]);
    return { containerRef, scale };
}
