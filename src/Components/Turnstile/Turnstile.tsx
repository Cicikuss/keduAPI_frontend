import React, { useEffect, useRef } from "react";

interface TurnstileProps {
  siteKey: string;
  theme?: "light" | "dark";
  onSuccess?: (token: string) => void;
}

const Turnstile: React.FC<TurnstileProps> = ({ siteKey, theme = "light", onSuccess }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const turnstileRenderedRef = useRef(false);

  useEffect(() => {
    const renderTurnstile = () => {
      if (window.turnstile && containerRef.current && !turnstileRenderedRef.current) {
        window.turnstile.render(containerRef.current, {
          sitekey: siteKey,
          theme: theme,
          callback: (token: string) => {
            if (onSuccess) {
              onSuccess(token);
            }
          },
        });
        turnstileRenderedRef.current = true;
      }
    };

    // Check if the script is already loaded
    if (!window.turnstile) {
      const script = document.createElement("script");
      script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);

      script.onload = () => {
        renderTurnstile();
      };

      script.onerror = () => {
        console.error("Failed to load the Turnstile script.");
      };

      return () => {
        // Cleanup script and any event listeners
        if (script.parentNode) {
          script.parentNode.removeChild(script);
        }
      };
    } else {
      // If script is already loaded, render the Turnstile widget
      renderTurnstile();
    }
  }, [siteKey, theme, onSuccess]);

  return <div ref={containerRef}></div>;
};

export default Turnstile;