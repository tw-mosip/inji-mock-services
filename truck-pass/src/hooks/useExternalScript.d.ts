type ScriptStatus = "idle" | "loading" | "ready" | "error";
export declare const useExternalScript: (url: string | null) => ScriptStatus;
export {};
