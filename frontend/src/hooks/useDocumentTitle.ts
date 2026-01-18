import { useEffect } from "react";

const BASE_TITLE = "ParkFlex";

export function useDocumentTitle(title?: string) {
    useEffect(() => {
        if (title && title.trim()) {
            document.title = `${BASE_TITLE} | ${title}`;
        } else {
            document.title = BASE_TITLE;
        }
    }, [title]);
}
