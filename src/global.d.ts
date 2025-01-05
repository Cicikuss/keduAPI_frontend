declare global {
  interface Window {
    turnstile?: {
      render: (
        container: HTMLElement,
        options: {
          sitekey: string;
          theme?: "light" | "dark";
          callback?: (token: string) => void;
        }
      ) => void;
    };
  }
}

export {};
