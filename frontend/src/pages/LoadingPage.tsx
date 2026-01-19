import { useEffect, useState } from "react";

export const LoadingPage = () => {
    const refreshInterval = 300;
    const defaultText = "Ładowanie strony";
    const [loadingText, setLoadingText] = useState(defaultText);

    useEffect(() => {
        const intervalId = setInterval(() => {
            setLoadingText((prev) => {
                if (prev.endsWith("...")) {
                    return defaultText;
                }
                return prev + ".";
            });
        }, refreshInterval);

        return () => clearInterval(intervalId);
    }, [refreshInterval, defaultText]);

    return (
        <div
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100vh",
            }}
        >
            <h2>{loadingText}</h2>
        </div>
    );
};
