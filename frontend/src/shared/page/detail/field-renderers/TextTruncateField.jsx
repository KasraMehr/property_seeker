export default function TextTruncateField({ value }) {
  return (
    <span
      className="text-xs text-muted-foreground truncate max-w-50"
      title={String(value)}
    >
      {String(value)}
    </span>
  );
}