import PropTypes from "prop-types";
import {Palette, font, buttonStyles} from "../../styles/palette";

export default function Button({ variant = "primary", onClick, children, style }) {
    const isPrimary = variant === "primary";
    const isSecondary = variant === "secondary";
    const buttonStyle = {
        ...buttonStyles.base,
        ...(isPrimary ? buttonStyles.primary : (isSecondary ? buttonStyles.secondary : buttonStyles.tertiary)),
        ...style,
    };

    return (
        <button
            style={buttonStyle}
            onClick={onClick}
            onMouseOver={(e) =>
                Object.assign(e.currentTarget.style, isPrimary ? buttonStyles.hoverPrimary : (isSecondary ? buttonStyles.hoverSecondary : {}))
            }
            onMouseOut={(e) => Object.assign(e.currentTarget.style, buttonStyle)}
        >
            {children}
        </button>
    );
}

Button.propTypes = {
    variant: PropTypes.oneOf(["primary", "secondary", "tertiary"]),
    onClick: PropTypes.func,
    children: PropTypes.node,
};
