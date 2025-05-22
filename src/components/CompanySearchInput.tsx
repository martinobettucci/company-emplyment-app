import React, { useRef, useState } from "react";
import { Search, XCircle } from "lucide-react";

type Props = {
  onSubmit: (company: string) => void;
  loading?: boolean;
  error?: string | null;
};

export default function CompanySearchInput({ onSubmit, loading, error }: Props) {
  const [value, setValue] = useState("");
  const [touched, setTouched] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const trimmed = value.trim();
  const isValid = trimmed.length >= 2;
  const showError = touched && (!isValid || !!error);

  function handleInput(e: React.ChangeEvent<HTMLInputElement>) {
    setValue(e.target.value);
    setTouched(true);
  }

  function handleClear() {
    setValue("");
    setTouched(false);
    inputRef.current?.focus();
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setTouched(true);
    if (isValid && !loading) {
      onSubmit(trimmed);
    }
  }

  return (
    <form
      className="w-full flex flex-col items-center gap-2"
      onSubmit={handleSubmit}
      aria-label="Company search form"
      autoComplete="off"
    >
      <div className="relative w-full max-w-md">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-brand pointer-events-none"
          aria-hidden="true"
          size={22}
        />
        <input
          ref={inputRef}
          type="text"
          className={`peer w-full pl-10 pr-10 py-3 rounded-lg border-2 bg-white text-lg font-medium transition-all outline-none
            ${showError ? "border-error focus:border-error" : "border-brand/40 focus:border-brand"}
            shadow-sm focus:shadow-card placeholder-gray-400`}
          placeholder="Enter company name…"
          value={value}
          onChange={handleInput}
          minLength={2}
          required
          aria-label="Company name"
          aria-invalid={showError}
          aria-describedby={showError ? "company-search-error" : undefined}
          disabled={loading}
          onBlur={() => setTouched(true)}
        />
        {value && !loading && (
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-error transition-colors"
            aria-label="Clear company name"
            onClick={handleClear}
            tabIndex={0}
          >
            <XCircle size={20} />
          </button>
        )}
      </div>
      <button
        type="submit"
        className={`mt-2 w-full max-w-md flex items-center justify-center gap-2 px-5 py-3 rounded-lg font-semibold text-white bg-brand hover:bg-brand-dark transition-all
          focus:outline-none focus:ring-2 focus:ring-brand/60 focus:ring-offset-2
          disabled:opacity-60 disabled:cursor-not-allowed`}
        disabled={!isValid || loading}
        aria-label="Search company"
      >
        <Search size={20} className="mr-1" />
        {loading ? "Searching…" : "Search"}
      </button>
      <div className="h-6 w-full max-w-md flex items-center justify-center">
        {showError && (
          <span
            id="company-search-error"
            className="text-error text-sm font-medium flex items-center gap-1"
            role="alert"
          >
            {error
              ? error
              : "Please enter at least 2 characters."}
          </span>
        )}
      </div>
    </form>
  );
}
