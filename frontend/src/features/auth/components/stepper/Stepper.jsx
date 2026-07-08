// Stepper wrapper that renders a list of StepCircle components

import StepCircle from "./StepCircle";

export default function Stepper({ steps, currentStep = 0 }) {
  return (
    <div className="space-y-6">
      {steps.map((step, index) => (
        <StepCircle
          key={step.id}
          number={index + 1}
          label={step.title}
          isActive={index === currentStep}
          isCompleted={index < currentStep}
        />
      ))}
    </div>
  );
}