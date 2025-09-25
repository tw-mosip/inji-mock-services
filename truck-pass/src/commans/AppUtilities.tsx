export const base64ToFile = (base64Data: string, filename: string): File => {
    const [metadata, base64String] = base64Data.split(',');
    const mimeMatch = metadata.match(/data:(.*);base64/);

    if (!mimeMatch) {
        throw new Error('Invalid base64 string format');
    }

    const mimeType = mimeMatch[1];
    const byteString = atob(base64String);
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);

    for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }

    const blob = new Blob([ab], { type: mimeType });
    return new File([blob], filename, { type: mimeType });
};

