import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./app/App.jsx";

async function enableMocking() {
  if (process.env.NODE_ENV !== "development") {
    return;
  }
  const { worker } = await import("./mocks/browser");
  return worker.start({
    onUnhandledRequest: "bypass", // یا "warn" برای دیباگ
  });
}
createRoot(document.getElementById("root")).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );

// enableMocking().then(() => {
//   createRoot(document.getElementById("root")).render(
//     <StrictMode>
//       <App />
//     </StrictMode>,
//   );
// });
