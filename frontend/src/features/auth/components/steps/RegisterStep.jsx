// Step 3: New user registration form or success message for existing users
import { useState } from "react";
import Input from "../../../../shared/ui/Input";
import Button from "../../../../shared/ui/Button";
import { LOGIN_DIALOGS } from "../../constants/loginCard";
import { showSuccess, showError, showInfo } from "../../../../lib/toast";
import { validateFullName } from "../../../../utils/validators";
import useAuth from "../../../../hooks/useAuth";

export default function RegisterStep({ onDone, phone ,isNewUser = true }) {
  const { completeProfile } = useAuth();
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    // Validate full name
    const validation = validateFullName(name, lastName);

    if (!validation.isValid) {
      setError(validation.message);
      return;
    }

    //SUCCESS
    setError("");
    setIsLoading(true);

    // console.log("📝 Register data:", { name, lastName });

    try {
      showInfo("در حال ثبت نام...");
      const result = await completeProfile({
        phone,
        first_name: name,
        last_name: lastName,
      });

      if (result.success) {
        showSuccess("🎉 ثبت نام با موفقیت انجام شد!");
        setTimeout(onDone, 1500);
      } else {
        setError(result.message || "خطا در ثبت نام");
        showError(result.message || "خطا در ثبت نام");
      }
    } catch (err) {
      setError("خطا در ارتباط با سرور");
      showError("خطا در ارتباط با سرور");
    } finally {
      setIsLoading(false);
    }
  };

  // If user is existing, show success message
  if (!isNewUser) {
    return (
      <div className="text-center py-8">
        <div className="text-4xl mb-4">🎉</div>
        <h2 className="text-2xl font-bold text-green-600 mb-2">
          {LOGIN_DIALOGS.register_success}
        </h2>
        <p className="text-gray-500 text-sm">
          {LOGIN_DIALOGS.register_redirecting}
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="text-center">
        <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">
          {LOGIN_DIALOGS.register_title}
        </h2>
        <p className="text-gray-500 text-sm mb-8">
          {LOGIN_DIALOGS.register_subtitle}
        </p>
      </div>

      <div className="space-y-4">
        <Input
          label={LOGIN_DIALOGS.register_name_label}
          type="text"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setError("");
          }}
          className="text-lg"
          labelClassName="text-right"
          errorClassName="text-right"
          name="register_name"
        />

        <Input
          label={LOGIN_DIALOGS.register_lastname_label}
          type="text"
          value={lastName}
          onChange={(e) => {
            setLastName(e.target.value);
            setError("");
          }}
          className="text-lg"
          labelClassName="text-right"
          errorClassName="text-right"
          name="register_lastname"
        />

        {error && <p className="text-red-500 text-sm text-right">{error}</p>}

        <Button
          onClick={handleSubmit}
          fullWidth
          size="lg"
          className="mt-4"
          disabled={isLoading || !name.trim() || !lastName.trim()}
        >
          {isLoading ? "در حال ثبت..." : LOGIN_DIALOGS.register_button}
        </Button>
      </div>
    </div>
  );
}
