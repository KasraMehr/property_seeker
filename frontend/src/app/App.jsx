import { RouterProvider } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { Router } from "./Router";
import AuthProvider from "../context/AuthProvider";

export default function App() {
  return (
    <>
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
              background: "#363636",
              color: "#fff",
              padding: "16px 24px",
              borderRadius: "12px",
              fontSize: "14px",
              direction: "rtl",
            },
          }}
        />
      </AuthProvider>
    </>
  );
}
