// Step 2: OTP verification input with verify and back buttons
import { useRef, useState } from "react";

// Components
import Button from "../../../../shared/ui/Button";
import OtpInput from "../OtpInput";
import { LOGIN_DIALOGS } from "../../constants/loginCard";
import useAuth from "../../../../hooks/useAuth";
import { showError } from "../../../../lib/toast";

export default function OtpStep({ phone, onNext, onBack , onDone }) {
  const { login , resendOTP} = useAuth();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const otpRef = useRef();

  const handleSubmit = async () => {
    // TODO: Better validation (6 digits)
    const isEmpty = otp.every((digit) => digit === "");
    if (isEmpty) {
      setError("لطفاً کد تأیید را وارد کنید");
      if (otpRef.current) {
        otpRef.current.setSubmitted(true);
      }
      return;
    }

    const otpString = otp.join("");
    if (otpString.length < 6) {
      setError("کد تأیید باید ۶ رقم باشد");
      return;
    }

    // SUCCESS
    setError("");
    setIsLoading(true);
    if (otpRef.current) {
      otpRef.current.resetSubmitted();
    }

    try {
      const result = await login(phone, otpString);
      if (result.success) {
        if (otpRef.current) {
          otpRef.current.resetSubmitted();
        }
        if (result.isNewUser) {
          onNext(); // Go to register
        } else {
          onDone(); // Go to dashboard
        }
      } else {
        setError(result.message || "کد تأیید نامعتبر است");
        showError(result.message || "کد تأیید نامعتبر است");
      }
    } catch (err) {
      setError("خطا در تأیید کد");
      showError("خطا در تأیید کد");
    } finally {
      setIsLoading(false);
    }
  };

   const handleResend = async () => {
    setIsResending(true);
    try {
      const result = await resendOTP(phone);
      if (result.success) {
        // Reset OTP inputs
        setOtp(["", "", "", "", "", ""]);
        setError("");
        // TODO: Reset timer
      } else {
        setError(result.message || "خطا در ارسال مجدد کد");
        showError(result.message || "خطا در ارسال مجدد کد");
      }
    } catch (err) {
      setError("خطا در ارتباط با سرور");
      showError("خطا در ارتباط با سرور");
    } finally {
      setIsResending(false);
    }
  };
  
  return (
    <div>
      {/* Title and subtitle */}
      <div className="text-center">
        <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">
          {LOGIN_DIALOGS.otp_title}
        </h2>
        <p className="text-gray-500 text-sm mb-8">
          {LOGIN_DIALOGS.otp_subtitle.replace("{phone}", phone)}
        </p>
      </div>

      {/* OTP Input - Will be replaced with custom component */}
      <OtpInput ref={otpRef} otp={otp} setOtp={setOtp} error={error} />

      {error && (
        <p className="text-red-500 text-sm text-center mb-4">{error}</p>
      )}

      {/* Resend link TODO: Add counter later */}
      <div className="text-center mb-6">
        <button
          onClick={handleResend}
          disabled={isResending}
          className="text-sm text-blue-600 cursor-pointer hover:text-blue-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isResending ? "در حال ارسال..." : LOGIN_DIALOGS.otp_resend}        
        </button>
      </div>

      {/* Buttons */}
      <div className="flex gap-3">
        <Button
          onClick={onBack}
          variant="secondary"
          size="sm"
          className="flex-1 md:size-lg text-sm md:text-base"
          disabled={isLoading}
        >
          {LOGIN_DIALOGS.back_to_number}
        </Button>
        <Button
          onClick={handleSubmit}
          type={"submit"}
          fullWidth
          size="sm"
          className="flex-1 md:size-lg text-sm md:text-base"
          disabled={isLoading}
        >
           {isLoading ? "در حال تأیید..." : LOGIN_DIALOGS.verify_button}
        </Button>
      </div>
    </div>
  );
}
