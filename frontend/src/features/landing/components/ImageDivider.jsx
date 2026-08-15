export default function ImageDivider({src}) {
  return (
    <section className="relative w-full h-60 md:h-80 overflow-hidden">
      <img
        src={src}  
        alt=""
        className="w-full h-full object-cover"
      />
      {/* Overlay */}
      <div className="absolute inset-0 bg-background/30" />
    </section>
  );
}