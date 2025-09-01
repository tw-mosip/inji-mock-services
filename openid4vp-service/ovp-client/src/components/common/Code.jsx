import React, {useState} from "react";
import {font, Palette} from "../../styles/palette";
import Button from "./Button";
import {handleCopy} from "../../utility/util";

export function Code({value}) {
    const [copied, setCopied] = useState(false);

    return (
        <div style={{maxWidth: "100%"}}>
            <div style={{display: "flex", justifyContent: "flex-end", marginBottom: "6px"}}>
                <Button
                    onClick={() => handleCopy(typeof value == "string" ? value : JSON.stringify(value, null, 2), setCopied)}
                    variant={"secondary"}>{copied ? "Copied" : "Copy"}</Button>
            </div>
            <pre
                style={{
                    background: Palette.codeBackground,
                    color: Palette.codeText,
                    padding: "12px",
                    borderRadius: "8px",
                    overflowX: "auto",
                    maxWidth: "100%",
                    boxSizing: "border-box",
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                    marginTop: "0",
                    fontStyle: font.code
                }}
            >
                {typeof value === "string"
                    ? value
                    : JSON.stringify(value, null, 2)}
            </pre>
        </div>
    );
}