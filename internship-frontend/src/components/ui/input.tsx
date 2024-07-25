import React from "react";

type InputType = "text" | "email" | "password" | "number";

interface InputFieldProps {
  label: string;
  id: string;
  name: string;
  value: string | number;
  type?: InputType;
  required?: boolean;
  readonly?: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  id,
  name,
  value,
  type = "text",
  required = false,
  readonly = false,
  onChange,
}) => {
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (type === "number" && (event.key === "-" || event.key === "e")) {
      event.preventDefault();
    }
  };
  return (
    <div className="mb-5">
      <label htmlFor={id} className="block mb-2 text-sm font-medium text-white">
        {label}
      </label>
      <input
        type={type}
        id={id}
        name={name}
        value={value}
        min={type === "number" ? 0 : undefined}
        className="text-sm rounded-lg w-full p-2.5 bg-gray-600 placeholder-gray-400 text-white"
        required={required}
        readOnly={readonly}
        onChange={onChange}
        onKeyDown={handleKeyDown}
      />
    </div>
  );
};

export default InputField;
