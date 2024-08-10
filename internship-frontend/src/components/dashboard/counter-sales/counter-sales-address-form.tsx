"use client";

import { useSearchAddressStore } from "@/lib/store/useSearchAddressStore";
import { ChangeEvent } from "react";

const CounterSalesAddressForm = () => {
  const { address, setAddress } = useSearchAddressStore();

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    if (address) {
      setAddress({ ...address, [name]: value });
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-4">
        <div className="flex-1">
          <label
            htmlFor="fullName"
            className="block mb-2 text-sm font-medium text-white"
          >
            Customer Full Name
          </label>
          <input
            id="fullName"
            name="fullName"
            placeholder="Enter customer full name"
            value={address?.fullName}
            className="text-sm rounded-lg w-full p-2.5 bg-gray-500 placeholder-gray-300 text-white"
            onChange={handleChange}
          />
        </div>
        <div className="flex-1">
          <label
            htmlFor="email"
            className="block mb-2 text-sm font-medium text-white"
          >
            Customer Email
          </label>
          <input
            id="email"
            name="email"
            placeholder="Enter customer email"
            value={address?.email}
            className="text-sm rounded-lg w-full p-2.5 bg-gray-500 placeholder-gray-300 text-white"
            onChange={handleChange}
          />
        </div>
        <div className="flex-1">
          <label
            htmlFor="phone"
            className="block mb-2 text-sm font-medium text-white"
          >
            Customer Phone Number
          </label>
          <input
            id="phone"
            name="phone"
            placeholder="Enter customer phone"
            value={address?.phone}
            className="text-sm rounded-lg w-full p-2.5 bg-gray-500 placeholder-gray-300 text-white"
            onChange={handleChange}
          />
        </div>
      </div>
      <div className="">
        <label
          htmlFor="address"
          className="block mb-2 text-sm font-medium text-white"
        >
          Customer Address
        </label>
        <input
          id="address"
          name="address"
          placeholder="Enter customer address"
          value={address?.address}
          className="text-sm rounded-lg w-full p-2.5 bg-gray-500 placeholder-gray-300 text-white"
          onChange={handleChange}
        />
      </div>
    </div>
  );
};

export default CounterSalesAddressForm;
