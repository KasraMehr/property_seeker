// Step 1: Phone number input with send button
import { useState, useEffect } from "react";

// Components
import Input from "../../../../shared/ui/Input";
import Button from "../../../../shared/ui/Button";
import { LOGIN_DIALOGS } from "../../constants/loginCard";

//Icons
import { House } from "lucide-react";

//Utils
import { validatePhone } from "../../../../utils/validators";
import useAuth from "../../../../hooks/useAuth";
import { showError } from "../../../../lib/toast";

export default function PhoneStep({ onNext, phone, setPhone }) {
  const { sendOTP } = useAuth();
  const [error, setError] = useState("");
  const [isValidPhone, setIsValidPhone] = useState(false);
  const [showValidation, setShowValidation] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // real-time validation
  useEffect(() => {
    if (phone.length > 0) {
      setShowValidation(true);
      const validation = validatePhone(phone);
      setIsValidPhone(validation.isValid);
      if (validation.isValid) {
        setError("");
      }
    } else {
      setShowValidation(false);
      setIsValidPhone(false);
    }
  }, [phone]);

  const handleSubmit = async () => {
    setError("");
    setIsLoading(true);

    const validation = validatePhone(phone);
    if (!validation.isValid) {
      setError(validation.message);
      setIsLoading(false);
      return;
    }

    try {
      const result = await sendOTP(phone);
      if (result.success) {
        onNext();
      } else {
        setError(result.message || "خطا در ارسال کد");
        showError(result.message || "خطا در ارسال کد");
      }
    } catch (err) {
      setError("خطا در ارتباط با سرور");
      showError("خطا در ارتباط با سرور");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {/*Title and subtitle */}
      <div className="text-center">
        <h1 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">
          {LOGIN_DIALOGS.login_title}
        </h1>
        <p className="text-gray-500 text-sm mb-8">
          {LOGIN_DIALOGS.login_subtitle}
        </p>
      </div>

      {/* Input and OTP button  */}
      <Input
        label={LOGIN_DIALOGS.phone_label}
        type="tel"
        placeholder={LOGIN_DIALOGS.phone_placeholder}
        value={phone}
        name="phone"
        onChange={(e) => setPhone(e.target.value)}
        error={error}
        dir="ltr"
        className="text-lg"
        isValid={isValidPhone}
        showValidation={showValidation}
        style={{ direction: "ltr" }}
      />

      <Button
        onClick={handleSubmit}
        type={"submit"}
        fullWidth
        size="lg"
        className="mt-6"
        disabled={isLoading || !isValidPhone}
      >
        {isLoading ? "در حال ارسال..." : LOGIN_DIALOGS.submit_button}
      </Button>
    </div>
  );
}
