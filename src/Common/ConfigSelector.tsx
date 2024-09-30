import React from "react";

interface Option {
  value: string;
  title: string;
}

interface SelectorProps {
  label: string;
  selectedValue: string | undefined;
  onChange: (value: string) => void;
  options: Option[];
}

export const ConfigSelector: React.FC<SelectorProps> = React.memo(
  ({ label, selectedValue, onChange, options }) => (
    <div>
      <label htmlFor={`${label.toLowerCase()}-select`}>{label}</label>
      <select
        id={`${label.toLowerCase()}-select`}
        value={selectedValue || ''}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">Select {label}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.title}
          </option>
        ))}
      </select>
    </div>
  )
);

export default ConfigSelector;
