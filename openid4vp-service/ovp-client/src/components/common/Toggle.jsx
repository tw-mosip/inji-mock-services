import React, {useEffect, useState} from "react";
import {Palette, backgroundStyle, font, buttonStyles} from "../../styles/palette";

interface ToggleProps {
    options: [string, string];
    onChange?: (value: string) => void;
}

const Toggle: React.FC<ToggleProps> = ({ options }) => {
    const [selected, setSelected] = useState();

    useEffect(()=>{
        // iterate options and take the first one with selected as true
        const initial = options.find(option => option.selected);
        setSelected(initial?.name || options[0]?.name);
    },[])

    const handleToggle = (value) => {
        setSelected(value.name);
        value.onChange?.();
    };

    return (
        <div
            style={{
                background: Palette.surface,
                fontFamily: font.primary,
                marginBottom: 10,
                maxWidth: 'fit-content',
            }}
        >
            {options.map((option) => {
                const isActive = selected === option.name;

                return (
                    <button
                        key={option.name}
                        onClick={() => handleToggle(option)}
                        className="flex-1 py-2 px-4 text-sm font-medium rounded-xl transition-all duration-300"
                        style={{
                            border: `none`,
                            background: isActive
                                ? backgroundStyle.primaryGradient
                                : Palette.surfaceDark,
                            padding: '8px 16px',
                            color: isActive ? Palette.primaryText : Palette.secondaryText,
                            boxShadow: isActive ? `0 3px 6px ${Palette.primaryShadow}` : "none",
                            cursor: 'pointer',
                        }}
                    >
                        {option.name}
                    </button>
                );
            })}
        </div>
    );
};

export default Toggle;
