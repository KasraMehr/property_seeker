export default function JsonBadgeField({ value }) {
  const arr = Array.isArray(value)
    ? value
    : typeof value === "object"
      ? Object.keys(value)
      : [value];
  return (
    <div className="flex flex-wrap gap-1">
      {arr.map((item, i) => (
        <span
          key={i}
          className="text-[10px] bg-secondary px-1.5 py-0.5 rounded"
        >
          {item}
        </span>
      ))}
    </div>
  );
}