// app/layout.tsx
import './globals.css';
import Link from 'next/link';

export const metadata = {
  title: 'Game Hub',
  description: 'Play simple games!',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
      <html lang="en" className="dark">
      <body className="min-h-screen bg-blue-50 text-blue-900 dark:bg-gray-900 dark:text-gray-100 transition-colors duration-300">
      <header className="bg-blue-200 dark:bg-gray-800 shadow p-4">
        <div className="max-w-4xl mx-auto flex justify-between">
          <h1 className="text-xl font-bold">🎮 Game Hub</h1>
          <Link href="/" className="text-blue-800 dark:text-blue-300 hover:underline text-sm">
            Home
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {children}
      </main>

      <footer className="text-center text-sm text-blue-800 dark:text-gray-400 py-4 border-t border-blue-300 dark:border-gray-700">
        © 2025 Game Hub
      </footer>
      </body>
      </html>
  );
}