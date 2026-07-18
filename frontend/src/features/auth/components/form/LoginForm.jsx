// Login form with react-hook-form validation, auto-clear errors after 5s inactivity

import { useState, useEffect, useRef } from "react";
import { useNavigate , Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { User } from "lucide-react";

// Components
import Input from "../../../../shared/ui/Input";
import Button from "../../../../shared/ui/Button";
import useAuth from "../../../../hooks/useAuth";
import { LOGIN_DIALOGS } from "../../constants/loginConstants";
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
      const result = await login(data.phone, data.password);

      if (result.success) {
        navigate("/dashboard");
      } else {
        setServerError(result.error || LOGIN_DIALOGS.server_error_default);
      }
    } catch {
      setServerError(LOGIN_DIALOGS.server_error_network);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="relative mx-auto flex h-full w-full max-w-md flex-col pt-3"
    >
      {/* Form main title */}
      <h1 className="mb-6 text-center text-2xl font-bold text-foreground selection:bg-primary/20">
        {LOGIN_DIALOGS.login_title}
      </h1>

      {/* Input fields wrapper */}
      <div className="flex flex-col gap-6">
        {/*  Phone Field */}
        <Input
          label={LOGIN_DIALOGS.phone_label}
          icon={User}
          autoFocus
          {...register("phone", {
            validate: validatePhone,
          })}
          error={errors.phone?.message}
          onFocus={() => clearErrors("phone")}
        />

        {/* Password Field */}
        <Input
          label={LOGIN_DIALOGS.password_label}
          type="password"
          {...register("password", {
            validate: validatePassword,
          })}
          error={errors.password?.message}
          onFocus={() => clearErrors("password")}
        />
      </div>

      {/* Global backend error display block */}
      <div className="my-3 flex h-11 items-center justify-center transition-all duration-200">
        {serverError && (
          <p className="w-full animate-fadeIn rounded-xl border border-danger/20 bg-danger/10 px-3 py-2 text-center text-xs font-medium text-danger">
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
          className="active:scale-[0.98] py-3.5 text-base shadow-lg shadow-primary/15 transition-transform"
        >
          {isSubmitting
            ? LOGIN_DIALOGS.submitting_button
            : LOGIN_DIALOGS.submit_button}
        </Button>
      </div>

      {/* Back to landing page */}
      <div className="mt-4 flex justify-center">
        <Button
          as={Link}
          to="/"
          variant="outline"
          size="sm"
          className="backdrop-blur-md border border-border px-5 py-2.5 rounded-xl text-sm font-semibold shadow-sm transition-all "
        >
          {LOGIN_DIALOGS.back_to_landing}
        </Button>
      </div>
    </form>
  );
}
