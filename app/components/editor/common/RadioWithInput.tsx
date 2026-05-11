"use client";

import { useState } from "react";

interface RadioOption {
    value: string;
    label: string;
    hasInput?: boolean;
}

interface RadioWithInputProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
    options: RadioOption[];
    unit?: string;
    placeholder?: string;
}

export function RadioWithInput({
    label,
    value,
    onChange,
    options,
    unit = "px",
    placeholder = "200",
}: RadioWithInputProps) {
    const [lastCustomValue, setLastCustomValue] = useState<string>("");

    // 是否為輸入模式
    const [isInputMode, setIsInputMode] = useState<boolean>(() => {
        if (!value) return false;
        return !options.some((o) => !o.hasInput && o.value === value);
    });

    // 當前選中的 option
    const selectedOption = isInputMode
        ? options.find((opt) => opt.hasInput)
        : options.find((opt) => opt.value === value);

    // 去除輸入模式時的單位
    const numericValue =
        isInputMode && value ? value.replace(unit, "").trim() : "";

    const handleRadioChange = (optionValue: string, hasInput: boolean) => {
        if (hasInput) {
            // 切換為輸入模式
            setIsInputMode(true);
            const valueToUse = lastCustomValue || `${placeholder}${unit}`;
            onChange(valueToUse);
        } else {
            // 切換為其他模式
            if (isInputMode && value) {
                setLastCustomValue(value);
            }
            setIsInputMode(false);
            onChange(optionValue);
        }
    };

    return (
        <div className="space-y-2">
            <label className="block text-sm font-medium text-zinc-700">
                {label}
            </label>

            {/* Radio options */}
            <div className="space-y-1.5">
                {options.map((option) => (
                    <div key={option.value}>
                        <label className="flex items-center gap-2 text-sm cursor-pointer">
                            <input
                                type="radio"
                                name={`${label}-radio`}
                                checked={
                                    option.hasInput
                                        ? isInputMode
                                        : (selectedOption?.value ||
                                              options[0].value) === option.value
                                }
                                onChange={() =>
                                    handleRadioChange(
                                        option.value,
                                        option.hasInput || false,
                                    )
                                }
                                className="cursor-pointer"
                            />
                            <span>{option.label}</span>
                        </label>

                        {/* input */}
                        {option.hasInput && isInputMode && (
                            <div className="ml-6 mt-2">
                                <input
                                    type="number"
                                    value={numericValue}
                                    onChange={(e) => {
                                        const newValue = `${e.target.value}${unit}`;
                                        setLastCustomValue(newValue);
                                        onChange(newValue);
                                    }}
                                    placeholder={placeholder}
                                    className="flex-1 px-3 py-2 border border-zinc-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
