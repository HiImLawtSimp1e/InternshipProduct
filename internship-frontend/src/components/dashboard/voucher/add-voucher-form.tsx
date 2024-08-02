"use client";

import { addVoucher } from "@/action/voucherAction";
import DatePickerField from "@/components/ui/date-picke/date-picker";
import InputField from "@/components/ui/input";
import SelectField from "@/components/ui/select";
import { useCustomActionState } from "@/lib/custom/customHook";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const AddVoucherForm = () => {
  const router = useRouter();

  const initialState: FormState = { errors: [] };
  const [formState, formAction] = useCustomActionState<FormState>(
    addVoucher,
    initialState
  );

  const [toastDisplayed, setToastDisplayed] = useState(false);

  const [formData, setFormData] = useState({
    code: "",
    voucherName: "",
    isDiscountPercent: false,
    discountValue: "",
    minOrderCondition: "",
    maxDiscountValue: "",
    quantity: 1000,
    startDate: "",
    endDate: "",
  });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    formAction(formData);
    setToastDisplayed(false); // Reset toastDisplayed when submitting
  };

  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  useEffect(() => {
    if (formState.errors.length > 0 && !toastDisplayed) {
      toast.error("Create voucher failed");
      setToastDisplayed(true); // Set toastDisplayed to true to prevent multiple toasts
    }
    if (formState.success) {
      toast.success("Created voucher successfully!");
      router.push(`/dashboard/vouchers`);
    }
  }, [formState, toastDisplayed]);

  return (
    <form onSubmit={handleSubmit} className="px-4 w-full">
      <InputField
        label="Discount Code"
        id="code"
        name="code"
        value={formData.code}
        onChange={handleChange}
        required
      />
      <InputField
        label="Voucher Name"
        id="voucherName"
        name="voucherName"
        value={formData.voucherName}
        onChange={handleChange}
        required
      />
      <SelectField
        label="Discount Type"
        id="isDiscountPercent"
        name="isDiscountPercent"
        value={formData.isDiscountPercent.toString()}
        onChange={handleChange}
        options={[
          { label: "Percent", value: "true" },
          { label: "Fixed", value: "false" },
        ]}
      />
      <InputField
        type="number"
        label="Discount Value"
        id="discountValue"
        name="discountValue"
        value={formData.discountValue.toString()}
        onChange={handleChange}
        min-value={0}
        required
      />
      <InputField
        type="number"
        label="Condition (applies to orders with a value from)"
        id="minOrderCondition"
        name="minOrderCondition"
        value={formData.minOrderCondition.toString()}
        onChange={handleChange}
        min-value={0}
      />
      {formData.isDiscountPercent.toString() === "true" && (
        <InputField
          type="number"
          label="Max Discount Value"
          id="maxDiscountValue"
          name="maxDiscountValue"
          value={formData.maxDiscountValue.toString()}
          onChange={handleChange}
          min-value={0}
        />
      )}

      <InputField
        type="number"
        label="Voucher Quantity"
        id="voucherQuantity"
        name="voucherQuantity"
        value={formData.quantity.toString()}
        onChange={handleChange}
        min-value={0}
      />
      <DatePickerField
        label="Start Date"
        id="startDate"
        name="startDate"
        value={formData.startDate}
        onChange={handleChange}
      />

      <DatePickerField
        label="End Date"
        id="endDate"
        name="endDate"
        value={formData.endDate}
        onChange={handleChange}
      />
      <button
        type="submit"
        className="float-right mt-4 text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
      >
        Create Voucher
      </button>
      {formState.errors.length > 0 && (
        <ul>
          {formState.errors.map((error, index) => (
            <li className="text-red-400" key={index}>
              {error}
            </li>
          ))}
        </ul>
      )}
    </form>
  );
};

export default AddVoucherForm;
