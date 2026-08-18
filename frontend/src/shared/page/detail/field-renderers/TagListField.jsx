export default function TagListField({ value }) {
  const tags = Array.isArray(value) ? value : [value];
  return (
    <div className="flex flex-wrap gap-1">
      {tags.map((t, i) => (
        <span key={i} className="text-xs bg-secondary px-2 py-0.5 rounded">
          {t?.name || t}
        </span>
      ))}
    </div>
  );
}