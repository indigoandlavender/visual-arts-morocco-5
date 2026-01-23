// =============================================================================
// Main Layout
// Moroccan Art Platform
// =============================================================================

import type { ReactNode } from 'react';

interface MainLayoutProps {
  children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header - Component to be implemented */}
      <header>
        <nav>{/* Navigation component */}</nav>
      </header>

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* Footer - Component to be implemented */}
      <footer>{/* Footer component */}</footer>
    </div>
  );
}
