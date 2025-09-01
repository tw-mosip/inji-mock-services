import PropTypes from "prop-types";
import { Palette, font } from "../../styles/palette";

const styles = {
    base: {
        fontFamily: font.primary,
        fontWeight: 600,
        fontSize: "15px",
        padding: "10px 18px",
        borderRadius: "12px",
        border: "none",
        cursor: "pointer",
        transition: "all 0.3s ease",
        boxShadow: `0 4px 10px ${Palette.primaryShadow}`,
    },

    primary: {
        background: `linear-gradient(135deg, ${Palette.primary} 0%, ${Palette.primaryGradientEnd} 100%)`,
        color: "#fff",
    },

    secondary: {
        background: "#fff",
        color: Palette.primary,
        border: `1px solid ${Palette.primary}`,
        boxShadow: `0 4px 8px ${Palette.secondaryShadow}`,
    },

    hoverPrimary: {
        filter: "brightness(1.08)",
        transform: "translateY(-1px)",
    },

    hoverSecondary: {
        background: Palette.primary,
        color: "#fff",
        transform: "translateY(-1px)",
    },
};

export default function Button({ variant = "primary", onClick, children, style }) {
    const isPrimary = variant === "primary";
    const buttonStyle = {
        ...styles.base,
        ...(isPrimary ? styles.primary : styles.secondary),
        ...style,
    };

    return (
        <button
            style={buttonStyle}
            onClick={onClick}
            onMouseOver={(e) =>
                Object.assign(e.currentTarget.style, isPrimary ? styles.hoverPrimary : styles.hoverSecondary)
            }
            onMouseOut={(e) => Object.assign(e.currentTarget.style, buttonStyle)}
        >
            {children}
        </button>
    );
}

Button.propTypes = {
    variant: PropTypes.oneOf(["primary", "secondary"]),
    onClick: PropTypes.func,
    children: PropTypes.node,
};
