import React, { useState } from "react";
import Header from "../components/Header";
import CompanySearchInput from "../components/CompanySearchInput";
import { useEnv } from "../context/EnvContext";
import { MailPlus, Loader2, CheckCircle2, AlertTriangle } from "lucide-react";

// --- Types for API responses ---
type OnlineResult = {
  title: string;
  url: string;
  reason: string;
};

type LocalResult = {
  title: string;
  location: string;
  reason: string;
};

type SearchResults = {
  onlineResults: OnlineResult[];
  localResults: LocalResult[];
};

type CompanySearchResponseItem = {
  companyName: string;
  searchResults: SearchResults;
};

type CompanySearchResponse = CompanySearchResponseItem[];

type NewsletterDraftRequest = {
  subject: string;
  body: string;
}[];

type NewsletterDraftResponse = {
  id: string;
  message: {
    id: string;
    threadId: string;
    labelIds: string[];
  };
}[];

// --- API Endpoints ---
const PROD_COMPANY_SEARCH_API = "https://n8n.p2enjoy.studio/webhook/1bab15e1-213c-4ba0-88ca-a665f77b3ad8";
const TEST_COMPANY_SEARCH_API = "https://n8n.p2enjoy.studio/webhook-test/1bab15e1-213c-4ba0-88ca-a665f77b3ad8";
const PROD_NEWSLETTER_DRAFT_API = "https://n8n.p2enjoy.studio/webhook/42abac48-beb9-45cb-b87e-4d7961610ff6";
const TEST_NEWSLETTER_DRAFT_API = "https://n8n.p2enjoy.studio/webhook-test/42abac48-beb9-45cb-b87e-4d7961610ff6";

export default function LandingPage() {
  const { env } = useEnv();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<CompanySearchResponse | null>(null);

  // Newsletter draft state
  const [draftLoading, setDraftLoading] = useState(false);
  const [draftError, setDraftError] = useState<string | null>(null);
  const [draftResponse, setDraftResponse] = useState<NewsletterDraftResponse | null>(null);

  // --- Company Search Handler (POST) ---
  async function handleCompanySearch(company: string) {
    setError(null);
    setLoading(true);
    setResults(null);
    setDraftError(null);
    setDraftResponse(null);

    const COMPANY_SEARCH_API =
      env === "PROD" ? PROD_COMPANY_SEARCH_API : TEST_COMPANY_SEARCH_API;

    try {
      const res = await fetch(
        COMPANY_SEARCH_API,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify([{ company }]),
        }
      );

      if (!res.ok) {
        throw new Error(`API error: ${res.status}`);
      }

      // Defensive: check for empty response
      const text = await res.text();
      if (!text) {
        throw new Error("API returned an empty response.");
      }

      let data: unknown;
      try {
        data = JSON.parse(text);
      } catch (jsonErr) {
        throw new Error("API returned malformed JSON.");
      }

      // Accept both array and single object, normalize to array
      let normalized: CompanySearchResponse;
      if (Array.isArray(data)) {
        normalized = data as CompanySearchResponse;
      } else if (
        typeof data === "object" &&
        data !== null &&
        "companyName" in data &&
        "searchResults" in data
      ) {
        normalized = [data as CompanySearchResponseItem];
      } else {
        throw new Error("Unexpected API response format.");
      }

      // Validate structure
      if (
        !normalized[0]?.companyName ||
        !normalized[0]?.searchResults ||
        !Array.isArray(normalized[0].searchResults.onlineResults) ||
        !Array.isArray(normalized[0].searchResults.localResults)
      ) {
        throw new Error("API response missing expected fields.");
      }

      setResults(normalized);
    } catch (err: any) {
      setError(
        err?.message
          ? `Failed to fetch company data: ${err.message}`
          : "An unknown error occurred."
      );
    } finally {
      setLoading(false);
    }
  }

  // --- Newsletter Draft Handler (POST) ---
  async function handleNewsletterDraft() {
    setDraftError(null);
    setDraftLoading(true);
    setDraftResponse(null);

    if (!results || !results[0]) {
      setDraftError("No company results to draft newsletter from.");
      setDraftLoading(false);
      return;
    }

    // Generate subject and body from results
    const company = results[0].companyName;
    const online = results[0].searchResults.onlineResults;
    const local = results[0].searchResults.localResults;

    // Simple subject/body generation (can be improved)
    const subject = `Latest News and Updates: ${company}`;
    let body = `Hello,\n\nHere are the latest news and local updates for ${company}:\n\n`;

    if (online.length > 0) {
      body += "Online News:\n";
      online.forEach((item, idx) => {
        body += `- ${item.title} (${item.url})\n  ${item.reason}\n`;
      });
      body += "\n";
    }
    if (local.length > 0) {
      body += "Local Results:\n";
      local.forEach((item, idx) => {
        body += `- ${item.title} (${item.location})\n  ${item.reason}\n`;
      });
      body += "\n";
    }
    body += "Best regards,\nYour Newsletter Bot";

    const NEWSLETTER_DRAFT_API =
      env === "PROD" ? PROD_NEWSLETTER_DRAFT_API : TEST_NEWSLETTER_DRAFT_API;

    try {
      const res = await fetch(
        NEWSLETTER_DRAFT_API,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify([{ subject, body }]),
        }
      );

      if (!res.ok) {
        throw new Error(`API error: ${res.status}`);
      }

      const text = await res.text();
      if (!text) {
        throw new Error("API returned an empty response.");
      }

      let data: NewsletterDraftResponse;
      try {
        data = JSON.parse(text);
      } catch (jsonErr) {
        throw new Error("API returned malformed JSON.");
      }

      if (!Array.isArray(data) || !data[0]?.id) {
        throw new Error("Unexpected API response.");
      }

      setDraftResponse(data);
    } catch (err: any) {
      setDraftError(
        err?.message
          ? `Failed to draft newsletter: ${err.message}`
          : "An unknown error occurred."
      );
    } finally {
      setDraftLoading(false);
    }
  }

  return (
    <div>
      <Header />
      <main className="max-w-2xl mx-auto px-4 py-12">
        <section className="bg-white rounded-xl shadow-card p-8 flex flex-col items-center gap-6">
          <h2 className="font-heading text-2xl md:text-3xl text-brand font-bold mb-2">
            Search for a Company
          </h2>
          <p className="text-gray-600 text-center mb-4">
            Enter a company name to find the latest news and generate a newsletter draft in seconds.
          </p>
          <CompanySearchInput
            onSubmit={handleCompanySearch}
            loading={loading}
            error={error}
          />
        </section>

        {/* Results Section */}
        <section className="mt-8 w-full">
          {loading && (
            <div className="flex justify-center items-center py-8">
              <span className="text-brand font-semibold text-lg animate-pulse">
                Searching for company news…
              </span>
            </div>
          )}
          {error && (
            <div className="flex justify-center items-center py-8">
              <span className="text-error font-semibold text-lg flex items-center gap-2">
                <AlertTriangle className="inline" size={20} /> {error}
              </span>
            </div>
          )}
          {results && (
            <div className="bg-white rounded-xl shadow-card p-6 mt-2">
              <h3 className="font-heading text-xl text-brand font-bold mb-4">
                Results for {results[0].companyName}
              </h3>
              <div className="mb-6">
                <h4 className="font-semibold text-lg mb-2">Online News</h4>
                <ul className="space-y-3">
                  {results[0].searchResults.onlineResults.map((item, idx) => (
                    <li key={idx} className="p-3 rounded-lg border border-brand/10 bg-brand/5 hover:bg-brand/10 transition">
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-brand-dark hover:underline"
                      >
                        {item.title}
                      </a>
                      <div className="text-gray-600 text-sm mt-1">{item.reason}</div>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-lg mb-2">Local Results</h4>
                <ul className="space-y-3">
                  {results[0].searchResults.localResults.map((item, idx) => (
                    <li key={idx} className="p-3 rounded-lg border border-brand/10 bg-brand/5">
                      <div className="font-medium text-brand-dark">{item.title}</div>
                      <div className="text-gray-600 text-sm">{item.location}</div>
                      <div className="text-gray-500 text-xs mt-1">{item.reason}</div>
                    </li>
                  ))}
                </ul>
              </div>
              {/* Draft Newsletter Button */}
              <div className="mt-8 flex flex-col items-center">
                <button
                  className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-white bg-brand hover:bg-brand-dark transition-all
                    focus:outline-none focus:ring-2 focus:ring-brand/60 focus:ring-offset-2
                    disabled:opacity-60 disabled:cursor-not-allowed`}
                  onClick={handleNewsletterDraft}
                  disabled={draftLoading}
                  aria-label="Draft newsletter"
                >
                  {draftLoading ? (
                    <>
                      <Loader2 className="animate-spin" size={20} />
                      Drafting…
                    </>
                  ) : (
                    <>
                      <MailPlus size={20} />
                      Draft Newsletter
                    </>
                  )}
                </button>
                {/* Draft error */}
                {draftError && (
                  <div className="mt-4 text-error text-sm font-medium flex items-center gap-1" role="alert">
                    <AlertTriangle size={18} /> {draftError}
                  </div>
                )}
                {/* Draft success */}
                {draftResponse && (
                  <div className="mt-6 w-full max-w-lg bg-green-50 border border-green-200 rounded-lg p-5 shadow flex flex-col items-start gap-2">
                    <div className="flex items-center gap-2 text-green-700 font-semibold mb-1">
                      <CheckCircle2 size={22} />
                      Newsletter draft created!
                    </div>
                    <div className="text-sm text-green-900">
                      <b>Draft ID:</b> {draftResponse[0].id}
                    </div>
                    <div className="text-xs text-green-800">
                      <b>Message:</b> {draftResponse[0].message?.id}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
