import React from 'react'

export default function HeroSection() {
  return (
    <section id="home" className="min-h-screen pt-20 flex items-center justify-center bg-linear-to-b from-surface/50 to-background">
        
      <div className="text-center">
        <h1 className="text-5xl md:text-7xl font-bold mb-4">
          <span className="text-foreground">خرید و فروش</span>
          <br />
          <span className="text-primary">املاک هوشمند</span>
        </h1>
        <p className="text-muted text-lg md:text-xl max-w-2xl mx-auto">
          تست بخش Hero 
        </p>
      </div>
    </section>
  )
}
