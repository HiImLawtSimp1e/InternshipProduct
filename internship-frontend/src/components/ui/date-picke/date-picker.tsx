import React from "react";
import DatePicker from "react-datepicker";
import "./date-picker.css";
import { format } from "date-fns";

interface DatePickerFieldProps {
  label: string;
  id: string;
  name: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const DatePickerField: React.FC<DatePickerFieldProps> = ({
  label,
  id,
  name,
  value,
  onChange,
}) => {
  const handleDateChange = (date: Date | null) => {
    if (date) {
      const formattedDate = format(date, "yyyy-MM-dd'T'HH:mm:ssXXX");
      // Tạo sự kiện giả để phù hợp với loại sự kiện ChangeEvent<HTMLInputElement>
      const event = {
        target: {
          name,
          value: formattedDate,
        },
      } as React.ChangeEvent<HTMLInputElement>;

      onChange(event);
    } else {
      // Nếu không có ngày, gửi giá trị rỗng
      const event = {
        target: {
          name,
          value: "",
        },
      } as React.ChangeEvent<HTMLInputElement>;

      onChange(event);
    }
  };

  return (
    <div className="mb-5">
      <label htmlFor={id} className="block mb-2 text-sm font-medium text-white">
        {label}
      </label>
      <div>
        <DatePicker
          selected={value ? new Date(value) : null}
          onChange={handleDateChange}
          className="text-sm w-full rounded-lg p-2.5 bg-gray-600 placeholder-gray-400 text-white"
          id={id}
          name={name}
          dateFormat="yyyy-MM-dd"
        />
      </div>
    </div>
  );
};

export default DatePickerField;
