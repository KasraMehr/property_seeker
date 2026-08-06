import { useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { Router } from "./Router";
import useAuthStore from "../store/useAuthStore";
import useThemeStore from "../store/useThemeStore";

export default function App() {
  const checkSession = useAuthStore((state) => state.checkSession);
  const initializeTheme = useThemeStore((state) => state.initializeTheme);

  useEffect(() => {
    checkSession();
    initializeTheme();
  }, [checkSession, initializeTheme]);

  return (
    <>
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
    </>
  );
}
