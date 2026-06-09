import React, { useEffect, useState } from "react";
import Button from "./common/Button";
import Error from "./common/Error";
import { Palette } from "../styles/palette";

const toPrettyJson = (obj) => JSON.stringify(obj, null, 2);

const parseJsonSafely = (text) => {
  try {
    return { value: JSON.parse(text), error: null };
  } catch (err) {
    return { value: null, error: err.message };
  }
};

export default function PresentationDefinitionEditor({
  value,
  disabled,
  onChange,
  onEdited,
}) {
  const [jsonText, setJsonText] = useState(toPrettyJson(value || {}));
  const [jsonError, setJsonError] = useState(null);

  useEffect(() => {
    const parsedCurrentText = parseJsonSafely(jsonText);
    const nextValue = value || {};

    // Keep local typing intact when textarea content already represents
    // the same JSON as incoming prop value.
    if (
      !parsedCurrentText.error &&
      JSON.stringify(parsedCurrentText.value) === JSON.stringify(nextValue)
    ) {
      return;
    }

    setJsonText(toPrettyJson(nextValue));
  }, [value]);

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
    onChange(parsed.value);
    onEdited?.();
  };

  const onReset = () => {
    if (disabled) return;
    const empty = { input_descriptors: [], id: "", purpose: "" };
    setJsonText(toPrettyJson(empty));
    setJsonError(null);
    onChange(empty);
    onEdited?.();
  };

  return (
    <div>
      <div style={{ marginBottom: 12, display: "flex", gap: 8, flexWrap: "wrap" }}>
        <Button
          variant={"tertiary"}
          onClick={onReset}
        >
          Reset Empty
        </Button>
      </div>

      {disabled && (
        <p style={{ marginTop: 0, color: "#666" }}>
          Editing is disabled for this draft. Switch to draft-23 to edit.
        </p>
      )}

      <div>
        <label style={{ display: "block", marginBottom: 8, fontWeight: 600 }}>
          Presentation Definition JSON
        </label>
        <textarea
          value={jsonText}
          onChange={onJsonChange}
          disabled={disabled}
          style={{
            width: "100%",
            minHeight: 350,
            fontFamily: "monospace",
            fontSize: 12,
            padding: 10,
            border: "1px solid #ddd",
            borderRadius: 6,
            resize: "vertical",
            backgroundColor: disabled ? "#f7f7f7" : "#fff",
            fontColor: Palette.textDark,
          }}
        />
      </div>

      {jsonError && <Error message={`JSON Error: ${jsonError}`} />}
    </div>
  );
}
