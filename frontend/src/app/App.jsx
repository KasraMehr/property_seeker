import { RouterProvider } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { Router } from "./Router";
import AuthProvider from "../context/AuthProvider";
import { ThemeProvider } from "../theme";

export default function App() {
  return (
    <>
      <ThemeProvider>
        <AuthProvider>
          {/* Rout managment  */}
          <RouterProvider router={Router} />
          {/* Toast Notification */}
          <Toaster
            position="top-center"
            reverseOrder={false}
            gutter={8}
            toastOptions={{
              duration: 3000,
              style: {
                background: "var(--surface)",
                color: "var(--foreground)",
                border: "1px solid var(--border)",
                borderRadius: "12px",
                direction: "rtl",
              },
            }}
          />
        </AuthProvider>
      </ThemeProvider>
    </>
  );
}
