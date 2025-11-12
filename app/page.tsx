"use client";
import { useEffect, useMemo, useState } from "react";

const currencies = ["€", "$", "£", "¥", "₹"];
const HOUR_TO_MONTH = 40 * 4.33;
const HOUR_TO_YEAR = 40 * 52;

function Button({
  children,
  styling,
  onClick,
}: Readonly<{
  children: React.ReactNode;
  styling: string;
  onClick: () => void;
}>) {
  return (
    <button
      type="button"
      className={`p-2 px-6 rounded-full shadow-sm font-semibold text-md flex items-center transition-colors cursor-pointer duration-200 ${styling}`}
      onClick={onClick}
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
  const [attendees, setAttendees] = useState<number>(2);
  const [rateText, setRateText] = useState<number>(20.0);
  const [amount, setAmount] = useState<number>(0);

  const [runState, setRunState] = useState<"idle" | "running">("idle");

  const rate = useMemo(() => {
    if (Number.isNaN(rateText) || rateText < 0) {
      return 0;
    }

    const totalRate = rateText * attendees;

    switch (rateType) {
      case "hourly":
        return totalRate / 3600;
      case "monthly":
        return (totalRate * 12) / (365 * 24 * 3600);
      case "yearly":
        return totalRate / (365 * 24 * 3600);
      default:
        return 0;
    }
  }, [rateText, rateType, attendees]);
  useEffect(() => {
    if (runState !== "running") {
      return;
    }

    let raf = 0;
    let last = performance.now();

    function loop() {
      const now = performance.now();
      // account for the full elapsed time (including when the tab was idle)
      const dt = (now - last) / 1000; // seconds
      last = now;

      setAmount((prev) => prev + rate * dt);

      raf = requestAnimationFrame(loop);
    }

    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
    };
  }, [runState, rate, setAmount]);

  return (
    <div className="grid h-full grid-rows-[auto_1fr]">
      <div className="bg-gray-100 ">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 p-3 md:max-w-2xl w-full mx-auto ">
          <input
            type="number"
            value={attendees}
            onChange={(e) => setAttendees(Number.parseInt(e.target.value, 10))}
            placeholder="Attendees"
            className="w-24"
          />
          <span>x</span>

          <div aria-hidden="true" className="w-full sm:hidden" />

          <select
            onChange={(e) => {
              const newRateType = e.target.value as
                | "hourly"
                | "monthly"
                | "yearly";
              let conversionRate = 1;

              if (newRateType == rateType) {
                return;
              }

              if (rateType === "hourly" && newRateType === "monthly") {
                conversionRate = HOUR_TO_MONTH;
              } else if (rateType === "yearly" && newRateType === "monthly") {
                conversionRate = 1 / 12;
              } else if (rateType === "hourly" && newRateType === "yearly") {
                conversionRate = HOUR_TO_YEAR;
              } else if (rateType === "monthly" && newRateType === "yearly") {
                conversionRate = 12;
              } else if (rateType === "monthly" && newRateType === "hourly") {
                conversionRate = 1 / HOUR_TO_MONTH;
              } else if (rateType === "yearly" && newRateType === "hourly") {
                conversionRate = 1 / HOUR_TO_YEAR;
              }

              setRateType(newRateType);
              setRateText(
                (prev) => Math.round(prev * conversionRate * 100) / 100
              );
            }}
            value={rateType}
          >
            <option value="hourly">Hourly</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>

          <select
            onChange={(e) => setCurrency(e.target.value)}
            value={currency}
          >
            {currencies.map((cur) => (
              <option key={cur} value={cur}>
                {cur}
              </option>
            ))}
          </select>

          <input
            type="number"
            step="any"
            inputMode="decimal"
            value={rateText}
            onChange={(e) => {
              const val = e.target.value;
              setRateText(val === "" ? 0 : Number.parseFloat(val));
            }}
            placeholder="Rate"
            className="w-32"
          />

          <div className="flex-1"></div>

          <div aria-hidden="true" className="w-full sm:hidden" />

          <Button
            onClick={() =>
              setRunState(runState === "running" ? "idle" : "running")
            }
            styling="bg-blue-600 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {runState === "running" ? "Stop" : "Start"}
          </Button>

          <Button
            onClick={() => {
              setRunState("idle");
              setRateText(20);
              setAttendees(2);
              setRateType("hourly");
              setAmount(0);
            }}
            styling="bg-gray-600 text-white hover:bg-gray-700 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            Reset
          </Button>
        </div>
      </div>

      <div className="flex items-center justify-center text-6xl lg:text-9xl font-mono space-x-4">
        <div>{currency}</div>
        <span className=" inline-block text-right">
          {amount.toFixed(2).padStart(7, "\u00A0")}
        </span>
      </div>
    </div>
  );
}
