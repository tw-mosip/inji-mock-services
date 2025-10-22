export const handleCopy = (textSetter, setToast) => {
    navigator.clipboard.writeText(textSetter);
    setToast(true);
    setTimeout(() => setToast(false), 2000);
};

export const decodeJWT = (jwt: string, setErrorMessage) => {
    const parts = jwt.split('.');
    if (parts.length !== 3) {
        setErrorMessage("Invalid JWT format");
        return;
    }
    const header = JSON.parse(atob(parts[0].replace(/-/g, '+').replace(/_/g, '/').padEnd(parts[0].length + (4 - parts[0].length % 4) % 4, '=')));
    const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/').padEnd(parts[1].length + (4 - parts[1].length % 4) % 4, '=')));
    return {header, payload};
}