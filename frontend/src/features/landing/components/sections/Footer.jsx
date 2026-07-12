import React from 'react'

export default function Footer() {
  return (
    <footer id="contact" className="bg-surface/50 backdrop-blur-sm border-t border-border py-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-muted text-sm">
            © {new Date().getFullYear()} تمامی حقوق محفوظ است.
          </p>
          <div className="flex gap-4">
            <a href="#" className="text-muted hover:text-primary text-sm transition-colors">
              تماس با ما
            </a>
            <a href="#" className="text-muted hover:text-primary text-sm transition-colors">
              حریم خصوصی
            </a>
            <a href="#" className="text-muted hover:text-primary text-sm transition-colors">
              قوانین
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}