import React from "react";
import {Palette} from "../../styles/palette";

export const Loader: React.FC = () => {
    return (
        <div
        >
            <div
                style={{
                    border: `6px solid ${Palette.secondaryText}`, // soft muted gray border
                    borderTop: `6px solid ${Palette.info}`, // bright cyan accent for motion
                    borderRadius: "50%",
                    width: "60px",
                    height: "60px",
                    animation: "spin 1s linear infinite",
                    boxShadow: `0 0 20px ${Palette.primaryShadow}`,
                    margin: "auto",
                }}
            />

            <style>
                {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
            </style>
        </div>
    );
};

export default Loader;
