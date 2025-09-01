import PropTypes from "prop-types";
import {Palette, font, buttonStyles} from "../../styles/palette";

export default function Button({ variant = "primary", onClick, children, style }) {
    const isPrimary = variant === "primary";
    const buttonStyle = {
        ...buttonStyles.base,
        ...(isPrimary ? buttonStyles.primary : buttonStyles.secondary),
        ...style,
    };

    return (
        <button
            style={buttonStyle}
            onClick={onClick}
            onMouseOver={(e) =>
                Object.assign(e.currentTarget.style, isPrimary ? buttonStyles.hoverPrimary : buttonStyles.hoverSecondary)
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
