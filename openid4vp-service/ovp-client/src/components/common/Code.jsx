import React, {useState} from "react";
import {Palette} from "../../styles/palette";
import Button from "./Button";
import {handleCopy} from "../../utility/util";
import {JsonView, darkStyles, collapseAllNested, allExpanded} from "react-json-view-lite";
import "react-json-view-lite/dist/index.css";

const codeFontStack = "Menlo, Monaco, Consolas, 'Courier New', monospace";
const monoTypography = "font-family: " + codeFontStack + "; font-size: 13px; line-height: 1.6;";
const monoIconTypography = "font-family: " + codeFontStack + "; font-size: 12px; line-height: 1.6;";

function withTypography(baseStyle, typographyStyle) {
    return `${baseStyle} ${typographyStyle}`;
}

const jsonViewStyle = {
    ...darkStyles,
    container: withTypography("background: transparent; padding: 0; margin: 0;", monoTypography),
    basicChildStyle: withTypography(darkStyles.basicChildStyle, monoTypography),
    label: withTypography(darkStyles.label, monoTypography),
    clickableLabel: withTypography(darkStyles.clickableLabel, monoTypography),
    nullValue: withTypography(darkStyles.nullValue, monoTypography),
    undefinedValue: withTypography(darkStyles.undefinedValue, monoTypography),
    numberValue: withTypography(darkStyles.numberValue, monoTypography),
    stringValue: withTypography(darkStyles.stringValue, monoTypography),
    booleanValue: withTypography(darkStyles.booleanValue, monoTypography),
    otherValue: withTypography(darkStyles.otherValue, monoTypography),
    punctuation: withTypography(darkStyles.punctuation, monoTypography),
    expandIcon: withTypography(darkStyles.expandIcon, monoIconTypography),
    collapseIcon: withTypography(darkStyles.collapseIcon, monoIconTypography),
    collapsedContent: withTypography(darkStyles.collapsedContent, monoTypography),
    childFieldsContainer: withTypography(darkStyles.childFieldsContainer, monoTypography),
};

function isJson(value) {
    return value !== null && typeof value === "object";
}

export function Code({value}) {
    const [copied, setCopied] = useState(false);
    const [expandAllNodes, setExpandAllNodes] = useState(false);
    const json = isJson(value);

    return (
        <div style={{maxWidth: "100%"}}>
            <div style={{display: "flex", justifyContent: "flex-end", marginBottom: "6px"}}>
                {json && (
                    <>
                        <button
                            type="button"
                            onClick={() => setExpandAllNodes(true)}
                            title="Open all"
                            style={{
                                marginRight: "6px",
                                background: "transparent",
                                color: Palette.codeText,
                                border: `1px solid ${Palette.codeText}`,
                                borderRadius: "4px",
                                width: "24px",
                                height: "24px",
                                cursor: "pointer",
                                fontFamily: codeFontStack,
                                fontSize: "12px",
                                lineHeight: "1",
                            }}
                        >
                            +
                        </button>
                        <button
                            type="button"
                            onClick={() => setExpandAllNodes(false)}
                            title="Fold all"
                            style={{
                                marginRight: "6px",
                                background: "transparent",
                                color: Palette.codeText,
                                border: `1px solid ${Palette.codeText}`,
                                borderRadius: "4px",
                                width: "24px",
                                height: "24px",
                                cursor: "pointer",
                                fontFamily: codeFontStack,
                                fontSize: "12px",
                                lineHeight: "1",
                            }}
                        >
                            -
                        </button>
                    </>
                )}
                <Button
                    onClick={() => handleCopy(typeof value === "string" ? value : JSON.stringify(value, null, 2), setCopied)}
                    variant={"secondary"}>{copied ? "Copied" : "Copy"}</Button>
            </div>
            <div
                style={{
                    background: Palette.codeBackground,
                    padding: "12px",
                    borderRadius: "8px",
                    overflowX: "auto",
                    maxWidth: "100%",
                    boxSizing: "border-box",
                }}
            >
                {json ? (
                    <JsonView
                        key={expandAllNodes ? "expand-all" : "collapse-all"}
                        data={value}
                        style={jsonViewStyle}
                        shouldExpandNode={expandAllNodes ? allExpanded : collapseAllNested}
                        clickToExpandNode={true}
                    />
                ) : (
                    <pre
                        style={{
                            color: Palette.codeText,
                            margin: 0,
                            whiteSpace: "pre-wrap",
                            wordBreak: "break-word",
                            fontFamily: codeFontStack,
                            fontSize: "13px",
                            lineHeight: "1.6",
                        }}
                    >
                        {value}
                    </pre>
                )}
            </div>
        </div>
    );
}