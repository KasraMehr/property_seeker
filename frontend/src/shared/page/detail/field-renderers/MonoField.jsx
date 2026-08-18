export default function MonoField({ value }) {
  return (
    <span className="text-xs font-mono text-muted-foreground">
      {String(value)}
    </span>
  );
}