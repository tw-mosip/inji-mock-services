import React from "react";

export function Image(props: { src: unknown, alt?: string }) {
    return (<img
            src={props.src}
            alt={props.alt || "Image"}
            style={{
                border: `4px solid black`,
                width: "400px",
                height: "400px",
                marginBottom: "10px",
                cursor: "pointer",
                display: "block",
            }}
        />)
}