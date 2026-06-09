export const cloneQuery = (query) => JSON.parse(JSON.stringify(query || { credentials: [], credential_sets: [] }));

export const ensureDcqlShape = (query) => {
  const safeQuery = query && typeof query === "object" && !Array.isArray(query) ? cloneQuery(query) : {};

  if (!Array.isArray(safeQuery.credentials)) {
    safeQuery.credentials = [];
  }

  if (!Array.isArray(safeQuery.credential_sets)) {
    safeQuery.credential_sets = [];
  }

  return safeQuery;
};

export const toPrettyJson = (value) => JSON.stringify(value, null, 2);

export const parseJsonSafely = (text) => {
  try {
    return { value: JSON.parse(text), error: null };
  } catch (error) {
    return { value: null, error: error.message || "Invalid JSON" };
  }
};

export const getCredentialIds = (query) => {
  return ensureDcqlShape(query).credentials
    .map((credential) => credential?.id)
    .filter((id) => typeof id === "string" && id.trim());
};

const isEmptyValue = (value) => {
  if (value === null || value === undefined) {
    return true;
  }

  if (typeof value === "string") {
    return value.trim().length === 0;
  }

  if (Array.isArray(value)) {
    return value.length === 0 || value.some((item) => isEmptyValue(item));
  }

  if (typeof value === "object") {
    const entries = Object.entries(value);
    return entries.length === 0 || entries.some(([, nestedValue]) => isEmptyValue(nestedValue));
  }

  return false;
};

export const validateClaimsArray = (claims) => {
  if (!Array.isArray(claims)) {
    return "claims must be a JSON array";
  }

  if (claims.length === 0) {
    return "claims array cannot be empty";
  }

  const hasInvalidClaim = claims.some((claim) => isEmptyValue(claim));
  if (hasInvalidClaim) {
    return "claims values cannot be empty or null";
  }

  return null;
};

export const validateDcqlQuery = (query) => {
  const errors = [];
  const safeQuery = ensureDcqlShape(query);
  const ids = safeQuery.credentials
    .map((credential) => (credential?.id || "").trim())
    .filter(Boolean);

  if (!safeQuery.credentials.length) {
    errors.push("At least one credential query is recommended.");
  }

  const uniqueIds = new Set(ids);
  if (uniqueIds.size !== ids.length) {
    errors.push("Credential IDs must be unique.");
  }

  safeQuery.credentials.forEach((credential, credentialIndex) => {
    if (credential && Object.prototype.hasOwnProperty.call(credential, "claims")) {
      const claimValidationError = validateClaimsArray(credential.claims);
      if (claimValidationError) {
        errors.push(`Credential ${credentialIndex + 1} ${claimValidationError}.`);
      }
    }
  });

  safeQuery.credential_sets.forEach((setItem, setIndex) => {
    const options = Array.isArray(setItem?.options) ? setItem.options : [];
    options.forEach((group, groupIndex) => {
      if (!Array.isArray(group)) {
        errors.push(`Credential set ${setIndex + 1}, option ${groupIndex + 1} must be an array.`);
        return;
      }

      group.forEach((id) => {
        if (!uniqueIds.has(id)) {
          errors.push(`Credential set ${setIndex + 1} references unknown id: ${id}`);
        }
      });
    });
  });

  return errors;
};
