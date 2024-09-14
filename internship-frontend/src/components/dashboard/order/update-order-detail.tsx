"use client";

import { updateOrderState } from "@/action/orderAction";
import InputField from "@/components/ui/input";
import { useCustomActionState } from "@/lib/custom/customHook";
import { mapOrderState, OrderState } from "@/lib/enums/OrderState";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

interface IProps {
  orderId: string;
  orderState: string;
}

const UpdateOrderDetail = ({ orderId, orderState }: IProps) => {
  //using for Update Order State action
  const router = useRouter();

  const initialState: FormState = { errors: [] };
  const [formState, formAction] = useCustomActionState<FormState>(
    updateOrderState,
    initialState
  );

  const [formData, setFormData] = useState<string>(orderState);

  const [toastDisplayed, setToastDisplayed] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    formAction(formData);
    setToastDisplayed(false); // Reset toastDisplayed when submitting
  };

  //handle change
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(value);
  };

  const isUpdate =
    mapOrderState(Number(orderState)) !== "Cancelled" &&
    mapOrderState(Number(orderState)) !== "Delivered";

  useEffect(() => {
    if (formState.errors.length > 0 && !toastDisplayed) {
      toast.error(formState.errors[0]);
      setToastDisplayed(true); // Set toastDisplayed to true to prevent multiple toasts
    }
    if (formState.success) {
      toast.success("Updated order state successfully!");
      router.push("/dashboard/orders");
    }
  }, [formState, toastDisplayed]);
  return (
    <div className="mt-12">
      {isUpdate ? (
        <form onSubmit={handleSubmit} className="px-4 w-full">
          <input type="hidden" value={orderId} name="id" />
          <label
            htmlFor="state"
            className="block mb-2 text-sm font-medium text-white"
          >
            Order State
          </label>
          <select
            name="state"
            id="state"
            value={formData}
            onChange={handleChange}
            className="text-sm rounded-lg w-full p-2.5 bg-gray-600 placeholder-gray-400 text-white"
          >
            {Object.keys(OrderState)
              .filter((key) => isNaN(Number(key)))
              .map((key) => (
                <option
                  key={OrderState[key as keyof typeof OrderState]}
                  value={OrderState[key as keyof typeof OrderState]}
                >
                  {key}
                </option>
              ))}
          </select>
          <button
            type="submit"
            className="float-right mt-4 text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
          >
            Update
          </button>
        </form>
      ) : (
        <>
          <label className="block mb-2 text-sm font-medium text-white">
            Order State
          </label>
          <input
            value={mapOrderState(Number(orderState))}
            className="text-sm rounded-lg w-full p-2.5 bg-gray-600 placeholder-gray-400 text-white"
            readOnly
          />
        </>
      )}
    </div>
  );
};

export default UpdateOrderDetail;
