import { useEffect } from "react";

export function ChatWidget() {
    useEffect(() => {
        const widgetId = "6a66789ef1929b03b0713b82";
        const script = document.createElement("script");

        script.src = "https://widgets.leadconnectorhq.com/loader.js";
        script.async = true;

        script.dataset.resourcesUrl =
            "https://widgets.leadconnectorhq.com/chat-widget/loader.js";
        script.dataset.widgetId = widgetId;

        document.body.appendChild(script);

        return () => {
            script.remove();
        };
    }, []);

    return null;
}