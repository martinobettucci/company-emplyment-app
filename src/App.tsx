import React from "react";
import { NewsletterProvider } from "./context/NewsletterContext";
import { EnvProvider } from "./context/EnvContext";
import LandingPage from "./pages/LandingPage";

function App() {
  return (
    <EnvProvider>
      <NewsletterProvider>
        <LandingPage />
      </NewsletterProvider>
    </EnvProvider>
  );
}

export default App;
