import { useEffect, useRef } from "react";

interface TurnstileProps {
  siteKey: string;
  onVerify: (token: string) => void;
}

declare global {
  interface Window {
    turnstile?: {
      render: (element: HTMLElement, options: any) => void;
    };
  }
}

const Turnstile: React.FC<TurnstileProps> = ({ siteKey, onVerify }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const renderTurnstile = () => {
      if (window.turnstile && containerRef.current) {
        window.turnstile.render(containerRef.current, {
          sitekey: siteKey,
          callback: (token: string) => onVerify(token),
        });
      }
    };

    // Script yüklendiğinde çalıştır
    if (window.turnstile) {
      renderTurnstile();
    } else {
      const script = document.querySelector('script[src="https://challenges.cloudflare.com/turnstile/v0/api.js"]');

      if (script) {
        script.addEventListener("load", renderTurnstile);
      } else {
        // Eğer script yüklenmemişse manuel olarak yükleyin
        const newScript = document.createElement("script");
        newScript.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
        newScript.async = true;
        newScript.defer = true;
        newScript.onload = renderTurnstile;
        document.body.appendChild(newScript);
      }
    }
  }, [siteKey, onVerify]);

  return <div ref={containerRef}></div>;
};

export default Turnstile;
