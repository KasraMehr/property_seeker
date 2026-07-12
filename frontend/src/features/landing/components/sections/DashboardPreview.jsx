export default function DashboardPreview() {
  return (
    <section id="dashboard" className="min-h-screen py-20 flex items-center justify-center bg-linear-to-b from-background to-surface/30">
      <div className="text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-4">
          داشبورد <span className="text-primary">هوشمند</span>
        </h2>
        <p className="text-muted text-lg max-w-2xl mx-auto">
          تست بخش Dashboard Preview 
        </p>
      </div>
    </section>
  );
}