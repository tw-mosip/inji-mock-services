import { useEffect, useState } from "react";

type ScriptStatus = "idle" | "loading" | "ready" | "error";

export const useExternalScript = (url: string | null): ScriptStatus => {
  const [state, setState] = useState<ScriptStatus>(url ? "loading" : "idle");

  useEffect(() => {
    if (!url) {
      setState("idle");
      return;
    }

    let script: HTMLScriptElement | null = document.querySelector(`script[src="${url}"]`);

    const handleScript = (e: Event) => {
      setState(e.type === "load" ? "ready" : "error");
    };

    if (!script) {
      script = document.createElement("script");
      script.type = "application/javascript";
      script.src = url;
      script.async = true;
      document.head.appendChild(script);
      script.addEventListener("load", handleScript);
      script.addEventListener("error", handleScript);
    } else {
      script.addEventListener("load", handleScript);
      script.addEventListener("error", handleScript);
    }

    return () => {
      script?.removeEventListener("load", handleScript);
      script?.removeEventListener("error", handleScript);
    };
  }, [url]);

  return state;
};
