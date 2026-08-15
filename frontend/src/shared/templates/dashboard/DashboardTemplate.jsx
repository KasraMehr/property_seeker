import { MotionDiv } from "@/animations/MotionElements";

export default function DashboardTemplate({
  children,
  className = "",
}) {
  return (
    <MotionDiv
      className={`space-y-6 ${className}`}
      delay={0.1}
    >
      {children}
    </MotionDiv>
  );
}