import React, { createContext, useContext, useState, ReactNode } from "react";

type Env = "PROD" | "TEST";

type EnvContextType = {
  env: Env;
  setEnv: (env: Env) => void;
};

const EnvContext = createContext<EnvContextType | undefined>(undefined);

export function EnvProvider({ children }: { children: ReactNode }) {
  const [env, setEnv] = useState<Env>("PROD");
  return (
    <EnvContext.Provider value={{ env, setEnv }}>
      {children}
    </EnvContext.Provider>
  );
}

export function useEnv() {
  const ctx = useContext(EnvContext);
  if (!ctx) throw new Error("useEnv must be used within EnvProvider");
  return ctx;
}
