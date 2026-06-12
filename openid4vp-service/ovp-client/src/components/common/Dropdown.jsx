import React from "react";
import {Palette, font} from "../../styles/palette";

/**
 * Dropdown component — mirrors the Toggle options shape:
 *   options: Array<{ name: string, selected: boolean, onChange: () => void }>
 */
const Dropdown = ({label, options, fullWidth = false, light = false}) => {
  const selected = options.find(o => o.selected) ?? options[0];

  const handleChange = (e) => {
    const chosen = options.find(o => o.name === e.target.value);
    chosen?.onChange();
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      marginBottom: fullWidth ? 0 : 10,
      fontFamily: font.primary,
      width: fullWidth ? '100%' : undefined,
    }}>
      {label && (
        <label style={{
          color: Palette.textDark,
          fontSize: '14px',
          whiteSpace: 'nowrap',
        }}>
          {label}
        </label>
      )}
      <select
        value={selected?.name}
        onChange={handleChange}
        style={{
          background: light ? Palette.surface : Palette.surfaceDark,
          color: light ? Palette.headingText : Palette.primaryText,
          border: `1px solid ${Palette.border}`,
          borderRadius: '8px',
          padding: '8px 12px',
          fontFamily: font.primary,
          fontSize: '12px',
          cursor: 'pointer',
          outline: 'none',
          boxShadow: fullWidth ? 'none' : `0 3px 6px ${Palette.primaryShadow}`,
          appearance: 'auto',
          width: fullWidth ? '100%' : undefined,
          boxSizing: 'border-box',
        }}
      >
        {options.map(option => (
          <option key={option.name} value={option.name}
                  style={{background: Palette.surfaceDark}}>
            {option.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Dropdown;

