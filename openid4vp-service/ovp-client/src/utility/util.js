export const decodeJwt = (jwt) => {
    try {
        const parts = String(jwt).split('.');
        if (parts.length < 2) return null;
        const decodeBase64Url = (str) => {
            const padded = str.replace(/-/g, '+').replace(/_/g, '/');
            const jsonStr = atob(padded);
            return JSON.parse(jsonStr);
        };
        const header = decodeBase64Url(parts[0]);
        const payload = decodeBase64Url(parts[1]);
        return { header, payload, signature: parts[2] || '' };
    } catch {
        return null;
    }
};

export const handleCopy = (textSetter, setToast) => {
    navigator.clipboard.writeText(textSetter);
    setToast(true);
    setTimeout(() => setToast(false), 2000);
};

export const isMobileLayout = () => window.matchMedia('(max-width: 768px)').matches;