import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./AuthContext";
import { App } from "./App";
import "./admin.css";

ReactDOM.createRoot(document.getElementById("admin-root")!).render(
  <React.StrictMode>
    <BrowserRouter basename="/admin.html">
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
