
  import { createRoot } from "react-dom/client";
  import App from "./app/App.tsx";
  import "./styles/index.css";

  // Restore theme before render to avoid flash
  const savedTheme = localStorage.getItem("meridian-theme") || "light";
  const root = document.documentElement;
  if (savedTheme === "dark") {
    root.classList.add("dark");
    root.style.setProperty("color-scheme", "dark");
  } else if (savedTheme === "system") {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    root.classList.toggle("dark", prefersDark);
    root.style.setProperty("color-scheme", prefersDark ? "dark" : "light");
  }
  const savedFontSize = localStorage.getItem("meridian-font-size");
  if (savedFontSize) {
    const sizes: Record<string, string> = { small: "14px", medium: "16px", large: "18px" };
    root.style.setProperty("font-size", sizes[savedFontSize] || "16px");
  }

  createRoot(document.getElementById("root")!).render(<App />);
  