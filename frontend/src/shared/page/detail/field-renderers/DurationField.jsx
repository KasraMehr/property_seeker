export default function DurationField({ value }) {
  const mins = Math.floor(value / 60);
  const secs = value % 60;
  return (
    <span>
      {mins > 0 ? `${mins}m ` : ""}
      {secs}s
    </span>
  );
}