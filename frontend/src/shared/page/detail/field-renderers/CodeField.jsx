export default function CodeField({ value }) {
  return (
    <pre className="text-[10px] font-mono bg-muted p-2 rounded overflow-auto max-h-60">
      {String(value)}
    </pre>
  );
}