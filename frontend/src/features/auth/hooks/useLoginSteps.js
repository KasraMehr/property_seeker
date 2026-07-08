// Hook for managing login steps (current step, next, back, goTo)
import { useState } from "react";

export default function useLoginSteps(initialStep = 0) {
  const [currentStep, setCurrentStep] = useState(initialStep);

  const next = () => {
    setCurrentStep((prev) => Math.min(prev + 1, 2)); // حداکثر ۲ (مرحله سوم)
  };

  const back = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0)); // حداقل ۰ (مرحله اول)
  };

  const goTo = (step) => {
    if (step >= 0 && step <= 2) {
      setCurrentStep(step);
    }
  };

  const reset = () => {
    setCurrentStep(0);
  };

  return {
    currentStep,
    next,
    back,
    goTo,
    reset,
    isFirst: currentStep === 0,
    isLast: currentStep === 2,
  };
}