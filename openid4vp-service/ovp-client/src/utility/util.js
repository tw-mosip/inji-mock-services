export const handleCopy = (textSetter, setToast) => {
    navigator.clipboard.writeText(textSetter);
    setToast(true);
    setTimeout(() => setToast(false), 2000);
};