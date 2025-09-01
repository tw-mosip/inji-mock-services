// This holds the core color palette and typography styles for the application.

export const Palette = {
    // **Primary Brand Colors**
    primary: '#1E3C72',              // Deep Indigo — anchors the brand
    primaryGradientEnd: '#2A5298',   // Lighter Indigo for smooth gradient transitions

    // **Typography Colors** (High Contrast)
    headingText: '#F1F5FF',          // Bright off-white for headings on dark BGs
    primaryText: '#E2E8F0',          // Soft light gray for main body text
    secondaryText: '#CBD5E1',        // Muted gray for subtext & labels
    tertiaryText: '#94A3B8',         // Neutral for placeholders / captions
    linkText: '#60A5FA',             // Vibrant blue for links & interactive text
    linkHoverText: '#3B82F6',        // Brighter blue on hover
    disabledText: '#64748B',         // Faded gray for disabled text
    invertedText: '#1E293B',         // Text on light surfaces
    codeText: '#0f1',             // Dark text for code blocks

    // **Surface & Backgrounds**
    surface: '#FFFFFF',              // Clean card background
    surfaceDark: '#0F172A',          // Darker surfaces (optional modal/bg use)
    appBackground: '#F8FAFC',        // Page background (light mode)
    codeBackground: '#000',       // Light gray for code block backgrounds

    // **Status & Accent Colors**
    success: '#3DDC97',             // Fresh green
    warning: '#FFB020',             // Warm amber
    dangerLight: '#FECACA',         // Light red for backgrounds/borders
    danger: '#F43F5E',              // Vibrant red
    info: '#38BDF8',                // Bright cyan-blue

    // **Shadows & Overlays**
    primaryShadow: 'rgba(30, 60, 114, 0.25)',  // Indigo tinted — gives depth
    secondaryShadow: 'rgba(42, 82, 152, 0.15)',

    textDark: "#000",
    textLight: "#FFFFFF",
};

export const backgroundStyle = {
    primaryGradient: `linear-gradient(135deg, #1E3C72 0%, #2A5298 100%)`,
    secondaryGradient: `linear-gradient(135deg, #2A5298 0%, #4C6EF5 100%)`,
};

export const font = {
    primary: "'Inter', 'Source Sans 3', 'Helvetica Neue', 'Arial', sans-serif",
    code: "monospace, 'Courier New', Courier",
};
