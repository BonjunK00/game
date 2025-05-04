import Link from 'next/link';

const games = [
  {name: 'Borntris', path: '/borntris', desc: 'Stack blocks fast and think smart.'},
];

export default function HomePage() {
  return (
      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-bold">Available Games</h2>
          <p className="text-sm text-gray-500 mt-1">Play lightweight, focused games right in your
            browser.</p>
        </section>

        <ul className="grid gap-6 sm:grid-cols-2">
          {games.map((game) => (
              <li key={game.path}>
                <Link
                    href={game.path}
                    className="
                    block p-5 bg-white rounded-xl border border-gray-200 shadow-sm
                    hover:shadow-md hover:border-[#FF6B00] transition"
                >
                  <h3 className="text-lg font-semibold mb-1 text-[#111827]">{game.name}</h3>
                  <p className="text-sm text-gray-500">{game.desc}</p>
                </Link>
              </li>
          ))}
        </ul>
      </div>
  );
}