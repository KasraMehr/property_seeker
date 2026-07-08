// Left column: login form with phone input and submit button

// Components
import PhoneStep from "../steps/PhoneStep";
import OtpStep from "../steps/OtpStep";
import RegisterStep from "../steps/RegisterStep";

export default function LeftSection({
  currentStep,
  onNext,
  onBack,
  onDone,
  phone,
  setPhone,
  isNewUser,
  setIsNewUser,
}) {
  return (
    <div className="pt-4">

      {/* Step 0 : Phone number */}
      {currentStep === 0 && (
        <PhoneStep onNext={onNext} phone={phone} setPhone={setPhone} />
      )}

      {/* Step 1 : OTP Verification  */}
      {currentStep === 1 && (
        <OtpStep
          onNext={() => {
            // When OTP is verified and user is new, go to register
            // isNewUser will be set in OtpStep from API response
            onNext();
          }}
          onBack={onBack}
          onDone={() => {
            // User is existing, go to dashboard
            onDone();
          }}
          phone={phone}
          setIsNewUser={setIsNewUser}
        />
      )}

      {/* Step 2 : Register only for new memebers  */}
      {currentStep === 2 && (
        <RegisterStep onDone={onDone} isNewUser={isNewUser} phone={phone}/>
      )}
    </div>
  );
}
