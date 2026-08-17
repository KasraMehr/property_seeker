export default function JsonField({ value }) {
  return (
    <pre className="text-[10px] font-mono bg-muted p-2 rounded overflow-auto max-h-40">
      {JSON.stringify(value, null, 2)}
    </pre>
  );
}