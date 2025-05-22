import React from "react";
import { useEnv } from "../context/EnvContext";
import { ShieldCheck, FlaskConical } from "lucide-react";

export default function EnvSwitch() {
  const { env, setEnv } = useEnv();

  return (
    <div className="flex items-center gap-2">
      <button
        className={`flex items-center gap-1 px-3 py-1 rounded-lg font-semibold text-sm transition
          ${env === "PROD"
            ? "bg-green-600 text-white shadow"
            : "bg-gray-100 text-gray-700 hover:bg-green-100"}
        `}
        aria-pressed={env === "PROD"}
        onClick={() => setEnv("PROD")}
        type="button"
      >
        <ShieldCheck size={16} className="mr-1" />
        PROD
      </button>
      <button
        className={`flex items-center gap-1 px-3 py-1 rounded-lg font-semibold text-sm transition
          ${env === "TEST"
            ? "bg-yellow-500 text-white shadow"
            : "bg-gray-100 text-gray-700 hover:bg-yellow-100"}
        `}
        aria-pressed={env === "TEST"}
        onClick={() => setEnv("TEST")}
        type="button"
      >
        <FlaskConical size={16} className="mr-1" />
        TEST
      </button>
    </div>
  );
}
