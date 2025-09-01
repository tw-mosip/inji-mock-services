// Core Inji-inspired color palette & typography styles

export const Palette = {
    // **Primary Brand Colors**
    primary: '#FF5300',   // Vibrant orange
    gradientBtn: ['#FF5300', '#5B03AD'], // Gradient colors for buttons

    // **Typography Colors** (High Contrast)
    headingText: '#1C1C1E',          // Darker heading tone for contrast
    primaryText: '#ffffff',          // Main readable gray for body text
    secondaryText: '#cfcaca',        // Muted gray for labels/subtext
    tertiaryText: '#7A7A7A',         // Neutral placeholders/captions
    linkText: '#5B03AD',             // Purple links matching brand tone
    linkHoverText: '#FF5300',        // Orange accent on hover
    disabledText: '#A3A3A3',         // Muted disabled text
    invertedText: '#FFFFFF',         // Text on dark surfaces
    codeText: '#0f1',             // Neutral code blocks

    // **Surface & Backgrounds**
    surface: '#FFFFFF',              // Cards & modals
    surfaceDark: '#3c3c3e',          // Softer gray for secondary backgrounds
    appBackground: '#FAFAFA',        // Light mode page background
    codeBackground: '#000',       // Background for code blocks

    // **Status & Accent Colors**
    success: '#ccf6cc',             // Bright success green
    warning: '#FFB020',             // Warm amber
    dangerLight: '#FFE3E3',         // Subtle red background
    danger: '#fac5c5',              // Strong red for alerts
    info: '#00B0FF',                // Clean cyan accent

    // **Shadows & Overlays**
    primaryShadow: 'rgba(91, 3, 173, 0.25)',   // Purple-tinted shadow
    secondaryShadow: 'rgba(255, 83, 0, 0.2)',  // Orange-tinted shadow

    textDark: "#000000",
    textLight: "#FFFFFF",
};

export const backgroundStyle = {
    primaryGradient: `linear-gradient(135deg, #FF5300 0%, #5B03AD 100%)`, // Correct Inji gradient
    primaryGradientLight: `linear-gradient(135deg, #FF7E3B 0%, #7E4FF8 100%)`, // Lighter variant
    secondaryGradient: `linear-gradient(135deg, #5B03AD 0%, #7E4FF8 100%)`,
};

export const font = {
    primary: "'Inter', 'Poppins', 'Helvetica Neue', 'Arial', sans-serif",
    code: "monospace, 'Courier New', Courier",
};

export const buttonStyles = {
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
        background: backgroundStyle.primaryGradient,
        color: Palette.primaryText,
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
        background: backgroundStyle.primaryGradient,
        color: Palette.primaryText,
        transform: "translateY(-1px)",
    },
};

