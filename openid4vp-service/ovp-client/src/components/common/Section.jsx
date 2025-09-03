import React, {Fragment, useState} from 'react';
import {Code} from "./Code";
import {Palette} from "../../styles/palette";

export function Section(props: { value: string }) {
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

export function AccordionSection({title, value, background = Palette.surface, children}) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div style={{
            margin: '16px',
            marginLeft: '0px',
            borderRadius: '12px',
            border: `3px solid ${Palette.surfaceDark}`,
            background: Palette.surface
        }}>
            <div
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    cursor: 'pointer',
                    background,
                    padding: '12px 16px',
                    borderRadius: '8px',
                    marginBottom: '8px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}
            >
                <span style={{fontWeight: '600'}}>{title}</span>
                <span style={{transform: isOpen ? 'rotate(90deg)' : 'rotate(0)', transition: 'transform 0.2s'}}>
                    ▶
                </span>
            </div>
            {isOpen && (
                <div style={{padding: '0 16px 16px 16px'}}>
                    {children && <Fragment>{children}</Fragment>}
                    {value && <Section value={value}/>}
                </div>
            )}
        </div>
    );
}