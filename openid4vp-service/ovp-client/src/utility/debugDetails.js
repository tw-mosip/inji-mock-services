import axios from 'axios';
import {decodeJwt} from './util';

export const downloadDebugDetails = async (qrData, qrCodeData, inputData, actualAuthorizationRequestObject) => {
    let md = '';

    // QR Image
    md += '# QR Image\n\n';
    if (qrCodeData) {
        md += `![QR Image](${qrCodeData})\n\n`;
    }

    // QR Data (payload)
    md += '# QR Data\n\n';
    md += '```\n' + (qrData || '') + '\n```\n\n';

    // Input Data
    md += '# Input Data\n\n';
    md += '```json\n' + (inputData ? JSON.stringify(inputData, null, 2) : '') + '\n```\n\n';

    // Decoded Input Data (if request param exists)
    if (inputData?.request) {
        const decoded = decodeJwt(inputData.request);
        if (decoded) {
            md += '## Decoded Input Data\n\n';
            md += '```json\n' + JSON.stringify(decoded, null, 2) + '\n```\n\n';
        }
    }

    // Request URI Response
    let requestUriResponse = actualAuthorizationRequestObject;
    if (requestUriResponse === null && inputData?.request_uri) {
        try {
            const requestUriMethod = inputData?.request_uri_method ?? 'get';
            const uriResp = await axios({
                method: requestUriMethod,
                url: inputData.request_uri,
                headers: {'ngrok-skip-browser-warning': 'true'},
            });
            requestUriResponse = uriResp.data;
        } catch (e) {
            requestUriResponse = `Error fetching request URI: ${e.message}`;
        }
    }

    if (requestUriResponse !== null && requestUriResponse !== undefined) {
        md += '# Request URI Response\n\n';
        const responseStr = typeof requestUriResponse === 'string'
            ? requestUriResponse
            : JSON.stringify(requestUriResponse, null, 2);
        md += '```\n' + responseStr + '\n```\n\n';

        // Decoded Request URI Response (if it is a JWT string)
        if (typeof requestUriResponse === 'string') {
            const decoded = decodeJwt(requestUriResponse);
            if (decoded) {
                md += '## Decoded Request URI Response\n\n';
                md += '```json\n' + JSON.stringify(decoded, null, 2) + '\n```\n\n';
            }
        }
    }

    const blob = new Blob([md], {type: 'text/markdown'});
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'debug-details.md';
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);
};
