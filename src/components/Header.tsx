import React from "react";
import EnvSwitch from "./EnvSwitch";

export default function Header() {
  return (
    <header className="w-full flex items-center justify-between px-6 py-4 bg-white shadow-sm border-b border-gray-100">
      <div className="flex items-center gap-3">
        <img
          src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=facearea&w=48&h=48&facepad=2"
          alt="Newsletter Logo"
          className="w-10 h-10 rounded-full object-cover"
        />
        <span className="font-heading text-xl font-bold text-brand tracking-tight">
          NewsLetterGen
        </span>
      </div>
      <EnvSwitch />
    </header>
  );
}
