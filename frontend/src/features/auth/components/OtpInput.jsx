// Reusable OTP input component with 6 digits, auto-focus, and paste support
import {
  useRef,
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";

const OtpInput = forwardRef(({ otp, setOtp, error }, ref) => {
  const inputRefs = useRef([]);
  const [submitted, setSubmitted] = useState(false);

  // let the parent control the component
  useImperativeHandle(ref, () => ({
    setSubmitted: (value) => setSubmitted(value),
    resetSubmitted: () => setSubmitted(false),
    getSubmitted: () => submitted,
  }));

  // initial focus on first box
  useEffect(() => {
    setTimeout(() => {
      inputRefs.current[0]?.focus();
    }, 100);
  }, []);

  const handleChange = (index, value) => {
    // only digits
    if (value && !/^[0-9]$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // it's not submitted
    if (submitted) setSubmitted(false);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // keyboard handlers
  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }

    if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }

    if (e.key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // paste the code
  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);
    if (!/^[0-9]+$/.test(pastedData)) return;

    const newOtp = [...otp];
    for (let i = 0; i < pastedData.length; i++) {
      newOtp[i] = pastedData[i];
    }
    setOtp(newOtp);
    if (submitted) setSubmitted(false);

    const nextEmptyIndex = newOtp.findIndex((digit) => digit === "");
    const focusIndex = nextEmptyIndex === -1 ? 5 : nextEmptyIndex;
    inputRefs.current[focusIndex]?.focus();
  };

  // errors only if it's submitted
  const isEmpty = otp.every((digit) => digit === "");
  const showError = submitted && (isEmpty || !!error);

  return (
    <div
      className="flex justify-center gap-2 mb-6"
      dir="ltr"
      style={{ direction: "ltr" }}
    >
      {otp.map((digit, index) => (
        <input
          key={index}
          ref={(el) => (inputRefs.current[index] = el)}
          type="text"
          maxLength={1}
          value={digit}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={index === 0 ? handlePaste : undefined}
          dir="ltr"
          style={{ direction: "ltr" }}
          className={`w-12 h-14 text-center text-xl font-bold rounded-xl border ${
            showError ? "border-red-500" : "border-gray-200"
          } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition`}
        />
      ))}
    </div>
  );
});

export default OtpInput;
