export const prettyScanResult = (result) => {
  const parsed = { ...result };

  const keysToParse = ['vp_token', 'presentation_submission', 'state'];

  keysToParse.forEach((key) => {
    if (typeof parsed[key] === 'string') {
      try {
        parsed[key] = JSON.parse(parsed[key]);
      } catch (e) {
        console.error("Parsing failed, Fallback to origin json structure for key:", key, e);
      }
    }
  });
  return parsed;
};
