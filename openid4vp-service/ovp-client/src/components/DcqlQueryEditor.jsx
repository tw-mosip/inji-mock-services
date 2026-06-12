import React, { useEffect, useMemo, useState } from "react";
import Button from "./common/Button";
import CheckBox from "./common/checkBox";
import Dropdown from "./common/Dropdown";
import Error from "./common/Error";
import { DCQL_FORMAT_OPTIONS, DCQL_PRESETS } from "../constants/dcql-presets";
import {
  ensureDcqlShape,
  getCredentialIds,
  parseJsonSafely,
  toPrettyJson,
  validateDcqlQuery,
  validateClaimsArray,
  cloneQuery,
} from "../utility/dcqlHelper";
import Toggle from "./common/Toggle";

const newCredential = () => ({
  id: `credential-${Date.now()}`,
  format: "vc+sd-jwt",
  meta: {},
  require_cryptographic_holder_binding: false,
});

const newCredentialSet = () => ({
  options: [[]],
  required: false,
});

const optionFromValue = (currentValue, values, onChange) => {
  return values.map((value) => ({
    name: value,
    selected: currentValue === value,
    onChange: () => onChange(value),
  }));
};

const stripEmptyCredentialSets = (query) => {
  const nextQuery = cloneQuery(query || {});
  if (Array.isArray(nextQuery.credential_sets) && nextQuery.credential_sets.length === 0) {
    delete nextQuery.credential_sets;
  }

  return nextQuery;
};

export default function DcqlQueryEditor({
  value,
  disabled,
  onChange,
  onEdited,
  allowInvalidRequest = false,
  onAllowInvalidRequestChange,
}) {
  const [editorMode, setEditorMode] = useState("form");
  const [selectedPresets, setSelectedPresets] = useState([]);
  const [jsonText, setJsonText] = useState(toPrettyJson(ensureDcqlShape(value)));
  const [jsonError, setJsonError] = useState(null);
  const [metaDraftByIndex, setMetaDraftByIndex] = useState({});
  const [claimsDraftByIndex, setClaimsDraftByIndex] = useState({});
  const [setOptionsDraftByIndex, setSetOptionsDraftByIndex] = useState({});

  const rawValue = useMemo(() => (
    value && typeof value === "object" && !Array.isArray(value)
      ? cloneQuery(value)
      : {}
  ), [value]);
  const safeValue = useMemo(() => ensureDcqlShape(value), [value]);
  const credentialIds = useMemo(() => getCredentialIds(safeValue), [safeValue]);
  const validationErrors = useMemo(() => validateDcqlQuery(safeValue), [safeValue]);

  useEffect(() => {
    const nextJsonValue = allowInvalidRequest
      ? rawValue
      : stripEmptyCredentialSets(safeValue);
    setJsonText(toPrettyJson(nextJsonValue));
  }, [allowInvalidRequest, rawValue, safeValue]);

  useEffect(() => {
    setMetaDraftByIndex({});
    setClaimsDraftByIndex({});
    setSetOptionsDraftByIndex({});
  }, [safeValue]);

  const applyQuery = (nextQuery, normalize = true) => {
    if (!normalize) {
      onChange(nextQuery);
      onEdited();
      return;
    }

    const normalizedQuery = stripEmptyCredentialSets(ensureDcqlShape(nextQuery));
    onChange(normalizedQuery);
    onEdited();
  };

  const updateCredential = (index, key, updatedValue) => {
    const nextQuery = cloneQuery(safeValue);
    nextQuery.credentials[index] = {
      ...nextQuery.credentials[index],
      [key]: updatedValue,
    };
    applyQuery(nextQuery, false);
  };

  const commitCredentialMetaText = (index, metaText) => {
    const parsed = parseJsonSafely(metaText || "{}");
    if (parsed.error) {
      setJsonError(`Credential ${index + 1} meta: ${parsed.error}`);
      return;
    }

    setJsonError(null);
    updateCredential(index, "meta", parsed.value);
    setMetaDraftByIndex((prev) => {
      const next = { ...prev };
      delete next[index];
      return next;
    });
  };

  const commitCredentialClaimsText = (index, claimsText) => {
    const parsed = parseJsonSafely(claimsText || "[]");
    if (parsed.error) {
      setJsonError(`Credential ${index + 1} claims must be a JSON array`);
      return;
    }

    const claimsValidationError = validateClaimsArray(parsed.value);
    if (claimsValidationError) {
      setJsonError(`Credential ${index + 1} ${claimsValidationError}`);
      return;
    }

    setJsonError(null);
    updateCredential(index, "claims", parsed.value);
    setClaimsDraftByIndex((prev) => {
      const next = { ...prev };
      delete next[index];
      return next;
    });
  };

  const removeCredentialClaims = (index) => {
    if (disabled) return;

    const nextQuery = cloneQuery(safeValue);
    if (!nextQuery.credentials[index]) {
      return;
    }

    delete nextQuery.credentials[index].claims;
    applyQuery(nextQuery, false);
    setJsonError(null);
    setClaimsDraftByIndex((prev) => {
      const next = { ...prev };
      delete next[index];
      return next;
    });
  };

  const commitSetOptionsFromText = (setIndex, text) => {
    const parsed = parseJsonSafely(text || "[]");
    if (parsed.error || !Array.isArray(parsed.value)) {
      setJsonError(`Credential set ${setIndex + 1} options must be a JSON array of arrays`);
      return;
    }

    const normalized = parsed.value.map((group) => Array.isArray(group) ? group : []);
    const nextQuery = cloneQuery(safeValue);
    nextQuery.credential_sets[setIndex] = {
      ...nextQuery.credential_sets[setIndex],
      options: normalized,
    };

    setJsonError(null);
    applyQuery(nextQuery, true);
    setSetOptionsDraftByIndex((prev) => {
      const next = { ...prev };
      delete next[setIndex];
      return next;
    });
  };

  const addSelectedPresetsIntoCurrentQuery = (presetsToAdd = selectedPresets) => {
    const selectedPresetEntries = DCQL_PRESETS.filter((preset) => presetsToAdd.includes(preset.value));
    if (!selectedPresetEntries.length) {
      return;
    }

    const nextQuery = cloneQuery(safeValue);
    const existingCredentialIds = new Set(
      nextQuery.credentials
        .map((credential) => credential?.id)
        .filter((id) => typeof id === "string" && id.trim())
    );
    const existingSetSignatures = new Set(
      nextQuery.credential_sets.map((setItem) => JSON.stringify(setItem))
    );

    selectedPresetEntries.forEach((preset) => {
      const safePreset = ensureDcqlShape(preset.query);
      safePreset.credentials.forEach((credential) => {
        if (!credential?.id) {
          return;
        }

        if (!existingCredentialIds.has(credential.id)) {
          nextQuery.credentials.push(cloneQuery(credential));
          existingCredentialIds.add(credential.id);
        }
      });

      safePreset.credential_sets.forEach((credentialSet) => {
        const signature = JSON.stringify(credentialSet);
        if (!existingSetSignatures.has(signature)) {
          nextQuery.credential_sets.push(cloneQuery(credentialSet));
          existingSetSignatures.add(signature);
        }
      });
    });

    applyQuery(nextQuery, true);
  };

  const addCredential = () => {
    if (disabled) return;
    const nextQuery = cloneQuery(safeValue);
    nextQuery.credentials.push(newCredential());
    applyQuery(nextQuery, true);
  };

  const removeCredential = (index) => {
    if (disabled) return;
    const nextQuery = cloneQuery(safeValue);
    nextQuery.credentials.splice(index, 1);
    nextQuery.credential_sets = nextQuery.credential_sets.map((setItem) => ({
      ...setItem,
      options: (setItem.options || []).map((group) =>
        (group || []).filter((id) => id !== safeValue.credentials[index]?.id)
      ),
    }));
    applyQuery(nextQuery, true);
  };

  const addCredentialSet = () => {
    if (disabled) return;
    const nextQuery = cloneQuery(safeValue);
    nextQuery.credential_sets.push(newCredentialSet());
    applyQuery(nextQuery, true);
  };

  const removeCredentialSet = (setIndex) => {
    if (disabled) return;
    const nextQuery = cloneQuery(safeValue);
    nextQuery.credential_sets.splice(setIndex, 1);
    applyQuery(nextQuery);
  };

  const onJsonChange = (event) => {
    if (disabled) return;
    const nextText = event.target.value;
    setJsonText(nextText);
    const parsed = parseJsonSafely(nextText);

    if (parsed.error) {
      setJsonError(parsed.error);
      return;
    }

    setJsonError(null);
    applyQuery(parsed.value, !allowInvalidRequest);
  };

  const togglePresetSelection = (presetValue) => {
    if (disabled) return;
    setSelectedPresets((prev) => {
      let nextSelection;
      if (prev.includes(presetValue)) {
        nextSelection = prev.filter((value) => value !== presetValue);
      } else {
        nextSelection = [...prev, presetValue];
      }

      // Immediately add selected templates while preserving existing user edits.
      addSelectedPresetsIntoCurrentQuery(nextSelection);
      return nextSelection;
    });
  };

  const editorOptions = [
    { name: 'Form', selected: editorMode === "form", onChange: () => setEditorMode("form") },
    { name: 'JSON', selected: editorMode === "json", onChange: () => setEditorMode("json") },
  ];

  return (
    <div>
      <div style={{ marginBottom: 12, display: "flex", gap: 8, flexWrap: "wrap", flexDirection: "column", justifyContent: "space-between", }}>
        <div style={{ border: "1px solid #e6e6e6", borderRadius: 8, padding: 8, minWidth: 280 }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Select Query (multi-select)</div>
          {DCQL_PRESETS.map((preset) => (
            <CheckBox
              key={preset.value}
              id={`preset-${preset.value}`}
              label={preset.name}
              checked={selectedPresets.includes(preset.value)}
              onClick={() => togglePresetSelection(preset.value)}
            />
          ))}
          <div style={{ marginTop: 8, display: "flex", gap: 8, flexWrap: "wrap" }}>
            <Button variant={"secondary"} onClick={() => addSelectedPresetsIntoCurrentQuery()}>Apply Selected</Button>
            <Button
              variant={"tertiary"}
              onClick={() => {
                if (disabled) return;
                setSelectedPresets([]);
              }}
            >
              Clear Selection
            </Button>
          </div>
        </div>
        <div>
          <Toggle options={editorOptions} />
          <div style={{display: 'flex', flexDirection: "row", gap: 20}}><CheckBox
            id={"allow-invalid-request"}
            label={"Allow invalid request"}
            checked={allowInvalidRequest}
            onClick={(checked) => {
              if (disabled) return;
              onAllowInvalidRequestChange?.(checked);
            }}
          />
            <Button
              variant={"tertiary"}
              onClick={() => {
                if (disabled) return;
                applyQuery({ credentials: [], credential_sets: [] }, !allowInvalidRequest);
              }}
            >
              Reset
            </Button></div>
        </div>
      </div>

      {disabled && (
        <p style={{ marginTop: 0, color: "#666" }}>
          Editing is disabled for this draft. Switch to version-1.0 to edit.
        </p>
      )}

      {editorMode === "json" ? (
        <textarea
          value={jsonText}
          onChange={onJsonChange}
          disabled={disabled}
          style={{
            width: "100%",
            minHeight: 220,
            fontFamily: "monospace",
            fontSize: 12,
            padding: 10,
            border: "1px solid #ddd",
            borderRadius: 6,
            resize: "vertical",
            backgroundColor: disabled ? "#f7f7f7" : "#fff",
          }}
        />
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <h4 style={{ marginBottom: 0 }}>Credential Queries</h4>
          {safeValue.credentials.map((credential, index) => {
            const formatOptions = optionFromValue(
              credential.format,
              DCQL_FORMAT_OPTIONS,
              (nextValue) => updateCredential(index, "format", nextValue)
            );

            return (
              <div key={`credential-${index}`} style={{ border: "1px solid #e6e6e6", borderRadius: 8, padding: 10 }}>
                <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8 }}>
                  <label style={{ minWidth: 92 }}>ID</label>
                  <input
                    type="text"
                    value={credential.id || ""}
                    disabled={disabled}
                    onChange={(event) => updateCredential(index, "id", event.target.value)}
                    style={{ flex: 1, padding: "6px 8px", borderRadius: 6, border: "1px solid #d0d0d0" }}
                  />
                  <Button variant={"tertiary"} onClick={() => removeCredential(index)} style={{ padding: "6px 10px" }}>Delete</Button>
                </div>

                <Dropdown label={"Format:"} options={formatOptions} />

                <CheckBox
                  checked={!!credential.multiple}
                  onClick={(checked) => {
                    if (disabled) return;
                    updateCredential(index, "multiple", checked);
                  }}
                  label={"Allow multiple"}
                  id={`multiple-${index}`}
                />

                <CheckBox
                  checked={!!credential.require_cryptographic_holder_binding}
                  onClick={(checked) => {
                    if (disabled) return;
                    updateCredential(index, "require_cryptographic_holder_binding", checked);
                  }}
                  label={"Require cryptographic holder binding"}
                  id={`holder-binding-${index}`}
                />

                <label style={{ display: "block", marginBottom: 4 }}>Meta JSON</label>
                <textarea
                  value={metaDraftByIndex[index] ?? toPrettyJson(credential.meta || {})}
                  disabled={disabled}
                  onChange={(event) => {
                    const nextText = event.target.value;
                    setMetaDraftByIndex((prev) => ({ ...prev, [index]: nextText }));
                  }}
                  onBlur={(event) => commitCredentialMetaText(index, event.target.value)}
                  style={{
                    width: "100%",
                    minHeight: 90,
                    fontFamily: "monospace",
                    fontSize: 12,
                    padding: 8,
                    border: "1px solid #ddd",
                    borderRadius: 6,
                    resize: "vertical",
                    backgroundColor: disabled ? "#f7f7f7" : "#fff",
                  }}
                />

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8, marginBottom: 4 }}>
                  <label style={{ display: "block", marginBottom: 0 }}>Claims JSON Array</label>
                  <Button variant={"tertiary"} onClick={() => removeCredentialClaims(index)} style={{ padding: "4px 10px" }}>Delete Claims</Button>
                </div>
                <textarea
                  value={claimsDraftByIndex[index] ?? toPrettyJson(credential.claims || [])}
                  disabled={disabled}
                  onChange={(event) => {
                    const nextText = event.target.value;
                    setClaimsDraftByIndex((prev) => ({ ...prev, [index]: nextText }));
                  }}
                  onBlur={(event) => commitCredentialClaimsText(index, event.target.value)}
                  style={{
                    width: "100%",
                    minHeight: 90,
                    fontFamily: "monospace",
                    fontSize: 12,
                    padding: 8,
                    border: "1px solid #ddd",
                    borderRadius: 6,
                    resize: "vertical",
                    backgroundColor: disabled ? "#f7f7f7" : "#fff",
                  }}
                />
              </div>
            );
          })}

          <div>
            <Button variant={"tertiary"} onClick={addCredential}>Add Credential Query</Button>
          </div>

          <h4 style={{ marginBottom: 0 }}>Credential Sets</h4>
          {safeValue.credential_sets.map((setItem, setIndex) => (
            <div key={`credential-set-${setIndex}`} style={{ border: "1px solid #e6e6e6", borderRadius: 8, padding: 10 }}>
              <CheckBox
                checked={!!setItem.required}
                onClick={(checked) => {
                  if (disabled) return;
                  const nextQuery = cloneQuery(safeValue);
                  nextQuery.credential_sets[setIndex] = {
                    ...nextQuery.credential_sets[setIndex],
                    required: checked,
                  };
                  applyQuery(nextQuery);
                }}
                label={"Required"}
                id={`credential-set-required-${setIndex}`}
              />

              <label style={{ display: "block", marginBottom: 4 }}>Options JSON (array of credential-id arrays)</label>
              <textarea
                value={setOptionsDraftByIndex[setIndex] ?? toPrettyJson(setItem.options || [])}
                disabled={disabled}
                onChange={(event) => {
                  const nextText = event.target.value;
                  setSetOptionsDraftByIndex((prev) => ({ ...prev, [setIndex]: nextText }));
                }}
                onBlur={(event) => commitSetOptionsFromText(setIndex, event.target.value)}
                style={{
                  width: "100%",
                  minHeight: 90,
                  fontFamily: "monospace",
                  fontSize: 12,
                  padding: 8,
                  border: "1px solid #ddd",
                  borderRadius: 6,
                  resize: "vertical",
                  backgroundColor: disabled ? "#f7f7f7" : "#fff",
                }}
              />
              <div style={{ marginTop: 8 }}>
                <Button variant={"tertiary"} onClick={() => removeCredentialSet(setIndex)}>Delete Credential Set</Button>
              </div>
            </div>
          ))}

          <div>
            <Button variant={"tertiary"} onClick={addCredentialSet}>Add Credential Set</Button>
          </div>

          {!!credentialIds.length && (
            <p style={{ marginBottom: 0, color: "#666" }}>Available credential ids: {credentialIds.join(", ")}</p>
          )}
        </div>
      )}

      {jsonError && <Error message={jsonError} />}
      {!allowInvalidRequest && validationErrors.length > 0 && <Error message={validationErrors.join(" ")} />}
    </div>
  );
}
