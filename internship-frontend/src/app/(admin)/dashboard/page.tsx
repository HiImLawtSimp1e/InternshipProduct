"use client";

import Card from "@/components/dashboard/card";
import Chart from "@/components/dashboard/charts";
import Transactions from "@/components/dashboard/transactions";

const DashboardPage = () => {
  const cards = [
    {
      id: 1,
      title: "Total Users",
      number: 10.928,
      change: 12,
    },
    {
      id: 2,
      title: "Stock",
      number: 8.236,
      change: -2,
    },
    {
      id: 3,
      title: "Revenue",
      number: 6.642,
      change: 18,
    },
    {
      id: 4,
      title: "Vendor",
      number: 3.623,
      change: 14,
    },
  ];
  return (
    <div className="flex flex-col">
      <div className="flex gap-6 rounded-md">
        {cards.map((item) => (
          <Card item={item} key={item.id} />
        ))}
      </div>
      <Transactions />
      <Chart />
    </div>
  );
};
export default DashboardPage;
