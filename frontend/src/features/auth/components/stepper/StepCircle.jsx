// Single step circle with number, label, and status (active/completed/upcoming)

export default function StepCircle({ number, label, isActive = false, isCompleted = false }) {
  return (
    <div className="flex items-center gap-4">
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 shrink-0 ${
          isActive
            ? "bg-blue-600 text-white ring-4 ring-blue-200"
            : isCompleted
            ? "bg-green-500 text-white"
            : "bg-gray-200 text-gray-400"
        }`}
      >
        {isCompleted ? "✓" : number}
      </div>
      <span
        className={`text-sm font-medium ${
          isActive
            ? "text-blue-600"
            : isCompleted
            ? "text-green-600"
            : "text-gray-400"
        }`}
      >
        {label}
      </span>
    </div>
  );
}