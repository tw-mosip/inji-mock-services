import React, {useState} from 'react';
import {Code} from "./Code";
import {Palette, spacing, cardStyles} from "../../styles/palette";

export function Section(props) {
    return <div
        style={{
            padding: "1px 8px",
            borderRadius: "8px",
            position: "relative",
            font: "14px \"Courier New\", Courier, monospace",
            display: "flex",
            flexDirection: "column",
            gap: "2px",
            alignItems: "flex-end",
            maxWidth: "100%",
        }}
    >
        <Code value={props.value}/>
    </div>;
}

export function AccordionSection({title, children, defaultOpen = false}) {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div style={cardStyles.base}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                style={cardStyles.accordionHeader}
                aria-expanded={isOpen}
            >
                <span>{title}</span>
                <span style={{
                    color: Palette.tertiaryText,
                    transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)',
                    transition: 'transform 0.2s',
                    fontSize: '14px',
                    display: 'inline-block',
                }}>
                    ▶
                </span>
            </button>
            {isOpen && children && (
                <div style={{
                    padding: `${spacing.md}px ${spacing.xl}px ${spacing.lg}px`,
                    borderTop: `1px solid ${Palette.borderLight}`,
                }}>
                    {children}
                </div>
            )}
        </div>
    );
}
