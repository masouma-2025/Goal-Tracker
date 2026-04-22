import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";

import "./i18n/i18n";

import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import rtlPlugin from "stylis-plugin-rtl";

const cacheRtl = createCache({
  key: "mui-rtl",
  stylisPlugins: [rtlPlugin],
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <CacheProvider value={cacheRtl}>
        <App />
      </CacheProvider>
    </BrowserRouter>
  </React.StrictMode>
);