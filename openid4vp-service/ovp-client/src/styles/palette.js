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

    // **Borders & Muted Surfaces**
    border: '#E5E5EA',
    borderLight: '#F0F0F0',
    mutedSurface: '#F5F5F5',
};

export const spacing = {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
    xxxl: 32,
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

export const cardStyles = {
    base: {
        background: Palette.surface,
        borderRadius: '12px',
        border: `1px solid ${Palette.border}`,
        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
        overflow: 'hidden',
    },
    padding: {
        padding: `${spacing.xl}px`,
    },
    sectionTitle: {
        fontSize: '12px',
        fontWeight: 600,
        color: Palette.tertiaryText,
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        margin: 0,
    },
    accordionHeader: {
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: `${spacing.md + 2}px ${spacing.xl}px`,
        fontSize: '14px',
        fontWeight: 500,
        color: Palette.headingText,
        cursor: 'pointer',
        background: 'transparent',
        border: 'none',
        fontFamily: font.primary,
        textAlign: 'left',
    },
};

export const buttonStyles = {
    base: {
        fontFamily: font.primary,
        fontWeight: 600,
        fontSize: "15px",
        borderRadius: "12px",
        border: "none",
        cursor: "pointer",
        transition: "all 0.3s ease",
    },

    primary: {
        background: backgroundStyle.primaryGradient,
        boxShadow: `0 4px 10px ${Palette.primaryShadow}`,
        color: Palette.primaryText,
        padding: "10px 18px",
    },

    secondary: {
        background: "#fff",
        color: Palette.primary,
        padding: "10px 18px",
        border: `1px solid ${Palette.primary}`,
        boxShadow: `0 4px 8px ${Palette.secondaryShadow}`,
    },

    tertiary: {
        background: "#fff",
        color: Palette.primary,
        border: 0,
        padding: 2
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

