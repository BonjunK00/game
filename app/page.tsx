// app/page.tsx
import Link from 'next/link';

const games = [
  { name: 'Block Fall', path: '/blockfall' },
];

export default function HomePage() {
  return (
      <div>
        <h2 className="text-2xl font-semibold mb-4">Available Games</h2>
        <ul className="space-y-2">
          {games.map((game) => (
              <li key={game.path}>
                <Link
                    href={game.path}
                    className="
                    block p-3 rounded shadow
                    bg-white text-blue-900 hover:bg-blue-50
                    dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700
                    transition-colors
                    "
                >
                  {game.name}
                </Link>
              </li>
          ))}
        </ul>
      </div>
  );
}