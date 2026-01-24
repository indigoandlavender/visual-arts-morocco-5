// =============================================================================
// Main Layout
// Moroccan Art Platform
// =============================================================================

import type { ReactNode } from 'react';
import Link from 'next/link';

interface MainLayoutProps {
  children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b bg-white">
        <nav className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-xl font-bold">
              Morocco Art Archive
            </Link>
            <div className="flex gap-6">
              <Link href="/photography" className="hover:text-blue-600">
                Photography
              </Link>
              <Link href="/painting" className="hover:text-green-600">
                Painting
              </Link>
              <Link href="/artists" className="hover:text-gray-600">
                Artists
              </Link>
              <Link href="/works" className="hover:text-gray-600">
                Works
              </Link>
              <Link href="/search" className="hover:text-gray-600">
                Search
              </Link>
            </div>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-1 bg-white">{children}</main>

      {/* Footer */}
      <footer className="border-t bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="grid grid-cols-4 gap-8">
            <div>
              <h4 className="font-semibold mb-3">Browse</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><Link href="/photography" className="hover:underline">Photography</Link></li>
                <li><Link href="/painting" className="hover:underline">Painting</Link></li>
                <li><Link href="/artists" className="hover:underline">All Artists</Link></li>
                <li><Link href="/works" className="hover:underline">All Works</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Explore</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><Link href="/movements" className="hover:underline">Movements</Link></li>
                <li><Link href="/themes" className="hover:underline">Themes</Link></li>
                <li><Link href="/cities" className="hover:underline">Cities</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Tools</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><Link href="/search" className="hover:underline">Search</Link></li>
                <li><Link href="/timeline" className="hover:underline">Timeline</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">About</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><Link href="/about" className="hover:underline">About</Link></li>
                <li><Link href="/methodology" className="hover:underline">Methodology</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t text-center text-sm text-gray-500">
            Morocco Art Archive - A reference database for Moroccan visual art
          </div>
        </div>
      </footer>
    </div>
  );
}
