import React from "react";
import PropTypes from "prop-types";
import {Palette, font} from "../../styles/palette";
import Button from "./Button";

function ErrorMessage({
                          title = "Something went wrong",
                          message,
                          onRetry,
                          compact = false,
                      }) {
    // set compact based on screen dimensions if not provided
    compact = compact || window.innerWidth < 400;

    return (
        <div
            style={{
                backgroundColor: Palette.dangerLight,
                border: `1px solid ${Palette.danger}`,
                boxShadow: `0px 2px 10px ${Palette.secondaryShadow}`,
                borderRadius: "12px",
                padding: compact ? "12px 16px" : "30px 60px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                gap: compact ? "4px" : "8px",
                width: compact ? "fit-content" : "100%",
                maxWidth: "400px",
                margin: "auto",
            }}
        >
            <div style={{fontSize: compact ? "22px" : "28px"}}>⚠️</div>

            <h3
                style={{
                    margin: 0,
                    fontSize: compact ? "14px" : "18px",
                    fontFamily: font.primary,
                    fontWeight: 600,
                    color: Palette.danger,
                }}
            >
                {title}
            </h3>

            <p
                style={{
                    margin: 0,
                    fontSize: compact ? "12px" : "14px",
                    color: Palette.tertiaryText,
                    fontFamily: font.primary,
                }}
            >
                {message}
            </p>

            {onRetry && (
                <Button onClick={onRetry}>
                    {compact ? "🔄 Retry" : "🔄 Retry Action"}
                </Button>
            )}
        </div>
    );
}

ErrorMessage.propTypes = {
    title: PropTypes.string,
    message: PropTypes.string.isRequired,
    onRetry: PropTypes.func,
    compact: PropTypes.bool,
};

export default ErrorMessage;