import React from "react";
import {Palette} from "../../styles/palette";

const imageStyle = {
    border: `4px solid ${Palette.surfaceDark}`,
    width: "400px",
    maxWidth: "100%",
    height: "auto",
    marginBottom: "10px",
    cursor: "pointer",
    display: "block",
};

const mobileStyle = {
    border: `2px solid ${Palette.surfaceDark}`,
    width: "100%",
    maxWidth: "300px",
    marginBottom: "6px",
};

export function Image(props: { src: unknown, alt?: string }) {
    // Use window.matchMedia for mobile detection
    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    const style = isMobile ? {...imageStyle, ...mobileStyle} : imageStyle;

    return (
        <img
            src={props.src}
            alt={props.alt || "Image"}
            style={style}
        />
    );
}