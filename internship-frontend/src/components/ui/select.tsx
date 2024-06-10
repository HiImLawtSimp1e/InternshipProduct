import React from "react";

interface SelectFieldProps {
  label: string;
  id: string;
  name: string;
  value: string;
  options: { label: string; value: string }[];
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const SelectField: React.FC<SelectFieldProps> = ({
  label,
  id,
  name,
  value,
  options,
  onChange,
}) => {
  return (
    <div className="mb-5">
      <label htmlFor={id} className="block mb-2 text-sm font-medium text-white">
        {label}
      </label>
      <select
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        className="text-sm rounded-lg w-full p-2.5 bg-gray-600 placeholder-gray-400 text-white"
      >
        {options.map((option, index) => (
          <option key={index} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SelectField;
