// Login form with react-hook-form validation, auto-clear errors after 5s inactivity

import { useState , useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { User } from "lucide-react";

// Components
import Input from "../../../../shared/ui/Input";
import Button from "../../../../shared/ui/Button";
import useAuth from "../../../../hooks/useAuth";

// Validators
import { validatePhone, validatePassword } from "../../../../utils/validators";

export default function LoginForm() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState("");
  const inactivityTimerRef = useRef(null);

  // React hook form initialization
  const {
    register,
    handleSubmit,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm({
    mode: "onTouched",
  });

  // Auto-clear errors after 5 seconds of inactivity
  useEffect(() => {
    const hasErrors = Object.keys(errors).length > 0;

    if (hasErrors || serverError) {
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
      }

      inactivityTimerRef.current = setTimeout(() => {
        clearErrors(); 
        setServerError(""); 
      }, 5000);
    }

    return () => {
      if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
    };
  }, [errors, serverError, clearErrors]);

  // Form submit handler linked to auth context/API
  const onSubmit = async (data) => {
    setServerError("");
    try {
      const result = await login(data.username, data.password);
      if (result.success) {
        navigate("/app");
      } else {
        setServerError(result.error || "نام کاربری یا رمز عبور اشتباه است");
      }
    } catch (err) {
      setServerError("خطا در ارتباط با سرور");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col pt-3 h-full w-full max-w-md mx-auto relative"
    >
      {/* Form main title */}
      <h1 className="text-2xl font-bold text-center text-gray-800 mb-6 selection:bg-blue-200">
        ورود به حساب کاربری
      </h1>

      {/* Input fields wrapper */}
      <div className="flex flex-col gap-6">
        {/* Username / Phone Field */}
        <Input
          label="شماره موبایل"
          icon={User}
          autoFocus
          {...register("username", {
            validate: validatePhone
          })}
          error={errors.username?.message}
          onFocus={() => clearErrors("username")}
        />

        {/*  Password Field  */}
        <Input
          label="رمز عبور"
          type="password"
          {...register("password", {
            validate: validatePassword
          })}
          error={errors.password?.message}
          onFocus={() => clearErrors("password")} 
        />
      </div>

      {/* Global backend error display block */}
      <div className="h-11 flex items-center justify-center my-3 transition-all duration-200">
        {serverError && (
          <p className="text-red-500 text-xs text-center bg-red-50 px-3 py-2 rounded-xl border border-red-100 w-full animate-fadeIn font-medium">
            {serverError}
          </p>
        )}
      </div>

      {/* Submit button container */}
      <div className="mt-auto">
        <Button
          type="submit"
          fullWidth
          size="lg"
          disabled={isSubmitting}
          className="py-3.5 rounded-xl text-base shadow-md shadow-blue-500/10 active:scale-[0.98] transition-transform"
        >
          {isSubmitting ? "در حال ورود..." : "ورود"}
        </Button>
      </div>

      
    </form>
  );
}