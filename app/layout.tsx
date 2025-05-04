import './globals.css';
import Link from 'next/link';

export const metadata = {
  title: 'Game Playground',
  description: 'Simple browser games with a modern vibe',
};

export default function RootLayout({children}: { children: React.ReactNode }) {
  return (
      <html lang="en">
      <body className="min-h-screen bg-[#F9FAFB] text-[#111827] font-sans antialiased">
      <header className="border-b border-gray-200 bg-white">
        <div className="max-w-screen-md mx-auto px-4 py-5 flex justify-between items-center">
          <Link href="/"
                className="text-xl font-bold tracking-tight text-[#FF6B00] hover:opacity-80 transition">
            🕹️ Game Hub
          </Link>
        </div>
      </header>

      <main className="max-w-screen-md mx-auto px-4 py-10">{children}</main>

      <footer className="text-center text-xs text-gray-400 py-6">
        © 2025 Game Hub — Created by Bonjun · <a href="https://github.com/BonjunK00"
                                                 className="hover:underline">GitHub</a>
      </footer>
      </body>
      </html>
  );
}