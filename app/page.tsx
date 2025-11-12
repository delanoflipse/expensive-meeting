"use client";
import { useState } from "react";

const currencies = ["€", "$", "£", "¥", "₹"];

function Button({
  children,
  styling,
}: Readonly<{
  children: React.ReactNode;
  styling: string;
}>) {
  return (
    <button
      type="button"
      className={`p-2 pr-6 rounded-full shadow-sm font-semibold text-md flex items-center transition-colors cursor-pointer duration-200 ${styling}`}
    >
      {children}
    </button>
  );
}

export default function Home() {
  const [currency, setCurrency] = useState<string>("€");
  const [rateType, setRateType] = useState<"hourly" | "monthly" | "yearly">(
    "hourly"
  );
  const [rate, setRate] = useState<number>(0);
  const [amount, setAmount] = useState<number>(0);

  return (
    <div className="">
      <div>
        <select onChange={(e) => setCurrency(e.target.value)} value={currency}>
          {currencies.map((cur) => (
            <option key={cur} value={cur}>
              {cur}
            </option>
          ))}
        </select>
        <select
          onChange={(e) =>
            setRateType(e.target.value as "hourly" | "monthly" | "yearly")
          }
          value={rateType}
        >
          <option value="hourly">Hourly</option>
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
        </select>

        <input
          type="number"
          step="any"
          inputMode="decimal"
          value={rate}
          onChange={(e) => {
            const v = e.target.value;
            setRate(v === "" ? 0 : (Number.parseFloat(v) ?? 0));
          }}
          placeholder="Rate"
        />
      </div>
      <div>{currency}</div>
      <div>{amount.toFixed(2)}</div>
    </div>
  );
}
